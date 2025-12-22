import DSASheet from "@/components/DSA/DSASheet";
import { getCarouselsData } from "@/actions/adminActions";
import {metadata as defaultMetadata} from '@/lib/defaultMetadata'
import {auth} from '@/auth'
import type { Metadata } from "next";
import { getSession } from "@/auth-client";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "DSA Sheets | PrepFlow",
  description:
    "Master Data Structures and Algorithms with PrepFlow's curated DSA sheets. Practice coding problems by topic, difficulty, and company-specific patterns to ace your FAANG and tech interviews.",
  keywords: [
    ...(defaultMetadata.keywords || []),
    "DSA Sheets",
    "PrepFlow DSA",
    "Coding Problems",
    "Interview Preparation",
    "LeetCode Alternative",
    "FAANG DSA Practice",
    "Amazon Interview Questions",
    "Google DSA Sheet",
  ],
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "PrepFlow - Curated DSA Sheets",
    description:
      "Level up your coding skills with PrepFlow's DSA Sheets. Organized by difficulty and interview relevance for Amazon, Google, Microsoft, and more.",
    url: "https://prepflow.vercel.app/dsa-sheets",
  },
  twitter: {
    ...defaultMetadata.twitter,
    title: "PrepFlow DSA Sheets - Ace Coding Interviews",
    description:
      "Practice structured DSA problems curated for FAANG interviews. Boost your preparation with PrepFlow.",
  },
  alternates: {
    canonical: "https://prepflow.vercel.app/dsa-sheets",
  },
};


const DSAPage = async () => {
  const session = await getSession()
  const carouselData = await getCarouselsData(session?.userId)
  return (
    <div className="w-full min-h-full pt-16 px-6 max-sm:px-3 motion-opacity-in-0 motion-translate-y-in-[2%] motion-blur-in-sm">
      {carouselData.map((carousel) => (
      <DSASheet key={carousel.id} carousel = {carousel} />
      ))}
    </div>
  );
}

export default DSAPage;
