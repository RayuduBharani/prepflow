import DSASheet from "@/components/DSA/DSASheet";
import { getCarouselsData } from "@/actions/adminActions";
import { metadata as defaultMetadata } from '@/lib/defaultMetadata'
import { auth } from '@/auth'
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
    <div className="w-full min-h-full pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto motion-opacity-in-0 motion-translate-y-in-[2%] motion-blur-in-sm">
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent inline-block">
          DSA Practice Sheets
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          Curated pathways to master Data Structures and Algorithms.
          Follow structured roadmaps designed to help you ace technical interviews at top tech companies.
        </p>
      </div>

      <div className="space-y-6">
        {carouselData.length > 0 ? (
          carouselData.map((carousel) => (
            <div key={carousel.id} className="bg-card rounded-xl border p-2 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
              <DSASheet carousel={carousel} />
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <h2 className="text-xl font-bold text-foreground mb-2">No Sheets Available</h2>
            <p className="text-muted-foreground max-w-md">
              Check back later for curated DSA problems and study plans.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DSAPage;
