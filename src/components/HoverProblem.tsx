import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import GFGIcon from "@/components/icons/GFG";
import Leetcode from "@/components/icons/Leetcode";
import Link from "next/link";
import { Link2Icon } from "lucide-react";
import UserProblemForm from "./UserProblemForm";

interface HoverProblemProps {
  userId?: string;
  problems: Problem[];
}

interface ProblemRowProps {
  problem: Problem;
  userId?: string;
}

// Define difficulty color mapping
const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: "text-green-500",
  MEDIUM: "text-yellow-500",
  HARD: "text-red-500",
  DEFAULT: "text-gray-500",
};

const ProblemRow = React.memo(({ problem, userId }: ProblemRowProps) => {
  const platformIcon = problem.platform === "GFG" ? <GFGIcon /> : <Leetcode />;
  const difficultyColor = DIFFICULTY_COLORS[problem.difficulty] || DIFFICULTY_COLORS.DEFAULT;

  return (
    <div className="flex w-full items-center rounded-md border p-2">
      {userId && (
        <UserProblemForm
          UserProgress={problem.UserProgress}
          slug={problem.slug}
          userId={userId}
        />
      )}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Link href={problem.url} target="_blank" rel="noopener noreferrer">
            <Button
              variant="link"
              className="h-fit text-sm max-sm:text-xs text-foreground text-wrap"
            >
              {problem.title}
            </Button>
          </Link>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 flex gap-2">
          <div className="flex max-w-xs flex-col gap-2">{platformIcon}</div>
          <div className="flex flex-wrap gap-2">
            {problem.companyTags.slice(0, 4).map((company, idx) => (
              <p
                key={company.name + idx}
                className="flex-1 rounded-sm border bg-secondary px-1 text-xs"
              >
                {company.name}
              </p>
            ))}
            {problem.companyTags.length > 4 && (
              <p className="rounded-sm border bg-secondary px-1 text-xs">
                +{problem.companyTags.length - 4} more
              </p>
            )}
          </div>
          <Link
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary"
          >
            <Link2Icon strokeWidth={2} size={20} /> Link
          </Link>
        </HoverCardContent>
      </HoverCard>
      <p className={`${difficultyColor} ml-auto text-[0.675rem] font-medium`}>
        {problem.difficulty}
      </p>
    </div>
  );
});

ProblemRow.displayName = 'ProblemRow'

const HoverProblem: React.FC<HoverProblemProps> = ({ problems, userId }) => (
  <div className="mt-4 flex flex-col gap-2 pb-4 max-sm:pb-4">
    {problems.map((problem) => (
      <ProblemRow key={problem.slug} problem={problem} userId={userId} />
    ))}
  </div>
);

export default HoverProblem;