"use client";
import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FiltersPanel from "./FiltersPanel";

// Create a QueryClient instance
const queryClient = new QueryClient();

const FiltersPanelWrapper: React.FC<FiltersPanelProps> = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <FiltersPanel {...props} />
      </Suspense>
    </QueryClientProvider>
  );
};

export default FiltersPanelWrapper;

// Define FiltersPanelProps for type safety
interface FiltersPanelProps {
  solvedProblems: number;
  userId: string | undefined;
  totalProblems: number;
  /** Header title — pass `companyTopic` for company pages or any label for DSA pages */
  companyTopic: string;
  problems: Problem[];
  difficultyCount: Record<string, { solved: number; unsolved: number }>;
  company?: string;
  platform?: Platform;
}