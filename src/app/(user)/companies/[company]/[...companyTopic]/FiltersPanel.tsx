/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SheetIcon from "@/components/SheetIcon";
import { toTitleCase } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CircleCheck, Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import HoverProblem from "@/components/HoverProblem";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Share from "@/components/Share";

const updateQueryParam = (
  param: string,
  value: string | null,
  router: any,
  searchParams: URLSearchParams
) => {
  const params = new URLSearchParams(searchParams.toString());
  value ? params.set(param, value) : params.delete(param);
  router.replace(`?${params.toString()}`, { scroll: false });
};

 const difficultyLevels = [
  { label: "Easy", value: "EASY", color: "green" },
  { label: "Medium", value: "MEDIUM", color: "yellow" },
  { label: "Hard", value: "HARD", color: "red" },
];

const DifficultyFilter: React.FC<{
  selectedDifficulty: string | null;
  difficultyCount: Record<string, { solved: number; unsolved: number }>;
  onChange: (difficulty: string | null) => void;
}> = ({ selectedDifficulty, difficultyCount, onChange }) => (
  <TooltipProvider>
    <ToggleGroup
      type="single"
      value={selectedDifficulty || ""}
      onValueChange={onChange}
    >
      {difficultyLevels.map(({ label, value, color }) =>
        (difficultyCount[value]?.solved || 0) +
          (difficultyCount[value]?.unsolved || 0) >
          0 ? (
          <ToggleGroupItem
            key={value}
            variant="outline"
            className={`text-xs data-[state=on]:border-slate-500 hover:border-${color}`}
            value={value}
          >
            {label}
          </ToggleGroupItem>
        ) : null
      )}
    </ToggleGroup>
  </TooltipProvider>
);

const SolvedFilter: React.FC<{
  solvedFilter: string;
  onChange: (filter: string) => void;
}> = ({ solvedFilter, onChange }) => (
  <ToggleGroup
    type="single"
    value={solvedFilter}
    onValueChange={(value) => onChange(value || "all")}
  >
    <ToggleGroupItem
      className="text-xs data-[state=on]:border-slate-500"
      value="all"
      variant="outline"
    >
      All
    </ToggleGroupItem>
    <ToggleGroupItem
      className="text-xs data-[state=on]:border-slate-500"
      value="solved"
      variant="outline"
    >
      Solved
    </ToggleGroupItem>
    <ToggleGroupItem
      className="text-xs data-[state=on]:border-slate-500"
      value="unsolved"
      variant="outline"
    >
      Unsolved
    </ToggleGroupItem>
  </ToggleGroup>
);

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  solvedProblems,
  userId,
  problems,
  totalProblems,
  companyTopic,
  difficultyCount,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDifficulty = searchParams.get("difficulty");
  const solvedFilter = searchParams.get("solved") || "all";

  const filteredProblems = problems.filter((problem) => {
    const matchesDifficulty = selectedDifficulty
      ? problem.difficulty === selectedDifficulty
      : true;
    const matchesSolvedFilter =
      solvedFilter === "all"
        ? true
        : solvedFilter === "solved"
          ? problem.UserProgress?.isCompleted
          : !problem.UserProgress?.isCompleted;
    return matchesDifficulty && matchesSolvedFilter;
  });

  return (
    <>
      <div className="border flex flex-col gap-2 mt-2 rounded-md p-4">
        <div className="flex gap-2 w-full items-center">
          <SheetIcon />
          <h1 className="text-2xl max-sm:text-base max-sm:text-wrap font-semibold">
            {toTitleCase(companyTopic)}
          </h1>
          <Popover>
            <PopoverTrigger className="ml-auto" asChild>

              <Button size="icon" variant="outline">
                <Filter />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2">
              <DifficultyFilter
                selectedDifficulty={selectedDifficulty}
                difficultyCount={difficultyCount}
                onChange={(value) =>
                  updateQueryParam(
                    "difficulty",
                    value || null,
                    router,
                    searchParams
                  )
                }
              />
              <SolvedFilter
                solvedFilter={solvedFilter}
                onChange={(value) =>
                  updateQueryParam("solved", value, router, searchParams)
                }
              />
            </PopoverContent>
          </Popover>
          <Share/>
        </div>
        <div className="flex relative isolate -z-10 items-center w-full">
          <CircleCheck size={20} strokeWidth={1} className="mr-1" />
          <p className="text-xs text-nowrap mr-4">
            {`${solvedProblems}/${totalProblems}`} solved
          </p>
          <Progress value={(solvedProblems / totalProblems) * 100} />
        </div>
        <div className="flex relative isolate -z-10 justify-end gap-2">
          <Progress
            value={
              (difficultyCount["EASY"].solved /
                difficultyCount["EASY"].unsolved) *
              100
            }
            className="bg-green-500/20 max-w-[5rem] [&>div]:bg-green-500"
          />
          <Progress
            value={
              (difficultyCount["MEDIUM"].solved /
                difficultyCount["MEDIUM"].unsolved) *
              100
            }
            className="bg-yellow-500/20 max-w-[5rem] [&>div]:bg-yellow-500"

          />
          <Progress
            value={
              (difficultyCount["HARD"].solved /
                difficultyCount["HARD"].unsolved) *
              100
            }
            className="bg-red-500/20 max-w-[5rem] [&>div]:bg-red-500"

          />
        </div>
      </div>
      <HoverProblem userId={userId} problems={filteredProblems} />
    </>
  );
};

export default FiltersPanel;
