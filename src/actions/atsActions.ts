"use server";

import PdfParse from "pdf-parse-new";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

// Define the state type for useActionState
export interface ActionState {
  error?: string;
  details?: string;
  structuredData?: ApiResponse;
}

export async function analyzeResume(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const resume = formData.get("resume") as File | null;
    const jobDesc = formData.get("jobdesc") as string | null;

    // Validate inputs
    if (!resume || !jobDesc) {
      return {
        error: "Resume and Job Description are required",
        structuredData: undefined,
      };
    }

    // Basic Job Description Validation
    const jobKeywords = ["Responsibilities", "Requirements", "Skills", "Qualifications", "Duties"];
    const isValidJobDesc = jobKeywords.some((word) => jobDesc.includes(word)) && jobDesc.split(" ").length > 30;

    if (!isValidJobDesc) {
      return {
        error: "Invalid job description. Please provide a detailed job description.",
        structuredData: undefined,
      };
    }

    let resumeText = "";
    const buffer = Buffer.from(await resume.arrayBuffer());

    // Extract text based on file type
    try {
      if (resume.type === "application/pdf") {
        const pdfData = await PdfParse(buffer);
        resumeText = pdfData.text;
      } else if (resume.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const docData = await mammoth.extractRawText({ buffer });
        resumeText = docData.value;
      } else {
        return {
          error: "Unsupported file format. Please upload PDF or Word document",
          structuredData: undefined,
        };
      }
    } catch (fileError) {
      console.error("File processing error:", fileError);
      return {
        error: "Error processing resume file",
        details: (fileError as Error).message,
        structuredData: undefined,
      };
    }

    // Validate resume content
    const resumeKeywords = ["Work Experience", "Education", "Skills", "Projects", "Certifications", "Summary"];
    const containsResumeContent = resumeKeywords.some((keyword) => resumeText.includes(keyword));

    if (!containsResumeContent) {
      return {
        error: "Uploaded file does not appear to be a resume",
        details: "No recognizable resume sections found",
        structuredData: undefined,
      };
    }

    // Initialize AI model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // AI-Powered Job Description Validation
    const validationPrompt = `Determine whether the following text is a valid job description. If it is, respond with "valid". If it is not, respond with "invalid".\n\n**Job Description:**\n${jobDesc}`;
    
    let validationResult;
    try {
      validationResult = await model.generateContent([validationPrompt]);
    } catch (aiError) {
      return {
        error: "AI validation failed",
        details: (aiError as Error).message,
        structuredData: undefined,
      };
    }

    const validationResponse = validationResult.response.text().trim();
    if (validationResponse.toLowerCase() !== "valid") {
      return {
        error: "Invalid job description detected by AI",
        structuredData: undefined,
      };
    }

    // ATS Analysis
    const atsPrompt = `
    Analyze the provided resume against the job description for ATS compliance, relevance, and effectiveness. Provide a structured JSON response for visualization.
    
    **Evaluation Criteria:**
    
    1.  **ATS Score (0-100):**
        * **Relevance (0-40):** Match between resume content and job requirements.
        * **Keyword Match (0-30):** Presence of key job-related keywords.
        * **Formatting/Readability (0-20):** Clear structure, bullet points, headings.
        * **Contact Completeness (0-10):** Valid email, LinkedIn, GitHub, etc. (10 if all are present).
    
    2.  **Missing Sections:**
        * **Critical:** Work Experience, Education, Skills, Contact Info, Projects.
        * **Recommended:** Certifications, Achievements, Summary, Technical Stack.
    
    3.  **Missing Skills:**
        * **Must-Have:** Essential skills from the job description.
        * **Nice-to-Have:** Preferred but optional skills.
    
    4.  **Missing Achievements:**
        * Identify and suggest quantifiable achievements for Work Experience and Projects.
    
    5.  **Contact Information Validation:**
        * Extract and validate email, LinkedIn, GitHub, and portfolio links.
        * Recommend adding missing links.
    
    6.  **AI-Powered Suggestions:**
        * Provide detailed feedback in Markdown format for resume improvement.
        * Include specific action points (e.g., "Add bullet points to Experience section").
    
    ---
    **Resume:**
    ${resumeText}
    
    **Job Description:**
    ${jobDesc}
    
    ---
    **JSON Response Format:**
    
    \`\`\`json
    {
      "ats_score": {
        "total": 0,
        "breakdown": {
          "relevance": 0,
          "keyword_match": 0,
          "formatting": 0,
          "contact_completeness": 0
        }
      },
      "missing_sections": {
        "critical": [],
        "recommended": []
      },
      "missing_skills": {
        "must_have": [],
        "nice_to_have": []
      },
      "missing_achievements": [],
      "contact_info": {
        "email": null,
        "linkedin": null,
        "github": null,
        "portfolio": null
      },
      "suggestions": []
    }
    \`\`\`
    `;

    let result;
    try {
      result = await model.generateContent([atsPrompt]);
    } catch (aiError) {
      return {
        error: "AI analysis failed",
        details: (aiError as Error).message,
        structuredData: undefined,
      };
    }

    const analysis = result.response.text().replace(/^```json/, "").replace(/```$/, "").trim();
    try {
      const parsedAnalysis: ApiResponse = JSON.parse(analysis);
      return { structuredData: parsedAnalysis };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (parseError) {
      return {
        error: "Failed to parse AI response",
        details: `Raw response: ${analysis}`,
      };
    }
  } catch (error) {
    return { error: "Processing error", details: (error as Error).message };
  }
}
