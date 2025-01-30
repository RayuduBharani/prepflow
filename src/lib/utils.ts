import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const navItems = [
  { href: "/jobs", label: "Jobs" },
  { href: "/roadmaps", label: "Roadmaps" },
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
          return 'text-green-500 font-semibold';
      case 'medium':
          return 'text-orange-500 font-semibold';
      case 'hard':
          return 'text-red-500 font-semibold';
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
