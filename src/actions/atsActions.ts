"use server";

import PdfParse from "pdf-parse";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_API_KEY;
if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is not set");

const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
  model: "gemini-2.5-flash", // Free tier supported, fast
});

export interface AtsScore {
  total: number;
  breakdown: {
    relevance: number;
    keyword_match: number;
    formatting: number;
    contact_completeness: number;
  };
}

export interface ApiResponse {
  ats_score: AtsScore;
  missing_sections: { critical: string[]; recommended: string[] };
  missing_skills?: { must_have: string[]; nice_to_have: string[] };
  missing_achievements: string[];
  contact_info: {
    email: string | null;
    linkedin: string | null;
    github: string | null;
    portfolio: string | null;
    phone: string | null;
  };
  suggestions: string[];
}

export type ActionState = {
  error?: string;
  details?: string;
  structuredData?: ApiResponse;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseJson<T>(raw: string): T {
  return JSON.parse(raw.replace(/^```(?:json)?/, "").replace(/```$/, "").trim());
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

  // Extract text
  let resumeText: string;
  try {
    resumeText = await extractResumeText(resume);
  } catch (e) {
    return { error: "Failed to read resume", details: (e as Error).message };
  }

  if (!resumeText.trim())
    return { error: "Empty resume", details: "No readable text found in the file." };

  // Single combined prompt: validate + analyze
  const hasJobDesc = Boolean(jobDesc);

  const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer.

STEP 1 – VALIDATION
First, verify:
  a) The RESUME below is actually a resume (has experience/education/skills/contact info).
  b) ${hasJobDesc ? "The JOB DESCRIPTION below is a valid job posting." : "No job description was provided; skip job description validation."}

If validation fails, return ONLY:
{ "validationError": "<reason>" }

STEP 2 – ATS ANALYSIS (only if validation passes)
Analyze the resume ${hasJobDesc ? "against the job description" : "for general ATS compatibility"} and return the JSON object below.

Scoring rubric (0-100 total):
- Relevance (0-35): ${hasJobDesc ? "Alignment with job role, responsibilities, industry." : "Clarity and versatility of the resume for typical roles."}
- Keyword Match (0-25): ${hasJobDesc ? "Overlap of skills/tools with job description." : "Presence of industry-standard keywords."}
- Structure & Formatting (0-30): ATS-friendly layout, clear sections (Work Experience, Education, Skills), consistent formatting.
- Contact Completeness (0-10): Email + at least one professional link (LinkedIn, GitHub, etc.).

Scoring guidance:
- Only deduct points for clear deficiencies.
- A resume with all critical sections, strong keywords, professional formatting, and complete contacts should score 90-100.

RESUME:
${resumeText}

${hasJobDesc ? `JOB DESCRIPTION:\n${jobDesc}` : ""}

Return ONLY valid JSON — no markdown, no explanation:
{
  "ats_score": {
    "total": 0,
    "breakdown": { "relevance": 0, "keyword_match": 0, "formatting": 0, "contact_completeness": 0 }
  },
  "missing_sections": { "critical": [], "recommended": [] },
  ${hasJobDesc ? `"missing_skills": { "must_have": [], "nice_to_have": [] },` : ""}
  "missing_achievements": [],
  "contact_info": { "email": null, "linkedin": null, "github": null, "portfolio": null, "phone": null },
  "suggestions": []
}
`.trim();

  let raw: string;
  try {
    const result = await withTimeout(model.generateContent([prompt]));
    raw = result.response.text();
  } catch (e) {
    return { error: "AI request failed", details: (e as Error).message };
  }

  try {
    const parsed = parseJson<{ validationError?: string } & ApiResponse>(raw);

    if (parsed.validationError) {
      return { error: "Validation failed", details: parsed.validationError };
    }

    // Normalise breakdown key name (model may return structure_formatting)
    const bd = parsed.ats_score?.breakdown as Record<string, number>;
    if (bd && "structure_formatting" in bd && !("formatting" in bd)) {
      bd.formatting = bd.structure_formatting;
      delete bd.structure_formatting;
    }

    return { structuredData: parsed as ApiResponse };
  } catch (e) {
    return {
      error: "Failed to parse AI response",
      details: `Parse error: ${(e as Error).message} | Raw: ${raw.slice(0, 500)}`,
    };
  }
}