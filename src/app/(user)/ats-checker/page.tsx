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
      <div className="w-full px-6 max-md:px-3 pt-20 motion-opacity-in-0 motion-translate-y-in-[2%] motion-blur-in-sm">
        <div className="flex justify-center items-center gap-3">
          <h1 className="font-bold bg-linear-to-r dark:from-pink-500 from-pink-600 to-violet-600 dark:to-violet-500 bg-clip-text text-transparent w-fit text-xl">
            ATS Checker
          </h1>
          <p className="w-fit mx-0 shadow dark:shadow-0 text-xs border rounded-full py-1 px-2">
            Supports .pdf, .docx
          </p>
        </div>
        <Upload />
      </div>
    </Suspense>
  );
};

export default AtsPage;
