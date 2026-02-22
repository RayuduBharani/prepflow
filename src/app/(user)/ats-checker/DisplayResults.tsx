"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { convertMarkdownArrayToHTML } from "@/lib/mdTohtml";
import { ApiResponse } from "@/actions/atsActions";
import { AlertTriangle, Lightbulb, Puzzle, Star, Trophy } from "lucide-react";

// ── score colour ──────────────────────────────────────────────────────────────

const scoreColor = (score: number) =>
  score >= 80
    ? "text-emerald-500"
    : score >= 50
      ? "text-amber-500"
      : "text-red-500";

const scoreRingColor = (score: number) =>
  score >= 80
    ? "#10b981"
    : score >= 50
      ? "#f59e0b"
      : "#ef4444";

const SEGMENT_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

// ── circular score ring ───────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className="relative mx-auto flex items-center justify-center"
      style={{ width: radius * 2, height: radius * 2 }}
    >
      <svg width={radius * 2} height={radius * 2} className="rotate-[-90deg]">
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={scoreRingColor(score)}
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-tight">
        <span className={`text-2xl font-bold tabular-nums ${scoreColor(score)}`}>
          {score}%
        </span>
        <span className="text-[10px] text-muted-foreground">ATS Score</span>
      </div>
    </div>
  );
}

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
  <div
    className={`rounded-2xl border border-border/60 bg-card p-4 flex flex-col gap-3 ${className}`}
  >
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
  if (!items?.length) return null;

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

  const htmlArray = convertMarkdownArrayToHTML(result.suggestions);

  // FIX: missing_sections is now { critical: string[], recommended: string[] }
  const hasMissingSections =
    result.missing_sections &&
    (result.missing_sections.critical?.length > 0 ||
      result.missing_sections.recommended?.length > 0);

  const hasMissingSkills =
    result.missing_skills &&
    (result.missing_skills.must_have?.length > 0 ||
      result.missing_skills.nice_to_have?.length > 0);

  const hasWeakBullets = result.weak_bullets_to_improve?.length > 0;

  return (
    <div className="flex max-sm:flex-col items-start flex-wrap gap-4 w-full max-w-xl motion-preset-slide-up">

      {/* ── Score ring ── */}
      <SectionCard
        icon={<Trophy className="h-4 w-4 text-primary" />}
        title="ATS Score Breakdown"
        className="w-full"
      >
        <ScoreRing score={totalScore} />

        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(atsData).map(([key, value], idx) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg bg-muted/50 px-2.5 py-1.5"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      SEGMENT_COLORS[idx] ?? "hsl(var(--muted-foreground))",
                  }}
                />
                <span className="text-xs text-muted-foreground capitalize">
                  {key.replace(/_/g, " ")}
                </span>
              </div>
              <span
                className="text-xs font-semibold tabular-nums"
                style={{
                  color:
                    SEGMENT_COLORS[idx] ?? "hsl(var(--muted-foreground))",
                }}
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
            items={result.missing_sections.critical}
            variant="destructive"
          />
          <TagList
            label="Recommended"
            items={result.missing_sections.recommended}
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
            items={result.missing_skills.must_have}
            variant="destructive"
          />
          <TagList
            label="Nice to Have"
            items={result.missing_skills.nice_to_have}
            variant="secondary"
          />
        </SectionCard>
      )}

      {/* ── Weak Bullets ── */}
      {/* FIX: was referencing missing_achievements (non-existent field);
               replaced with weak_bullets_to_improve from ApiResponse */}
      {hasWeakBullets && (
        <SectionCard
          icon={<Star className="h-4 w-4 text-amber-400" />}
          title="Bullets to Strengthen"
          className="w-full"
        >
          <ul className="flex flex-col gap-3">
            {result.weak_bullets_to_improve.map((wb, i) => (
              <li key={i} className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground line-through">
                  {wb.original}
                </span>
                <span className="text-foreground before:content-['→_'] before:text-emerald-500 before:font-bold">
                  {wb.suggested_improvement}
                </span>
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