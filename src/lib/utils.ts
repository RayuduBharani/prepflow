import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const navItems = [
  { href: "/jobs", label: "Jobs" },
  // { href: "/roadmaps", label: "Roadmaps" },
  { href: "/ats-checker", label: "ATS Checker" },
  { href: "/companies", label: "Companies" },
  { href: "/dsa-sheets", label: "DSA Sheets" },
  { href: "/compiler", label: "Compiler" },
];
export const isActive = (href: string, pathname: string) =>
  pathname === href ? "text-primary" : "text-muted-foreground";

export const getTwoAlphabets = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const getDifficultyColor = (difficulty: Difficulty): string => {
  const normalized = (difficulty ?? "").toLowerCase();
  if (normalized === "easy") return "text-green-500 font-medium";
  if (normalized === "medium") return "text-yellow-500 font-medium";
  if (normalized === "hard") return "text-red-500 font-medium";
  return "text-gray-500";
};

export const formatDate = (dateInput?: Date | number | string): string => {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  const options: Intl.DateTimeFormatOptions = {
    month: "short", // e.g., "Sep"
    day: "numeric", // e.g., "21"
    year: "numeric", // e.g., "2025"
    hour: "numeric", // e.g., "11"
    minute: "2-digit", // e.g., "37"
    hour12: true, // Use AM/PM
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate.replace(",", " at");
};

export function arrayDifference(arr1: string[], arr2: string[]): string[] {
  const set = new Set(arr1);
  return arr2.filter(v => !set.has(v));
}

export function toDifficulty(difficulty: string): Difficulty {
  switch (difficulty) {
    case "Easy":
      return "EASY";
    case "Medium":
      return "MEDIUM";
    case "Hard":
      return "HARD";
    case "Basic":
      return "BASIC";
    case "School":
      return "SCHOOL";
    default:
      throw new Error(`Unknown difficulty: ${difficulty}`);
  }
}

export function toCamelCaseResult(raw: RawGfgResults): GfgResults {
  return {
    problemName: raw.problem_name,
    slug: raw.slug,
    accuracy: raw.accuracy,
    allSubmissions: raw.all_submissions,
    difficulty: toDifficulty(raw.difficulty),
    tags: {
      companyTags: raw.tags.company_tags,
      topicTags: raw.tags.topic_tags,
    },
    problemUrl: raw.problem_url,
  };
}

export function getAcceptedSubmissions(totalSubmitions : number, accuracy : number ) : number {
  return Math.ceil((totalSubmitions / 100) * accuracy);
}

export const formatIndianCount = (num: number | null): string => {
  if (num === null || num === 0) return "0";

  const suffixes = [
    { value: 1, symbol: "" },
    { value: 1000, symbol: "K" },
    { value: 100000, symbol: "L" }, // Lakh
    { value: 10000000, symbol: "Cr" }, // Crore
    { value: 10000000000, symbol: "Ar" }, // Arab (1000 crores)
  ];

  // Find the appropriate suffix
  let suffixIndex = 0;
  for (let i = 1; i < suffixes.length; i++) {
    if (num >= suffixes[i].value) {
      suffixIndex = i;
    } else {
      break;
    }
  }

  const suffix = suffixes[suffixIndex];
  const scaled = num / suffix.value;

  // Format with appropriate decimal places
  const decimalPlaces = suffixIndex === 0 ? 0 : 1;
  return `${scaled.toFixed(decimalPlaces)}${suffix.symbol}`;
};

// Function to get the appropriate label (view/views, lakh/lakhs, etc.)
export const getLabel = (num: number | null): string => {
  if (num === null || num === 0) return "views";

  if (num === 1) return "view";

  // Check the magnitude for appropriate pluralization
  if (num >= 10000000) return "Cr views"; // Crore views
  if (num >= 100000) return "Lakh views";

  return "views";
};

export function toSlug(str: string): string {
  return str
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // Remove special characters (except hyphens and alphanumeric)
    .replace(/--+/g, "-") // Replace multiple hyphens with a single one
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
}

export function toTitleCase(str: string) {
  if (!str) return "";

  return str
    .replace(/-/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export function slugToTitle(slug: string): string {
  return slug
    .split("-") // Split by hyphens
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join words with spaces
}

 
export function objectToQueryParams(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) =>
      Array.isArray(value)
        ? value
            .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
            .join("&")
        : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
}

export const actions = [
  {
    title: "Post Jobs",
    description: "Create and Manage Job Listings",
    link: "dashboard/jobs",
  },
  {
    title: "Post Roadmaps",
    description: "Create Learning Paths and Roadmaps",
    link: "dashboard/roadmaps",
  },
  {
    title: "Companies",
    description: "Create and Manage Companies Data",
    link: "dashboard/companies",
  },
  {
    title: "DSA Sheets",
    description: "Create and Manage DSA Sheets",
    link: "dashboard/dsa-sheets",
  },
  {
    title: "Add Admins",
    description: "Create and Manage Admins",
    link: "dashboard/admin",
  },
];
