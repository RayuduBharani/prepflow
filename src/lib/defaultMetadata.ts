import { Metadata } from "next";

export const metadata : Metadata = {
  metadataBase: new URL("https://prepflow.vercel.app"),
  title: {
    default: "PrepFlow - AI Interview Preparation Platform",
    template: "%s | PrepFlow",
  },
  description:
    "PrepFlow is an AI-powered platform for coding interview preparation with curated DSA sheets, system design guides, resume checks, and interactive practice for FAANG and tech interviews.",
  keywords: [
    "Prepflow",
    "Ashok Atragadda",
    "Cygnuxxs",
    "Interview Preparation",
    "AI Interview Platform",
    "DSA Sheets",
    "System Design",
    "FAANG Interviews",
    "Coding Interview Practice",
    "Resume Review",
    "LeetCode Alternative",
    "Software Engineer Jobs",
  ],
  applicationName: "PrepFlow",
  generator: "Next.js",
  authors: [
    {
      name: "R.B.S.S Durga Prasad (Bharani)",
      url: "https://www.linkedin.com/in/rayudu-bharani-satya-siva-durga-prasad/",
    },
    {
      name: "Ashok Atragadda",
      url: "https://www.linkedin.com/in/ashok-atragadda/",
    },
  ],
  creator: "R.B.S.S Durga Prasad (Bharani)",
  publisher: "Ashok Atragadda (Cygnuxxs)",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prepflow.vercel.app",
    siteName: "PrepFlow",
    title: "PrepFlow - AI Interview Preparation",
    description:
      "Level up your tech interviews with PrepFlow's DSA sheets, AI mock interviews, and resume feedback.",
    images: [
      {
        url: "https://prepflow.vercel.app/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "PrepFlow Interview Platform Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepFlow - Ace Your Tech Interviews",
    description: "Practice DSA, system design, resume review, and more.",
    creator: "@AshyGany",
    images: ["https://prepflow.vercel.app/og-image.jpeg"],
  },
  alternates: {
    canonical: "https://prepflow.vercel.app",
  },
  verification: {
    google: "5t4zBjhovVUsu3rVsR2HSiuUOu6yqVbHSusUkSFdnjY",
  },
};