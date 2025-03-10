import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const navItems = [
  { href: "/jobs", label: "Jobs" },
  // { href: "/roadmaps", label: "Roadmaps" },
  {href : '/ats-checker', label : 'ATS Checker'},
  { href: "/companies", label: "Companies" },
  { href: "/dsa-sheets", label: "DSA Sheets" },
];
export const isActive = (href: string, pathname: string) =>
  pathname === href ? "text-primary" : "text-muted-foreground";


export const getTwoAlphabets = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2).toUpperCase()
};


export  const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
      case 'easy':
          return 'text-green-500 font-medium';
      case 'medium':
          return 'text-yellow-500 font-medium';
      case 'hard':
          return 'text-red-500 font-medium';
      default:
          return 'text-gray-500';
  }
};

export function toSlug(str: string): string {
  return str
    .toLowerCase()                      // Convert to lowercase
    .replace(/\s+/g, '-')                // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')            // Remove special characters (except hyphens and alphanumeric)
    .replace(/--+/g, '-')                // Replace multiple hyphens with a single one
    .replace(/^-+|-+$/g, '');            // Trim leading/trailing hyphens
}

export function toTitleCase(str : string) {
  if (!str) return "";

  return str
    .replace(/-/g, " ")
    .toLowerCase() 
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export function slugToTitle(slug: string): string {
  return slug
    .split('-') // Split by hyphens
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' '); // Join words with spaces
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function objectToQueryParams(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => 
      Array.isArray(value) 
        ? value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&') 
        : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
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
  {title : "Add Admins",
    description : 'Create and Manage Admins',
    link : 'dashboard/admin'
  }
];