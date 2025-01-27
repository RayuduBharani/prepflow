import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostJob from "./PostJob";
import PostInternship from "./PostInternship";

const AdminJobs = () => {
  return (
    <Tabs defaultValue="post-job" className="pt-[4rem] px-6">
      <TabsList>
        <TabsTrigger value="post-job">Post Jobs</TabsTrigger>
        <TabsTrigger value="post-internship">Post Internships</TabsTrigger>
      </TabsList>
      <TabsContent
        className="overflow-y-auto h-[calc(100vh-8rem)] scrollbar-hide"
        value="post-job"
      >
        <PostJob />
      </TabsContent>
      <TabsContent
        className="overflow-y-auto h-[calc(100vh-8rem)] scrollbar-hide"
        value="post-internship"
      >
        <PostInternship />
      </TabsContent>
    </Tabs>
  );
};

export default AdminJobs;
