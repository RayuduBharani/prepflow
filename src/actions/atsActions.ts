"use server";

import PdfParse from "pdf-parse";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_API_KEY;
if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is not set");

const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
  model: "gemini-2.5-flash",
});

export interface AtsScore {
  total: number;
  breakdown: {
    relevance_and_impact: number;
    keyword_match: number;
    formatting: number;
    contact_completeness: number;
  };
}

export interface WeakBullet {
  original: string;
  suggested_improvement: string;
}

export interface ApiResponse {
  status: "success";
  ats_score: AtsScore;
  missing_sections: { critical: string[]; recommended: string[] };
  missing_skills: { must_have: string[]; nice_to_have: string[] };
  weak_bullets_to_improve: WeakBullet[];
  contact_info: {
    email: string | null;
    phone: string | null;
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

// ── Helpers ──────────────────────────────────────────────────────────────────

// FIX 1: More robust JSON fence stripper — handles newlines, spaces, and
//         language identifiers (```json, ``` json, etc.) on both ends.
function parseJson<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```[\w\s]*\n?/, "")
    .replace(/\n?```$/, "")
    .trim();
  return JSON.parse(cleaned);
}

async function withTimeout<T>(promise: Promise<T>, ms = 60_000): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

async function extractResumeText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  if (file.type === "application/pdf") {
    return (await PdfParse(buffer)).text;
  }
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return (await mammoth.extractRawText({ buffer })).value;
  }
  throw new Error("Unsupported format. Upload a PDF or DOCX file.");
}

// ── Main Action ───────────────────────────────────────────────────────────────

