import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import GFGIcon from "@/components/icons/GFG";
import Leetcode from "@/components/icons/Leetcode";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import UserProblemForm from "./UserProblemForm";
import { toTitleCase } from "@/lib/utils";

// ── types ─────────────────────────────────────────────────────────────────────

interface HoverProblemProps {
  userId?: string;
  problems: Problem[];
}

interface ProblemRowProps {
  problem: Problem;
  userId?: string;
}

// ── constants ─────────────────────────────────────────────────────────────────

const DIFFICULTY_CONFIG: Record<
  string,
  { label: string; cls: string; badgeCls: string }
> = {
  EASY: {
    label: "Easy",
    cls: "text-emerald-500",
    badgeCls:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  MEDIUM: {
    label: "Medium",
    cls: "text-amber-500",
    badgeCls:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  HARD: {
    label: "Hard",
    cls: "text-red-500",
    badgeCls: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  },
};

const FALLBACK_DIFFICULTY = {
  label: "Unknown",
  cls: "text-muted-foreground",
  badgeCls: "bg-muted/50 text-muted-foreground border-border/50",
};

// ── ProblemRow ────────────────────────────────────────────────────────────────

const ProblemRow = React.memo(({ problem, userId }: ProblemRowProps) => {
  const diff = DIFFICULTY_CONFIG[problem.difficulty] ?? FALLBACK_DIFFICULTY;
  const isGFG = problem.platform === "GFG";

  return (
    <div className="group relative flex w-full items-center gap-3 rounded-xl border border-border/40 bg-card/40 px-3 py-2.5 transition-all duration-300 hover:border-primary/20 hover:bg-muted/40 hover:shadow-sm">
      {/* Completion checkbox */}
      {userId && (
        <div className="shrink-0 flex items-center justify-center">
          <UserProblemForm
            UserProgress={problem.UserProgress ?? undefined}
            slug={problem.slug}
            userId={userId}
          />
        </div>
      )}

      {/* Title + hover card */}
      <HoverCard openDelay={200} closeDelay={150}>
        <HoverCardTrigger asChild>
          <div className="flex flex-1 items-center gap-3 min-w-0 cursor-pointer outline-none">
            <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-md bg-background/50 border border-border/40 shadow-sm opacity-80 group-hover:opacity-100 transition-opacity">
              {isGFG ? <GFGIcon /> : <Leetcode />}
            </div>
            <Link
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 truncate text-sm font-medium text-foreground/90 transition-colors group-hover:text-primary outline-none focus-visible:underline rounded-sm py-0.5"
            >
              {problem.title}
            </Link>
          </div>
        </HoverCardTrigger>

        <HoverCardContent
          side="top"
          className="w-[340px] p-5 rounded-xl border border-border/50 bg-popover/20 backdrop-blur-md shadow-2xl shadow-primary/5 flex flex-col gap-4 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/50 border border-border/50 shadow-sm">
                {isGFG ? <GFGIcon /> : <Leetcode />}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Platform
                </span>
                <span className="text-sm font-bold text-foreground">
                  {isGFG ? "GeeksforGeeks" : "LeetCode"}
                </span>
              </div>
            </div>
            <Link
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-all"
            >
              Solve
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
            </Link>
          </div>

          <div className="h-px bg-border/40 w-full" />

          {/* Problem Info */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-base font-bold leading-snug text-foreground">
              {problem.title}
            </h4>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-[10px] px-2 py-0.5 border font-semibold uppercase tracking-wider ${diff.badgeCls}`}
              >
                {diff.label}
              </Badge>
            </div>
          </div>

          {/* Tags Section */}
          {(problem.companyTags.length > 0 || problem.topicTags.length > 0) && (
            <div className="flex flex-col gap-3.5 mt-1">
              {problem.topicTags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Topics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {problem.topicTags.map(({ name }) => (
                      <Badge
                        key={name}
                        variant="secondary"
                        className="bg-secondary/40 hover:bg-secondary/60 text-secondary-foreground text-[10px] px-2 py-0.5 font-medium border-0 transition-colors"
                      >
                        {toTitleCase(name)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {problem.companyTags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Companies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {problem.companyTags.slice(0, 7).map((company, idx) => (
                      <span
                        key={company.name + idx}
                        className="inline-flex items-center rounded-md border border-border/40 bg-background/50 px-2 py-1 text-[10px] font-medium text-foreground/90 shadow-sm"
                      >
                        {company.name}
                      </span>
                    ))}
                    {problem.companyTags.length > 7 && (
                      <span className="inline-flex items-center rounded-md border border-dashed border-border/60 bg-transparent px-2 py-1 text-[10px] font-medium text-muted-foreground">
                        +{problem.companyTags.length - 7}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </HoverCardContent>
      </HoverCard>

      {/* Difficulty Indicator on Row */}
      <div className="shrink-0 flex items-center pr-1 transition-opacity opacity-80 group-hover:opacity-100">
        <Badge variant="outline" className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest border ${diff.badgeCls}`}>
          {diff.label}
        </Badge>
      </div>
    </div>
  );
});

ProblemRow.displayName = "ProblemRow";

// ── HoverProblem ──────────────────────────────────────────────────────────────

const HoverProblem: React.FC<HoverProblemProps> = ({ problems, userId }) => {
  if (!problems.length) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-16 text-center transition-colors hover:bg-muted/30">
        <p className="text-sm font-semibold text-foreground/80">
          No problems found
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground max-w-[220px]">
          Try adjusting your filters or search terms to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-2 pb-4">
      {problems.map((problem) => (
        <ProblemRow key={problem.slug} problem={problem} userId={userId} />
      ))}
    </div>
  );
};

export default HoverProblem;