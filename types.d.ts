// types.d.ts
declare module "*.svg" {
  import React from "react";
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

// global.d.ts
declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

interface CompilerState {
  language: string;
  code: string;
  inputs: string;
  output: string;
  error: string;
  isRunning: boolean;
  showInputBox: boolean;
  activeTab: "code" | "console";
  isDarkMode: boolean;
  isFullscreen: boolean;

  setLanguage: (language: string) => void;
  setCode: (code: string) => void;
  setInputs: (inputs: string) => void;
  setOutput: (output: string) => void;
  setError: (error: string) => void;
  setIsRunning: (isRunning: boolean) => void;
  setShowInputBox: (showInputBox: boolean) => void;
  setActiveTab: (activeTab: "code" | "console") => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;

  runCode: () => Promise<void>;
  sendCodeAndInputs: () => Promise<void>;
  validateInputs: () => boolean;
  clearOutput: () => void;
  resetCode: () => void;

  // Computed properties (using selectors would be ideal, but for simplicity, we'll compute in component)
}

type ThemeMode = "dark" | "light" | "system";

type Language = "python" | "cpp" | "c" | "javascript" | 'java';

type ThemeColors =
  | "Zinc"
  | "Slate"
  | "Neutral"
  | "Gray"
  | "Stone"
  | "Red"
  | "Rose"
  | "Orange"
  | "Green"
  | "Blue"
  | "Yellow"
  | "Violet";
interface ThemeColorStateParams {
  themeColor: ThemeColors;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
}

type Difficulty = "EASY" | "MEDIUM" | "HARD" | "BASIC" | "SCHOOL";

type Company = {
  id: number;
  image: string | null;
  name: string;
};
type Platform = "LEETCODE" | "GFG";

type IsearchParams = {
  workType: string;
  stipend: string;
  duration: string;
  salaryRange: string;
  jobType: string;
  experience: string;
  slugs: string[] | string | undefined;
};

interface ICarousel {
  name: string;
  _count: {
    [key: string]: number;
  };
  categories: {
    name: string;
    _count: {
      problems: number;
      solved: number;
    };
    problems: {
      title: string;
      slug: string;
      difficulty: string;
      isCompleted?: boolean;
      UserProgress?: Array<{ isCompleted: boolean }>;
    }[];
  }[];
}

interface ISimilarQuestion {
  id?: number;
  slug: string;
  title: string;
  difficulty: Difficulty; // Updated difficulty levels
}

interface IProblem {
  id?: number;
  title: string;
  slug: string;
  isPremium?: boolean;
  dislikes?: number | null;
  likes?: number;
  difficulty: Difficulty; // Updated difficulty levels
  similarQuestions: ISimilarQuestion[];
  topicTags: string[];
  accepted?: number;
  submissions?: number;
  acceptanceRate?: number;
  url: string;
  companyTags: string[];
  platform: "LEETCODE" | "GFG"; // Updated platforms
  mainTopics: string[];
}

interface Problem {
  UserProgress: {
    isCompleted: boolean;
  } | null;
  title: string;
  slug: string;
  difficulty: $Enums.Difficulty;
  url: string;
  platform: $Enums.Platform;
  companyTags: {
    name: string;
  }[];
  topicTags: { name: string }[];
}

interface IPrismaDsaSheetData {
  prismaData: {
    id: number;
    title: string;
    difficulty: Difficulty;
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

type SearchParams = {
  page?: string;
  search?: string;
};

interface Topic {
  slug: string;
  _count: {
    problems: number;
  };
}

interface DifficultyLevel {
  label: string;
  value: string;
  color: string;
}

interface FiltersPanelProps {
  solvedProblems: number;
  userId?: string;
  problems: Problem[];
  totalProblems: number;
  companyTopic: string;
  difficultyCount: Record<string, { solved: number; unsolved: number }>;
  company?: string;
  platform?: Platform;
}


// Extract Problems from Leetcode and GFG

interface RawGfgResults {
  problem_name : string;
  slug : string;
  accuracy : string;
  all_submissions : number;
  difficulty : "School" | "Basic" | "Easy" | "Medium" | "Hard";
  tags : {
    company_tags : string[];
    topic_tags : string[];
  };
  problem_url : string;
}



interface GfgResults {
  problemName: string;
  slug: string;
  accuracy: string;
  allSubmissions: number;
  difficulty: Difficulty;
  tags: {
    companyTags: string[];
    topicTags: string[];
  };
  problemUrl: string;
}

interface GfgResponse {
  previous : Number | null;
  next : Number | null;
  count : Number;
  total : Number;
  solved : Number;
  unsolved : Number;
  results  : GfgResults[]
}