export async function analyzeResume(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const resume = formData.get("resume");
  const jobDesc = (formData.get("jobdesc") as string | null)?.trim() ?? "";

  if (!(resume instanceof File))
    return { error: "Invalid input", details: "Resume must be a file." };

  if (resume.size > 5 * 1024 * 1024)
    return { error: "File too large", details: "Max allowed size is 5 MB." };

  let resumeText: string;
  try {
    resumeText = await extractResumeText(resume);
  } catch (e) {
    return { error: "Failed to read resume", details: (e as Error).message };
  }

  if (!resumeText.trim())
    return {
      error: "Empty resume",
      details: "No readable text found in the file.",
    };

  const hasJobDesc = Boolean(jobDesc);

  const prompt = `
You are an enterprise-grade Applicant Tracking System (ATS) and an elite Senior Technical Recruiter.
Your ONLY output must be a single, valid JSON object.
Absolutely NO markdown formatting (do not use \`\`\`json).
NO commentary, introductory, or explanatory text.

--------------------------------------------------
STEP 1 – HARD VALIDATION
--------------------------------------------------
Analyze the input text to ensure it is a valid resume.
A resume is ONLY valid if it contains at least 2 of these standard sections:
- Experience / Work History
- Education
- Skills / Technical Stack
- Projects
AND contains at least one piece of contact information (Email, Phone, or LinkedIn/GitHub link).

${
  hasJobDesc
    ? `You must also validate the Job Description. It is ONLY valid if it contains:
- A clear job title or role indication
- A list of responsibilities or technical requirements`
    : `No job description provided. Skip job description validation.`
}

If validation fails, immediately return this exact JSON structure and stop processing:
{
  "status": "error",
  "error_message": "Specify exactly what is missing (e.g., 'Missing standard resume sections' or 'Invalid Job Description')"
}

--------------------------------------------------
STEP 2 – DEEP ATS & RECRUITER ANALYSIS
--------------------------------------------------
If validation passes, evaluate the resume ${
    hasJobDesc
      ? "against the provided job description"
      : "for general market readiness and ATS parsability"
  }.

CALCULATE SCORES (0-100 TOTAL) BASED ON THESE EXACT WEIGHTS:

1) Relevance & Impact (0–35 points)
${
  hasJobDesc
    ? `- High score: Resume achievements directly map to the core responsibilities in the JD.
- Low score: Generic descriptions, wrong seniority level, or irrelevant industry focus.`
    : `- High score: Clear role positioning and consistent career trajectory.
- Low score: Confused/mixed messaging, unclear what role the candidate is actually targeting.`
}
- Deduct points for responsibilities listed without quantifiable impact (e.g., lacking metrics, percentages, or scale).

2) Keyword Matching & Tech Stack (0–25 points)
${
  hasJobDesc
    ? `- Match resume keywords against the JD's 'must-have' and 'nice-to-have' skills.
- Account for synonyms and standard abbreviations (e.g., ReactJS = React, Node = Node.js, Postgres = PostgreSQL).`
    : `- Evaluate the presence of modern, industry-standard tools and frameworks relevant to the candidate's implied role.
- Deduct points for outdated tech or overly vague skills ('Computer Skills', 'Hard Worker').`
}

3) ATS Formatting & Structure (0–30 points)
- High score: Standard section headers, reverse-chronological order, high text-to-whitespace ratio.
- Low score: Signs of complex formatting that break parsers (e.g., text bleeding together, missing dates, missing standard headers).
- Deduct for long blocks of text (paragraphs > 5 lines) instead of punchy bullet points.

4) Contact Completeness (0–10 points)
- Email (Required: +4)
- Phone (Recommended: +2)
- Professional Links (LinkedIn/GitHub/Portfolio: +4)

--------------------------------------------------
STEP 3 – ACTIONABLE EXTRACTION
--------------------------------------------------
// FIX 2: Key name in the prompt now consistently matches the output field name
//         "weak_bullets_to_improve" so there is no mismatch.
- "missing_skills": ${
    hasJobDesc
      ? "Extract technical and soft skills present in the JD but absent from the resume. Categorize strictly into 'must_have' and 'nice_to_have'."
      : "Leave both arrays empty since no JD is provided."
  }
- "weak_bullets_to_improve": Identify up to 3 specific bullet points from the resume that lack quantifiable metrics (e.g., "Improved performance") and rewrite each into an action-oriented, metric-driven statement (e.g., "Improved load time by 40% by optimizing database queries, reducing P95 latency from 800 ms to 480 ms").
- "missing_sections": Identify absent standard resume sections and categorize them:
  - "critical": sections whose absence seriously hurts ATS scoring (Experience, Education, Skills)
  - "recommended": sections that strengthen the resume but are not strictly required (Summary, Projects, Certifications, Awards)
  Return empty arrays if none are missing in that category.
- "suggestions": Provide exactly 3 to 5 highly specific, actionable improvements. Avoid generic advice like "Add more metrics." Be specific: e.g., "Quantify the user scale of your [Project Name] application by adding the number of active users or requests per second it handled."

--------------------------------------------------
INPUT DATA
--------------------------------------------------
RESUME:
"""
${resumeText}
"""

${hasJobDesc ? `JOB DESCRIPTION:\n"""\n${jobDesc}\n"""` : ""}

--------------------------------------------------
OUTPUT FORMAT (STRICT JSON ONLY — no markdown, no extra text)
--------------------------------------------------
{
  "status": "success",
  "ats_score": {
    "total": 0,
    "breakdown": {
      "relevance_and_impact": 0,
      "keyword_match": 0,
      "formatting": 0,
      "contact_completeness": 0
    }
  },
  "contact_info": {
    "email": "extracted_email_or_null",
    "phone": "extracted_phone_or_null",
    "linkedin": "extracted_url_or_null",
    "github": "extracted_url_or_null",
    "portfolio": "extracted_url_or_null"
  },
  "missing_skills": {
    "must_have": [],
    "nice_to_have": []
  },
  "weak_bullets_to_improve": [
    {
      "original": "...",
      "suggested_improvement": "..."
    }
  ],
  "missing_sections": {
    "critical": [],
    "recommended": []
  },
  "suggestions": [
    "String 1",
    "String 2"
  ]
}
`.trim();

  let raw: string;
  try {
    // FIX 3: Destructure { response } from generateContent for clarity and
    //         to match the SDK's return type correctly.
    const { response } = await withTimeout(model.generateContent([prompt]));
    raw = response.text();
    console.log(raw);
  } catch (e) {
    return { error: "AI request failed", details: (e as Error).message };
  }

  try {
    type ErrorResponse = { status: "error"; error_message: string };
    const parsed = parseJson<ErrorResponse | ApiResponse>(raw);

    if (parsed.status === "error") {
      return {
        error: "Validation failed",
        details:
          (parsed as ErrorResponse).error_message ?? "Unknown validation error",
      };
    }

    return { structuredData: parsed as ApiResponse };
  } catch (e) {
    return {
      error: "Failed to parse AI response",
      details: `Parse error: ${(e as Error).message} | Raw: ${raw.slice(0, 500)}`,
    };
  }
}