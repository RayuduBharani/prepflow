import { InternContent } from "@/components/snippets/InternContent"
import { JobContent } from "@/components/snippets/JobContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'
import type { Metadata } from "next";
import { metadata as defaultMetadata } from "@/lib/defaultMetadata";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: 'Jobs & Internships for Software Engineers | PrepFlow',
    description: 'Discover the latest software engineering jobs and internships from top tech companies. Apply to positions at FAANG, startups, and Fortune 500 companies. Updated daily with new opportunities.',
    keywords: [
        ...(defaultMetadata.keywords || []),
        'software engineer jobs',
        'tech jobs',
        'developer jobs',
        'internships',
        'software engineering internships',
        'FAANG jobs',
        'tech internships',
        'coding jobs',
        'programming jobs',
        'full stack developer jobs',
        'backend engineer jobs',
        'frontend developer jobs',
    ],
    openGraph: {
        ...defaultMetadata.openGraph,
        title: 'Software Engineering Jobs & Internships | PrepFlow',
        description: 'Find your next opportunity. Browse the latest jobs and internships from top tech companies.',
        url: 'https://prepflow.vercel.app/jobs',
    },
    twitter: {
        ...defaultMetadata.twitter,
        title: 'Tech Jobs & Internships | PrepFlow',
        description: 'Discover software engineering opportunities at top companies.',
    },
    alternates: {
        canonical: 'https://prepflow.vercel.app/jobs',
    },
}

const JobsPage = async ({ searchParams }: { searchParams: Promise<IsearchParams> }) => {
    const searchParam = await searchParams;
    return (
        <Tabs className="w-full h-fit pt-16 sm:px-2" defaultValue="jobs">
            <div className="w-full animate-fade-up h-full flex flex-col" style={{
                animationFillMode: "forwards",
            }}>
                <div className="w-full h-fit mt-7 flex sm:justify-between sm:px-2 items-center max-sm:flex-col max-sm:justify-start max-sm:mt-4">
                    <div className="w-auto h-auto max-sm:w-full">
                        <h1 className="text-lg font-bold text-primary sm:px-2 max-sm:px-4">
                            Jobs & Internships
                        </h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 sm:px-2 max-sm:px-4">
                            Explore and apply for various jobs to enhance your career.
                        </p>
                    </div>
                    <div className="w-auto h-auto max-sm:mt-2 max-sm:w-full max-sm:px-3">
                        <TabsList className="max-sm:w-full">
                            <TabsTrigger value="jobs">Jobs</TabsTrigger>
                            <TabsTrigger value="internships">Internships</TabsTrigger>
                        </TabsList>
                    </div>
                </div>
                <TabsContent value="jobs" className="motion-opacity-in-0 motion-translate-y-in-[2%] motion-blur-in-sm">
                    <JobContent experenceParams={searchParam} />
                </TabsContent>
                <TabsContent value="internships" className="motion-opacity-in-0 motion-translate-y-in-[2%] motion-blur-in-sm">
                    <InternContent experenceParams={searchParam} />
                </TabsContent>
            </div>
        </Tabs>
    );
};

export default JobsPage

