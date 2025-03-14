import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostJob from "./PostJob";
import PostInternship from "./PostInternship";

const AdminJobs = () => {
  return (
    <Tabs defaultValue="post-job" className="pt-[5rem] px-6">
      <TabsList>
        <TabsTrigger value="post-job">Post Jobs</TabsTrigger>
        <TabsTrigger value="post-internship">Post Internships</TabsTrigger>
      </TabsList>
      <TabsContent
        className="h-fit"
        value="post-job"
      >
        <PostJob />
      </TabsContent>
      <TabsContent
        className=" h-fit"
        value="post-internship"
      >
        <PostInternship />
      </TabsContent>
    </Tabs>
  );
};

export default AdminJobs;
