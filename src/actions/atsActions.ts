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
  missing_skills: {
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
    const jobDesc = formData.get("jobdesc");

    // Early input validation for type and size
    if (!(resume instanceof File) || typeof jobDesc !== "string") {
      return {
        error: "Invalid input types",
        details: "Resume must be a file and job description must be a string",
        structuredData: undefined,
      };
    }

    if (resume.size > 5 * 1024 * 1024) {
      // 5MB limit
      return {
        error: "Resume file is too large",
        details: "Please upload a file smaller than 5MB",
        structuredData: undefined,
      };
    }

    if (!jobDesc.trim() || jobDesc.length > 10000) {
      // Check for empty or overly long job description
      return {
        error: "Invalid job description length",
        details:
          "Job description must not be empty and should be less than 10,000 characters",
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

    // AI-powered resume validation
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
          setTimeout(
            () => reject(new Error("Resume validation timed out")),
            30000
          )
        ), // 30s timeout
      ]);
      const resumeValidationResponse = JSON.parse(
        resumeValidationResult.response.text().trim().replace(/^```json/, "")
        .replace(/```$/, "")
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

    // AI-powered job description validation
    const jobDescValidationPrompt = `
      Determine whether the following text is a valid job description. A job description typically includes details about job responsibilities, requirements, and qualifications. Respond with a JSON object containing a single key "isValid" with a boolean value.
      **Job Description:**
      ${jobDesc}
    `;

    let jobDescValidationResult;
    try {
      jobDescValidationResult = await Promise.race<GenerateContentResult>([
        model.generateContent([jobDescValidationPrompt]),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Job description validation timed out")),
            30000
          )
        ), // 30s timeout
      ]);
      const jobDescValidationResponse = JSON.parse(
        jobDescValidationResult.response.text().trim().replace(/^```json/, "")
        .replace(/```$/, "")
      );
      if (!jobDescValidationResponse.isValid) {
        return {
          error: "Invalid job description detected by AI",
          structuredData: undefined,
        };
      }
    } catch (aiError) {
      console.error(
        "Job description validation failed:",
        (aiError as Error).message
      );
      return {
        error: "Job description validation failed",
        details: (aiError as Error).message,
        structuredData: undefined,
      };
    }

    // ATS Analysis
    const atsPrompt = `
      Analyze the provided resume against the job description for ATS compliance, relevance, and effectiveness. Provide a structured JSON response for visualization.
      
      **Evaluation Criteria:**
      1. ATS Score (0-100): Relevance (0-40), Keyword Match (0-30), Formatting/Readability (0-20), Contact Completeness (0-10).
      2. Missing Sections: Critical (e.g., Work Experience), Recommended (e.g., Certifications).
      3. Missing Skills: Must-Have and Nice-to-Have from the job description.
      4. Missing Achievements: Suggest quantifiable achievements.
      5. Contact Information Validation: Extract and validate email, LinkedIn, etc.
      6. AI-Powered Suggestions: Detailed feedback in Markdown.

      **Resume:**
      ${resumeText}
      
      **Job Description:**
      ${jobDesc}
      
      **JSON Response Format:**
      {
        "ats_score": { "total": 0, "breakdown": { "relevance": 0, "keyword_match": 0, "formatting": 0, "contact_completeness": 0 } },
        "missing_sections": { "critical": [], "recommended": [] },
        "missing_skills": { "must_have": [], "nice_to_have": [] },
        "missing_achievements": [],
        "contact_info": { "email": null, "linkedin": null, "github": null, "portfolio": null },
        "suggestions": []
      }
    `;

    let atsResult;
    try {
      atsResult = await Promise.race<GenerateContentResult>([
        model.generateContent([atsPrompt]),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("ATS analysis timed out")), 60000)
        ), // 60s timeout
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
