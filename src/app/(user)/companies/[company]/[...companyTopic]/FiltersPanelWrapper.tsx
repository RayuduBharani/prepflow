"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FiltersPanel from "./FiltersPanel";

// Create a QueryClient instance
const queryClient = new QueryClient();

const FiltersPanelWrapper: React.FC<FiltersPanelProps> = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <FiltersPanel {...props} />
    </QueryClientProvider>
  );
};

export default FiltersPanelWrapper;

// Define FiltersPanelProps for type safety
interface FiltersPanelProps {
  solvedProblems: number;
  userId: string | undefined;
  totalProblems: number;
  companyTopic: string;
  difficultyCount: Record<string, { solved: number; unsolved: number }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialProblems: any[];
  initialNextPage: number | null;
  company: string;
  platform: Platform;
}