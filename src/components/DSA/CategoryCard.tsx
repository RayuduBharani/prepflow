import { ArrowRight } from "lucide-react";
import { Progress } from "../ui/progress";
import Link from "next/link";
import { toSlug } from "@/lib/utils";
import { cn } from "@/lib/utils";

const difficultyColors: Record<string, string> = {
  EASY: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  MEDIUM: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  HARD: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

const CategoryCard = ({
  category,
  carouselName,
  href,
  className,
  style,
}: {
  carouselName?: string;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  category: {
    name: string;
    problems?: { title: string; slug: string; difficulty: string }[];
    _count: { solved: number; problems: number };
  };
}) => {
  const totalProblems = category._count.problems > 0 ? category._count.problems : 1;
  const progressPercentage = Math.round((category._count.solved / totalProblems) * 100);
  const isCompleted = progressPercentage === 100;
  const hasStarted = category._count.solved > 0;

  // Count difficulties
  const difficultyCounts = (category.problems || []).reduce(
    (acc, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Link
      href={href || `/dsa-sheets/${toSlug(carouselName || "")}/${toSlug(category.name)}`}
      style={style}
      className={cn(
        "group relative flex flex-col gap-4 basis-56 grow p-5 rounded-2xl border text-card-foreground",
        "bg-card/80 backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1.5 hover:shadow-lg hover:shadow-black/8",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isCompleted
          ? "border-emerald-500/30 hover:border-emerald-500/50"
          : "border-border/60 hover:border-primary/30",
        className
      )}
    >
      {/* Completed glow effect */}
      {isCompleted && (
        <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Completed
            </span>
          )}
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 leading-snug tracking-tight">
            {category.name}
          </h3>
        </div>

        <div
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-full shrink-0 mt-0.5",
            "bg-muted/60 transition-all duration-300",
            "group-hover:bg-primary group-hover:text-primary-foreground",
            "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          )}
        >
          <ArrowRight size={14} className="transition-transform duration-300" />
        </div>
      </div>

      {/* Difficulty badges */}
      {Object.keys(difficultyCounts).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(difficultyCounts).map(([diff, count]) => (
            <span
              key={diff}
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
                difficultyColors[diff] ?? "bg-muted text-muted-foreground"
              )}
            >
              {count} {diff}
            </span>
          ))}
        </div>
      )}

      {/* Progress section */}
      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            <span className={cn("font-semibold", hasStarted ? "text-foreground" : "")}>
              {category._count.solved}
            </span>
            <span className="mx-1 text-muted-foreground/60">/</span>
            <span>{category._count.problems}</span>
            <span className="ml-1 text-muted-foreground/70">solved</span>
          </span>
          <span
            className={cn(
              "text-xs font-semibold tabular-nums",
              isCompleted
                ? "text-emerald-600 dark:text-emerald-400"
                : hasStarted
                  ? "text-foreground"
                  : "text-muted-foreground"
            )}
          >
            {progressPercentage}%
          </span>
        </div>

        <div className="relative">
          <Progress
            value={progressPercentage}
            className={cn(
              "h-1.5 w-full rounded-full",
              isCompleted ? "[&>div]:bg-emerald-500" : ""
            )}
          />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;