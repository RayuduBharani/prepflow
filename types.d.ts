// types.d.ts
declare module "*.svg" {
  import React from "react";
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

type Company = {
  id: number
  image: string | null
  name: string
  
}
type IsearchParams = {
    workType: any;
    stipend: any;
    duration: any;
    salaryRange: string;
    jobType: string;
    experience: any;slugs : string[] | string | undefined 
}


interface ICarousel {
    name: string;
    _count: {
      [key: string]: number;
    };
    categories: {
      name: string;
      _count: {
        problems: number;
        solved : number;
      };
      problems: {
        title: string;
        slug: string;
        difficulty: string;
        isCompleted?: boolean;
        UserProgress?: Array<{ isCompleted: boolean }>;
      }[];
    }[];
  };

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
  dislikes?: number | null;
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

interface IPrismaDsaSheetData {
  prismaData: {
    id: number;
    title: string;
    difficulty: string;
    acceptanceRate: number;
    mainTopics: {
      name: string;
    }[];
    companyTags: {
      name: string;
    }[];
    url: string;
  }[];
}

interface Iinfo {
  id: number;
  userId: string;
  problemId: number;
  isCompleted: boolean;
  completedAt: Date | null;
  updatedAt: Date;
}

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: string | null;
    image: string;
    role: "ADMIN" | "USER";
    createdAt: string;
    updatedAt: string;
  };
  sessionToken: string;
  expires: string;
  createdAt: string;
  updatedAt: string;
}
