 
"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SheetIcon from "@/components/SheetIcon";
import { toTitleCase } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import HoverProblem from "@/components/HoverProblem";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Share from "@/components/Share";

// ── helpers ──────────────────────────────────────────────────────────────────

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

// ── constants ─────────────────────────────────────────────────────────────────

const DIFFICULTY_LEVELS = [
  {
    label: "Easy",
    value: "EASY",
    progressCls: "bg-emerald-500/15 [&>div]:bg-emerald-500",
    badgeCls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20",
    toggleCls: "data-[state=on]:border-emerald-400 data-[state=on]:text-emerald-600 data-[state=on]:bg-emerald-500/10",
  },
  {
    label: "Medium",
    value: "MEDIUM",
    progressCls: "bg-amber-500/15 [&>div]:bg-amber-500",
    badgeCls: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20",
    toggleCls: "data-[state=on]:border-amber-400 data-[state=on]:text-amber-600 data-[state=on]:bg-amber-500/10",
  },
  {
    label: "Hard",
    value: "HARD",
    progressCls: "bg-red-500/15 [&>div]:bg-red-500",
    badgeCls: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20",
    toggleCls: "data-[state=on]:border-red-400 data-[state=on]:text-red-600 data-[state=on]:bg-red-500/10",
  },
] as const;

const SOLVED_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Solved", value: "solved" },
  { label: "Unsolved", value: "unsolved" },
] as const;

// ── sub-components ────────────────────────────────────────────────────────────

const DifficultyFilter: React.FC<{
  selectedDifficulty: string | null;
  difficultyCount: Record<string, { solved: number; unsolved: number }>;
  onChange: (value: string | null) => void;
}> = ({ selectedDifficulty, difficultyCount, onChange }) => (
  <TooltipProvider>
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Difficulty
      </p>
      <ToggleGroup
        type="single"
        value={selectedDifficulty || ""}
        onValueChange={(v) => onChange(v || null)}
        className="justify-start gap-1.5"
      >
        {DIFFICULTY_LEVELS.map(({ label, value, toggleCls }) => {
          const total =
            (difficultyCount[value]?.solved ?? 0) +
            (difficultyCount[value]?.unsolved ?? 0);
          if (!total) return null;
          return (
            <ToggleGroupItem
              key={value}
              variant="outline"
              value={value}
              className={`text-xs h-7 px-2.5 rounded-lg ${toggleCls}`}
            >
              {label}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  </TooltipProvider>
);

const SolvedFilter: React.FC<{
  solvedFilter: string;
  onChange: (value: string) => void;
}> = ({ solvedFilter, onChange }) => (
  <div className="space-y-1.5">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      Status
    </p>
    <ToggleGroup
      type="single"
      value={solvedFilter}
      onValueChange={(v) => onChange(v || "all")}
      className="justify-start gap-1.5"
    >
      {SOLVED_OPTIONS.map(({ label, value }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          variant="outline"
          className="text-xs h-7 px-2.5 rounded-lg data-[state=on]:border-primary/50 data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  </div>
);

// ── main component ────────────────────────────────────────────────────────────

const FiltersPanelInner: React.FC<FiltersPanelProps> = ({
  solvedProblems,
  userId,
  problems,
  totalProblems,
  companyTopic,
  difficultyCount,
  company: _company,
  platform: _platform,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDifficulty = searchParams.get("difficulty");
  const solvedFilter = searchParams.get("solved") || "all";

  const filteredProblems = problems.filter((problem) => {
    const matchesDifficulty = selectedDifficulty
      ? problem.difficulty === selectedDifficulty
      : true;
    const matchesSolved =
      solvedFilter === "solved"
        ? problem.UserProgress?.isCompleted
        : solvedFilter === "unsolved"
          ? !problem.UserProgress?.isCompleted
          : true;
    return matchesDifficulty && matchesSolved;
  });

  const overallPct = totalProblems
    ? Math.round((solvedProblems / totalProblems) * 100)
    : 0;

  const activeFilterCount =
    (selectedDifficulty ? 1 : 0) + (solvedFilter !== "all" ? 1 : 0);

  return (
    <>
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden mt-2">
        {/* Header row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
          <SheetIcon />
          <h2 className="font-semibold text-base truncate flex-1">
            {toTitleCase(companyTopic)}
          </h2>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Filter popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 rounded-lg text-xs relative"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-64 flex flex-col gap-4 p-4 rounded-xl"
              >
                <DifficultyFilter
                  selectedDifficulty={selectedDifficulty}
                  difficultyCount={difficultyCount}
                  onChange={(value) =>
                    updateQueryParam("difficulty", value, router, searchParams)
                  }
                />
                <SolvedFilter
                  solvedFilter={solvedFilter}
                  onChange={(value) =>
                    updateQueryParam("solved", value, router, searchParams)
                  }
                />
                {activeFilterCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full h-7 text-xs rounded-lg text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      updateQueryParam("difficulty", null, router, searchParams);
                      updateQueryParam("solved", null, router, searchParams);
                    }}
                  >
                    Clear all filters
                  </Button>
                )}
              </PopoverContent>
            </Popover>

            <Share />
          </div>
        </div>

        {/* Progress section */}
        <div className="px-4 py-3 space-y-3">
          {/* Overall */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">
                Overall Progress
              </span>
              <span className="font-semibold tabular-nums">
                {solvedProblems}
                <span className="text-muted-foreground font-normal">
                  /{totalProblems}
                </span>
                <span className="text-muted-foreground font-normal ml-1">
                  ({overallPct}%)
                </span>
              </span>
            </div>
            <Progress value={overallPct} className="h-2 rounded-full" />
          </div>

          {/* Per-difficulty bars */}
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTY_LEVELS.map(({ label, value, progressCls, badgeCls }) => {
              const { solved = 0, unsolved = 0 } = difficultyCount[value] ?? {};
              const total = solved + unsolved;
              if (!total) return null;
              const pct = Math.round((solved / total) * 100);
              return (
                <div key={value} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-4 font-semibold border ${badgeCls}`}
                    >
                      {label}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {solved}/{total}
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    className={`h-1.5 rounded-full ${progressCls}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Problems list */}
      <HoverProblem userId={userId} problems={filteredProblems} />
    </>
  );
};

const FiltersPanel: React.FC<FiltersPanelProps> = (props) => (
  <Suspense>
    <FiltersPanelInner {...props} />
  </Suspense>
);

export default FiltersPanel;