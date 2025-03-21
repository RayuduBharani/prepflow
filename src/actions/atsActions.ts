"use server";

import PdfParse from "pdf-parse-new";
import mammoth from "mammoth";
import { GenerateContentResult, GoogleGenerativeAI } from "@google/generative-ai";

// Validate environment variable
const apiKey = process.env.GOOGLE_AI_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_AI_API_KEY is not set in the environment variables");
}
const genAI = new GoogleGenerativeAI(apiKey);

// Define response type
export interface ApiResponse {
  ats_score: {
    total: number;
    breakdown: {
      relevance: number;
      keyword_match: number;
      formatting: number;
      contact_completeness: number;
    };
  };
  missing_sections: {
    critical: string[];
    recommended: string[];
  };
  missing_skills?: {
    must_have: string[];
    nice_to_have: string[];
  };
  missing_achievements: string[];
  contact_info: {
    email: string | null;
    linkedin: string | null;
    github: string | null;
    portfolio: string | null;
  };
  suggestions: string[];
}

export type ActionState = {
  error?: string;
  details?: string;
  structuredData?: ApiResponse;
};

export async function analyzeResume(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const resume = formData.get("resume");
    const jobDesc = formData.get("jobdesc") || ""; // Default to empty string if not provided

    // Validate resume file
    if (!(resume instanceof File)) {
      return {
        error: "Invalid input type",
        details: "Resume must be a file",
        structuredData: undefined,
      };
    }

    if (resume.size > 5 * 1024 * 1024) {
      return {
        error: "Resume file is too large",
        details: "Please upload a file smaller than 5MB",
        structuredData: undefined,
      };
    }

    // Extract resume text
    let resumeText;
    try {
      resumeText = await extractResumeText(resume);
    } catch (error) {
      return {
        error: "Error processing resume file",
        details: (error as Error).message,
        structuredData: undefined,
      };
    }

    // Initialize AI model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Validate resume content
    const resumeValidationPrompt = `
      Determine whether the following text is a resume. A resume typically includes sections like work experience, education, skills, and contact information. Respond with a JSON object containing a single key "isResume" with a boolean value.
      **Text:**
      ${resumeText}
    `;

    let resumeValidationResult;
    try {
      resumeValidationResult = await Promise.race<GenerateContentResult>([
        model.generateContent([resumeValidationPrompt]),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Resume validation timed out")), 30000)
        ),
      ]);
      const resumeValidationResponse = JSON.parse(
        resumeValidationResult.response.text().trim().replace(/^```json/, "").replace(/```$/, "")
      );
      if (!resumeValidationResponse.isResume) {
        return {
          error: "Uploaded file does not appear to be a resume",
          structuredData: undefined,
        };
      }
    } catch (aiError) {
      console.error("Resume validation failed:", (aiError as Error).message);
      return {
        error: "Resume validation failed",
        details: (aiError as Error).message,
        structuredData: undefined,
      };
    }

    // Skip job description validation if empty
    // let jobDescValid = true;
    if (jobDesc) {
      const jobDescValidationPrompt = `
        Determine whether the following text is a valid job description. A job description typically includes details about job responsibilities, requirements, and qualifications. Respond with a JSON object containing a single key "isValid" with a boolean value.
        **Job Description:**
        ${jobDesc}
      `;

      try {
        const jobDescValidationResult = await Promise.race<GenerateContentResult>([
          model.generateContent([jobDescValidationPrompt]),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Job description validation timed out")), 30000)
          ),
        ]);
        const jobDescValidationResponse = JSON.parse(
          jobDescValidationResult.response.text().trim().replace(/^```json/, "").replace(/```$/, "")
        );
        if (!jobDescValidationResponse.isValid) {
          return {
            error: "Invalid job description detected by AI",
            structuredData: undefined,
          };
        }
      } catch (aiError) {
        console.error("Job description validation failed:", (aiError as Error).message);
        return {
          error: "Job description validation failed",
          details: (aiError as Error).message,
          structuredData: undefined,
        };
      }
    }

    // ATS Analysis (adjusted for optional job description)
    const atsPrompt = `
    Analyze the provided resume for ATS compliance, relevance, and effectiveness. ${jobDesc ? "Compare with the provided job description." : "No job description provided; assess for general ATS compatibility."} Output a structured JSON response.
    
    **Evaluation Criteria:**
    1. **ATS Score (0-100)**: Compute total score from:
       - **Relevance (0-35)**: ${jobDesc ? "Measure alignment with job description (role, responsibilities, industry). Award up to 35 for near-perfect matches." : "Assess fit for typical roles based on content. Award up to 35 for clear, versatile applicability."}
       - **Keyword Match (0-25)**: ${jobDesc ? "Match key skills/tools from job description. Award up to 25 for extensive overlap." : "Check for industry-standard keywords. Award up to 25 for a comprehensive set."}
       - **Structure and Formatting (0-30)**: Score organization and ATS-friendliness (clear sections like Work Experience, Education, Skills; consistent formatting; machine-readable text). Award up to 30 for resumes with all critical sections, professional formatting, and optimal readability.
       - **Contact Completeness (0-10)**: Confirm presence of email, LinkedIn, etc. Award up to 10 if email and at least one professional link (e.g., LinkedIn) are present.
    
    2. **Missing Sections**: List absent sections:
       - **Critical**: Work Experience, Education, Skills.
       - **Recommended**: Certifications, Projects, Volunteer Work.
    
    ${jobDesc ? `3. **Missing Skills**: Compare with job description:
       - **Must-Have**: Essential skills required.
       - **Nice-to-Have**: Skills that enhance candidacy.` : ""}
    
    4. **Missing Achievements**: Suggest quantifiable results (e.g., "Increased revenue by 20%") based on ${jobDesc ? "resume and job description." : "resume content."}
    
    5. **Contact Information**: Extract and validate:
       - Email, LinkedIn, GitHub, Portfolio, Phone (if present).
    
    6. **Suggestions**: List up to 5 key actionable tips to improve ATS score. If the resume is near-perfect, suggest minor enhancements or say "Resume is highly optimized."
    
    **Input:**
    - Resume: [${resumeText}]
    - Job Description: ${jobDesc || "Not provided"}
    - Customization: None
    
    **Guidance for High Scores:**
    - For an exceptional resume (e.g., all critical sections present, strong keyword alignment, professional formatting, complete contact info), aim for a total score of 90-100.
    - Avoid unnecessary deductions; only reduce points for clear deficiencies (e.g., missing critical sections, unreadable formatting, or absent contact info).
    - If the resume aligns perfectly with the job description (when provided), prioritize maximum scores in relevance and keyword match.
    
    **JSON Response:**
    {
      "ats_score": {
        "total": 0,
        "breakdown": {
          "relevance": 0,
          "keyword_match": 0,
          "structure_formatting": 0,
          "contact_completeness": 0
        }
      },
      "missing_sections": {
        "critical": [],
        "recommended": []
      },
      ${jobDesc ? `"missing_skills": {"must_have": [],"nice_to_have": []},` : ""}
      "missing_achievements": [],
      "contact_info": {
        "email": null,
        "linkedin": null,
        "github": null,
        "portfolio": null,
        "phone": null
      },
      "suggestions": []
    }
    `;
  

    let atsResult;
    try {
      atsResult = await Promise.race<GenerateContentResult>([
        model.generateContent([atsPrompt]),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("ATS analysis timed out")), 60000)
        ),
      ]);
    } catch (aiError) {
      console.error("ATS analysis failed:", (aiError as Error).message);
      return {
        error: "ATS analysis failed",
        details: (aiError as Error).message,
        structuredData: undefined,
      };
    }

    const analysis = atsResult.response
      .text()
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();
    try {
      const parsedAnalysis: ApiResponse = JSON.parse(analysis);
      return { structuredData: parsedAnalysis };
    } catch (parseError) {
      console.error(
        "Failed to parse ATS analysis response:",
        (parseError as Error).message
      );
      return {
        error: "Failed to parse ATS analysis response",
        details: `Raw response: ${analysis}`,
        structuredData: undefined,
      };
    }
  } catch (error) {
    console.error("Unexpected error:", (error as Error).message);
    return {
      error: "An unexpected error occurred",
      details: (error as Error).message,
      structuredData: undefined,
    };
  }
}

async function extractResumeText(resume: File): Promise<string> {
  const buffer = Buffer.from(await resume.arrayBuffer());
  if (resume.type === "application/pdf") {
    const pdfData = await PdfParse(buffer);
    return pdfData.text;
  } else if (
    resume.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const docData = await mammoth.extractRawText({ buffer });
    return docData.value;
  } else {
    throw new Error(
      "Unsupported file format. Please upload PDF or Word document"
    );
  }
}