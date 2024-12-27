// types.d.ts
declare module "*.svg" {
    import React from "react";
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
  }

  
interface ISimilarQuestion {
    id?: number;
    slug: string;
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD" | "BASIC" | "SCHOOL"; // Updated difficulty levels
  }
  
interface IProblem {
    id?: number;
    title: string;
    slug: string;
    isPremium?: boolean;
    dislikes?: number;
    likes?: number;
    difficulty: "EASY" | "MEDIUM" | "HARD" | "BASIC" | "SCHOOL"; // Updated difficulty levels
    similarQuestions: ISimilarQuestion[];
    topicTags: string[];
    accepted?: number;
    submissions?: number;
    acceptanceRate?: number;
    url: string;
    companyTags: string[];
    platform: "LEETCODE" | "GFG"; // Updated platforms
    mainTopics: string[];
    topicSlugs: string[];
  }
  