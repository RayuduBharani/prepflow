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
    Analyze the following **resume** against the provided **job description**, evaluating it for **ATS compliance, relevance, and overall effectiveness**. Provide a **structured JSON response** optimized for visualization.

    ### **Evaluation Criteria:**
    1. **ATS Score (0-100)**
       - Based on **keyword match**, section completeness, and job relevance.
       - Breakdown:
         - **Relevance Score (0-40)**: Match between resume content and job description.
         - **Keyword Match (0-30)**: Presence of important job-related keywords.
         - **Formatting & Readability (0-20)**: Clear structure, bullet points, proper headings.
         - **Contact & Link Completeness (0-10)**: Valid LinkedIn, GitHub, email, etc. Also give 10 if these LinkedIn, GitHub, email is present.

    2. **Missing Sections** *(Categorized for better insights)*
       - **Critical**: Work Experience, Education, Projects, Skills, Contact Info.
       - **Recommended**: Certifications, Achievements, Summary, Technical Stack.

    3. **Missing Skills** *(Must-have & Nice-to-have skills)*
       - **Must-have:** Skills that are crucial for this role.
       - **Nice-to-have:** Preferred but not mandatory skills.

    4. **Missing Achievements**
       - Identify **quantifiable achievements** missing from Work Experience or Projects.
       - Examples: "Increased system efficiency by 25%" or "Reduced development time by 40%".

    5. **Contact Information Validation**
       - Extract **email, LinkedIn, GitHub, personal website**, and ensure validity.
       - If any key link is missing, recommend adding it.

    6. **AI-Powered Suggestions**
       - Provide **detailed feedback** to improve the resume.
       - Include specific action points like "Add bullet points under Experience" or "Highlight key achievements".

    ---
    ### **Resume:**
    ${resumeText}

    ### **Job Description:**
    ${jobDesc}

    ---
    **Expected JSON Response Format:**
    \`\`\`json
    {
      "ats_score": {
        "total": "(0-100)",
        "breakdown": {
          "relevance": "(0-40)",
          "keyword_match": "(0-30)",
          "formatting": "(0-20)",
          "contact_completeness": "(0-10)"
        }
      },
      "missing_sections": {
        "critical": ["Missing critical sections"],
        "recommended": ["Missing recommended sections"]
      },
      "missing_skills": {
        "must_have": ["Missing essential skills"],
        "nice_to_have": ["Preferred additional skills"]
      },
      "missing_achievements": ["Missing quantifiable results"],
      "contact_info": {
        "email": "Extracted email or null",
        "linkedin": "Extracted LinkedIn or null",
        "github": "Extracted GitHub or null",
        "portfolio": "Extracted portfolio or null"
      },
      "suggestions": ["Resume improvement suggestions"]
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
    console.log(analysis)
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
