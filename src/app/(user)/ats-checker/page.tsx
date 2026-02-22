import { Metadata } from "next";
import React, { Suspense } from "react";
import Upload from "./Upload";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "ATS Resume Checker | PrepFlow",
  description:
    "Upload your resume in PDF or DOCX format and check its ATS score instantly. PrepFlow ATS Checker analyzes resumes for keywords, formatting, and compatibility with applicant tracking systems.",
  keywords: [
    "ATS Resume Checker",
    "Resume Parser",
    "ATS Score",
    "Job Application",
    "Resume Optimization",
    "Applicant Tracking System",
    "Resume Review",
    "PDF Resume Checker",
    "DOCX Resume Checker",
    "PrepFlow ATS",
  ],
  openGraph: {
    title: "ATS Resume Checker | PrepFlow",
    description:
      "Check if your resume passes ATS filters. Supports PDF and DOCX with instant ATS score and keyword insights.",
    url: "https://prepflow.vercel.app/ats-checker",
    siteName: "PrepFlow",
    images: [
      {
        url: "https://prepflow.vercel.app/og-ats.png",
        width: 1200,
        height: 630,
        alt: "ATS Resume Checker by PrepFlow",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATS Resume Checker | PrepFlow",
    description:
      "Upload your resume (PDF/DOCX) and instantly see your ATS score with PrepFlow's AI-powered analysis.",
    images: ["https://prepflow.vercel.app/og-ats.png"],
    creator: "@AshyGany",
  },
  alternates: {
    canonical: "https://prepflow.vercel.app/ats-checker",
  },
  category: "career",
};

const AtsPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="px-6 w-full max-w-4xl mx-auto max-md:px-3 pt-20 motion-opacity-in-0 motion-translate-y-in-[2%] motion-blur-in-sm">
        <Upload />
      </div>
    </Suspense>
  );
};

export default AtsPage;
