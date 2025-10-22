import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://prepflow.vercel.app"),
  title: {
    default: "PrepFlow - AI Interview Preparation Platform | DSA, System Design & More",
    template: "%s | PrepFlow",
  },
  description:
    "PrepFlow is an AI-powered platform for coding interview preparation with curated DSA sheets, system design guides, online compiler, resume ATS checker, and interactive practice for FAANG and top tech company interviews. Master algorithms, data structures, and ace your next interview.",
  keywords: [
    "Prepflow",
    "interview preparation",
    "AI interview platform",
    "DSA sheets",
    "data structures and algorithms",
    "system design",
    "FAANG interviews",
    "coding interview practice",
    "resume ATS checker",
    "online compiler",
    "LeetCode alternative",
    "software engineer jobs",
    "tech interview prep",
    "algorithm practice",
    "coding challenges",
    "interview questions",
    "Amazon interview prep",
    "Google interview prep",
    "Microsoft interview prep",
    "Meta interview prep",
    "Apple interview prep",
    "Ashok Atragadda",
    "Cygnuxxs",
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
  category: "Education",
  classification: "Interview Preparation, Education Technology, Career Development",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prepflow.vercel.app",
    siteName: "PrepFlow",
    title: "PrepFlow - Master Tech Interviews with AI-Powered Preparation",
    description:
      "Ace your FAANG and tech interviews with PrepFlow's curated DSA sheets, system design guides, online compiler, AI mock interviews, and ATS resume checker. Practice like a pro, get hired faster.",
    images: [
      {
        url: "https://prepflow.vercel.app/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "PrepFlow - AI-Powered Interview Preparation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepFlow - Ace Your Tech Interviews with AI",
    description: "Master DSA, system design, resume review, and coding challenges. Your path to FAANG starts here.",
    creator: "@AshyGany",
    site: "@AshyGany",
    images: ["https://prepflow.vercel.app/og-image.jpeg"],
  },
  alternates: {
    canonical: "https://prepflow.vercel.app",
  },
  verification: {
    google: "5t4zBjhovVUsu3rVsR2HSiuUOu6yqVbHSusUkSFdnjY",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};