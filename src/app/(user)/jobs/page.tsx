import { InternContent } from "@/components/snippets/InternContent"
import { JobContent } from "@/components/snippets/JobContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'
import type { Metadata } from "next";

export const metadata : Metadata = {
    title : 'PrepFlow - Find Jobs and Internships'
  }

const JobsPage = async ({searchParams} : {searchParams : IsearchParams}) => {
    const searchParam = await searchParams;
    return (
        <Tabs className="w-full h-full pt-[4rem] overflow-hidden sm:px-4" defaultValue="jobs">
            <div className="w-full animate-fade-up h-full flex flex-col overflow-y-scroll scrollbar-hide" style={{
                animationFillMode: "forwards",
            }}>
                <div className="w-full h-fit mt-7 flex sm:justify-between sm:px-5 items-center max-sm:flex-col max-sm:justify-start max-sm:mt-4">
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
                    <JobContent experenceParams={searchParam}/>
                </TabsContent>
                <TabsContent value="internships" className="motion-opacity-in-0 motion-translate-y-in-[2%] motion-blur-in-sm">
                    <InternContent experenceParams={searchParam}/>
                </TabsContent>
            </div>
        </Tabs>
    );
};

export default JobsPage

