"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { convertMarkdownArrayToHTML } from "@/lib/mdTohtml";
import { ApiResponse } from "@/actions/atsActions";
import { AlertTriangle, Lightbulb, Puzzle, Star, Trophy } from "lucide-react";

// ── chart config ──────────────────────────────────────────────────────────────

const chartConfig: ChartConfig = {
  score: { label: "Score" },
  relevance: { label: "Relevance", color: "hsl(var(--chart-1))" },
  keyword_match: { label: "Keyword Match", color: "hsl(var(--chart-2))" },
  formatting: { label: "Formatting", color: "hsl(var(--chart-3))" },
  contact_completeness: { label: "Contact Completeness", color: "hsl(var(--chart-4))" },
  remaining: { label: "Missing", color: "hsl(var(--muted))" },
} satisfies ChartConfig;

// ── score colour ──────────────────────────────────────────────────────────────

const scoreColor = (score: number) =>
  score >= 80
    ? "text-emerald-500"
    : score >= 50
      ? "text-amber-500"
      : "text-red-500";

// ── small reusable card ───────────────────────────────────────────────────────

const SectionCard = ({
  icon,
  title,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`rounded-2xl border border-border/60 bg-card p-4 flex flex-col gap-3 ${className}`}>
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-sm font-semibold">{title}</h2>
    </div>
    {children}
  </div>
);

// ── tag list ──────────────────────────────────────────────────────────────────

const TagList = ({
  label,
  items,
  variant,
}: {
  label: string;
  items: string[];
  variant: "destructive" | "warning" | "secondary";
}) => {
  if (!items.length) return null;

  const badgeCls =
    variant === "destructive"
      ? "bg-red-500/10 text-red-600 border-red-500/20"
      : variant === "warning"
        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
        : "bg-muted text-muted-foreground border-border";

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Badge
            key={item}
            variant="outline"
            className={`text-xs font-normal ${badgeCls}`}
          >
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
};

// ── main component ────────────────────────────────────────────────────────────

export default function DisplayResults({ result }: { result: ApiResponse }) {
  const atsData = result.ats_score.breakdown;
  const totalScore = Object.values(atsData).reduce((acc, v) => acc + v, 0);

  const chartData = [
    ...Object.entries(atsData).map(([key, value], index) => ({
      category: key.replace("_", " "),
      score: value,
      fill: `hsl(var(--chart-${index + 1}))`,
    })),
    { category: "Remaining", score: 100 - totalScore, fill: "hsl(var(--muted))" },
  ];

  const renderLabel = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ viewBox }: any) => {
      if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
      const { cx, cy } = viewBox as { cx: number; cy: number };
      return (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
          <tspan
            x={cx}
            y={cy}
            className={`text-3xl font-bold ${scoreColor(totalScore)}`}
            fill="currentColor"
          >
            {totalScore}%
          </tspan>
          <tspan x={cx} y={cy + 24} className="fill-muted-foreground text-xs">
            ATS Score
          </tspan>
        </text>
      );
    },
    [totalScore]
  );

  const htmlArray = convertMarkdownArrayToHTML(result.suggestions);
  const hasMissingSections =
    result.missing_sections &&
    (result.missing_sections.critical.length > 0 ||
      result.missing_sections.recommended.length > 0);
  const hasMissingSkills =
    result.missing_skills &&
    (result.missing_skills.must_have.length > 0 ||
      result.missing_skills.nice_to_have.length > 0);

  return (
    <div className="flex max-sm:flex-col items-start flex-wrap gap-4 w-full max-w-xl motion-preset-slide-up">

      {/* ── Score donut ── */}
      <SectionCard
        icon={<Trophy className="h-4 w-4 text-primary" />}
        title="ATS Score Breakdown"
        className="w-full"
      >
        <ChartContainer config={chartConfig} className="mx-auto aspect-square w-40">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="score"
              nameKey="category"
              innerRadius={52}
              strokeWidth={4}
            >
              <Label content={renderLabel} />
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Score breakdown pills */}
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(atsData).map(([key, value], idx) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg bg-muted/50 px-2.5 py-1.5"
            >
              <span className="text-xs text-muted-foreground capitalize">
                {key.replace("_", " ")}
              </span>
              <span
                className="text-xs font-semibold tabular-nums"
                style={{ color: `hsl(var(--chart-${idx + 1}))` }}
              >
                {value}%
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Missing Sections ── */}
      {hasMissingSections && (
        <SectionCard
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
          title="Missing Sections"
          className="w-full"
        >
          <TagList
            label="Critical"
            items={result.missing_sections!.critical}
            variant="destructive"
          />
          <TagList
            label="Recommended"
            items={result.missing_sections!.recommended}
            variant="warning"
          />
        </SectionCard>
      )}

      {/* ── Missing Skills ── */}
      {hasMissingSkills && (
        <SectionCard
          icon={<Puzzle className="h-4 w-4 text-amber-500" />}
          title="Skills to Add"
          className="w-full"
        >
          <TagList
            label="Must Have"
            items={result.missing_skills!.must_have}
            variant="destructive"
          />
          <TagList
            label="Nice to Have"
            items={result.missing_skills!.nice_to_have}
            variant="secondary"
          />
        </SectionCard>
      )}

      {/* ── Missing Achievements ── */}
      {result.missing_achievements?.length > 0 && (
        <SectionCard
          icon={<Star className="h-4 w-4 text-amber-400" />}
          title="Missing Achievements"
          className="w-full"
        >
          <ul className="flex flex-col gap-2">
            {result.missing_achievements.map((ma) => (
              <li
                key={ma}
                className="flex gap-2 text-sm text-muted-foreground before:mt-1.5 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-amber-400"
              >
                {ma}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* ── AI Suggestions ── */}
      {result.suggestions && htmlArray.length > 0 && (
        <SectionCard
          icon={<Lightbulb className="h-4 w-4 text-violet-500" />}
          title="AI Suggestions"
          className="w-full"
        >
          <ul className="flex flex-col gap-3">
            {htmlArray.map((sg) => (
              <li
                key={sg}
                className="rounded-xl border border-border/50 bg-muted/40 px-3 py-2.5 text-sm text-foreground [&_strong]:text-primary [&_code]:text-primary [&_a]:text-primary [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: sg }}
              />
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}