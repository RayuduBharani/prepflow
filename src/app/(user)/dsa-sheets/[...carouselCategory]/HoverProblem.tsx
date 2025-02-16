import React from "react";
import { createProblemLink, getDifficultyColor } from "@/lib/utils";
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

const HoverProblem = async ({
  problems,
  userId,
}: {
  userId?: string;
  problems: {
    title: string;
    difficulty: string;
    slug: string;
    platform: Platform;
    companyTags: { name: string }[];
    UserProgress: { isCompleted?: boolean; userId?: string };
  }[];
}) => {
  return (
    <div className="flex max-sm:pb-4 flex-col mt-4 gap-2">
      {problems.map((problem) => (
        <div
          className="flex w-full rounded-md items-center border p-2"
          key={problem.slug}
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
                variant={"link"}
                className="text-sm text-wrap  h-fit max-sm:text-xs text-foreground"
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
                href={createProblemLink(problem.platform, problem.slug)}
              >
                <Link2Icon strokeWidth={2} size={20} /> Link
              </Link>
            </HoverCardContent>
          </HoverCard>
          <p
            className={`${getDifficultyColor(
              problem.difficulty
            )} text-[0.675rem] ml-auto`}
          >
            {problem.difficulty}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HoverProblem;
