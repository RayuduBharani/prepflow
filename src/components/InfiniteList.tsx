/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { FixedSizeList } from "react-window";
import { getCompanyTopicWiseProblems } from "@/actions/company-actions";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import GFGIcon from "@/components/icons/GFG";
import Leetcode from "@/components/icons/Leetcode";
import Link from "next/link";
import { Link2Icon } from "lucide-react";
import UserProblemForm from "./UserProblemForm";

const ROW_HEIGHT = 60; // Adjusted for compact rows

interface InfiniteListProps {
  companySlug: string;
  topicSlug: string;
  platform: Platform;
  userId?: string;
  difficultyFilter?: string | null;
  solvedFilter?: string;
  initialData?: {
    problems: Problem[];
    totalProblems: number;
    solvedProblems: number;
    difficultyCount: Record<string, { solved: number; unsolved: number }>;
    nextPage: number | null;
  };
}

export default function InfiniteList({
  companySlug,
  topicSlug,
  platform,
  userId,
  difficultyFilter,
  solvedFilter = "all",
  initialData,
}: InfiniteListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["problems", companySlug, topicSlug, platform, userId, difficultyFilter, solvedFilter],
    queryFn: ({ pageParam = 1 }) =>
      getCompanyTopicWiseProblems(companySlug, topicSlug, platform, userId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    initialData: initialData
      ? { pages: [initialData], pageParams: [1] }
      : undefined,
  });

  const allProblems = data?.pages.flatMap((page) => page.problems) || [];
  const filteredProblems = allProblems.filter((problem) => {
    const matchesDifficulty = difficultyFilter
      ? problem.difficulty === difficultyFilter
      : true;
    const matchesSolvedFilter =
      solvedFilter === "all"
        ? true
        : solvedFilter === "solved"
        ? problem.UserProgress?.isCompleted
        : !problem.UserProgress?.isCompleted;
    return matchesDifficulty && matchesSolvedFilter;
  });

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const problem = filteredProblems[index];
    if (!problem) return null;

    return (
      <div
        style={style}
        className="flex w-full rounded-md items-center border p-2"
      >
        {userId && (
          <UserProblemForm
            UserProgress={problem.UserProgress}
            slug={problem.slug}
            userId={userId}
          />
        )}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant="link"
              className="text-sm text-wrap h-fit max-sm:text-xs text-foreground"
            >
              {problem.title}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="flex gap-2 w-80">
            <div className="flex max-w-xs flex-col gap-2">
              {problem.platform === "GFG" ? <GFGIcon /> : <Leetcode />}
            </div>
            <div className="flex flex-wrap gap-2">
              {problem.companyTags.slice(0, 4).map((company, idx) => (
                <p
                  className="text-xs flex-1 px-1 border bg-secondary rounded-sm"
                  key={idx}
                >
                  {company.name}
                </p>
              ))}
              {problem.companyTags.length > 4 && (
                <p className="text-xs px-1 border bg-secondary rounded-sm">
                  +{problem.companyTags.length - 4} more
                </p>
              )}
            </div>
            <Link
              className="text-xs text-primary"
              target="_blank"
              rel="noopener noreferrer"
              href={problem.url}
            >
              <Link2Icon strokeWidth={2} size={20} /> Link
            </Link>
          </HoverCardContent>
        </HoverCard>
        <p
          className={`${
            problem.difficulty === "EASY"
              ? "text-green-500"
              : problem.difficulty === "MEDIUM"
              ? "text-yellow-500"
              : problem.difficulty === "HARD"
              ? "text-red-500"
              : "text-gray-500"
          } text-[0.675rem] font-medium ml-auto`}
        >
          {problem.difficulty}
        </p>
      </div>
    );
  };

  const handleScroll = ({ scrollOffset, scrollHeight, clientHeight }: any) => {
    if (
      scrollOffset + clientHeight >= scrollHeight - 100 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <div className="mt-4">
      {isFetchingNextPage && filteredProblems.length === 0 ? (
        <p className="text-center text-xs">Loading...</p>
      ) : status === "error" ? (
        <p className="text-center text-xs text-red-500">Error loading problems</p>
      ) : filteredProblems.length === 0 ? (
        <p className="text-center text-xs">No problems match the filters</p>
      ) : (
        <>
          <FixedSizeList
            height={400}
            width="100%"
            itemCount={filteredProblems.length}
            itemSize={ROW_HEIGHT}
            onScroll={handleScroll}
          >
            {Row}
          </FixedSizeList>
          {isFetchingNextPage && (
            <p className="text-center mt-2 text-gray-500">Loading more...</p>
          )}
          {hasNextPage && !isFetchingNextPage && (
            <Button
              onClick={() => fetchNextPage()}
              className="mt-4 w-full"
            >
              Load More
            </Button>
          )}
        </>
      )}
    </div>
  );
}