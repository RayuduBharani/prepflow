import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

// Define response type
interface ApiResponse {
  ats_score: number;
  missing_sections: string[];
  missing_skills: string[];
  missing_achievements: string[];
  contact_info: {
    email: string | null;
    linkedin: string | null;
    github: string | null;
  };
  suggestions: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resume = formData.get("resume") as File;
    const jobDesc = formData.get("jobdesc") as string;

    // Validate inputs
    if (!resume || !jobDesc) {
      return NextResponse.json(
        { error: "Resume file and job description are required" },
        { status: 400 }
      );
    }

    // Basic Job Description Validation
    const jobKeywords = ["Responsibilities", "Requirements", "Skills", "Qualifications", "Duties"];
    const isValidJobDesc = jobKeywords.some((word) => jobDesc.includes(word)) && jobDesc.split(" ").length > 30;

    if (!isValidJobDesc) {
      return NextResponse.json(
        { error: "Invalid job description. Please provide a detailed job description." },
        { status: 400 }
      );
    }

    let resumeText = "";
    const buffer = Buffer.from(await resume.arrayBuffer());

    // Extract text based on file type
    try {
      if (resume.type === "application/pdf") {
        const pdfData = await pdfParse(buffer);
        resumeText = pdfData.text;
      } else if (
        resume.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const docData = await mammoth.extractRawText({ buffer });
        resumeText = docData.value;
      } else {
        return NextResponse.json(
          { error: "Unsupported file format. Please upload PDF or Word document" },
          { status: 400 }
        );
      }
    } catch (fileError) {
      return NextResponse.json(
        { error: "Error processing resume file", details: (fileError as Error).message },
        { status: 400 }
      );
    }

    // Validate resume content
    const resumeKeywords = ["Work Experience", "Education", "Skills", "Projects", "Certifications", "Summary"];
    const containsResumeContent = resumeKeywords.some((keyword) => resumeText.includes(keyword));

    if (!containsResumeContent) {
      return NextResponse.json(
        { error: "Uploaded file does not appear to be a resume" },
        { status: 400 }
      );
    }

    // Initialize AI model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // AI-Powered Job Description Validation
    const validationPrompt = `Determine whether the following text is a valid job description. If it is, respond with "valid". If it is not, respond with "invalid".

    **Job Description:**
    ${jobDesc}`;

    const validationResult = await model.generateContent([validationPrompt]);
    const validationResponse = validationResult.response.text().trim();

    if (validationResponse.toLowerCase() !== "valid") {
      return NextResponse.json(
        { error: "Invalid job description detected by AI" },
        { status: 400 }
      );
    }

    // ATS Analysis
    const atsPrompt = `
      Analyze the following resume against the provided job description and return structured feedback.

      **Evaluation Criteria:**
      - ATS Score (0-100) based on job relevance & ATS compliance
      - Missing Sections: Work Experience, Projects, Education, Skills, Achievements, Certifications, Summary, Contact Info
      - Missing Skills: Identify important job-related skills absent in the resume
      - Missing Achievements: Identify missing quantifiable results (e.g., "Improved efficiency by 25%")
      - Contact Information: Extract LinkedIn, GitHub, email, and other URLs
      - AI-Powered Suggestions: Provide specific resume improvements

      **Resume:**
      ${resumeText}

      **Job Description:**
      ${jobDesc}

      **Expected JSON Response:**
      {
        "ats_score": "(Number between 0-100)",
        "missing_sections": ["List of missing sections"],
        "missing_skills": ["List of missing skills"],
        "missing_achievements": ["List of missing quantifiable results"],
        "contact_info": {
          "email": "Extracted email or null",
          "linkedin": "Extracted LinkedIn URL or null",
          "github": "Extracted GitHub URL or null"
        },
        "suggestions": "AI-generated suggestions to improve the resume"
      }
    `;

    const result = await model.generateContent([atsPrompt]);
    const analysis = result.response.text();

    try {
      const parsedAnalysis: ApiResponse = JSON.parse(analysis);
      return NextResponse.json({ structuredData: parsedAnalysis }, { status: 200 });
    } catch (parseError) {
      return NextResponse.json(
        { error: "Failed to parse AI response", details: (parseError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Processing error", details: (error as Error).message },
      { status: 500 }
    );
  }
}