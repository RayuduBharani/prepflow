"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { convertMarkdownArrayToHTML } from "@/lib/mdTohtml";
import { ApiResponse } from "@/actions/atsActions";
interface ChartData {
  category: string;
  score: number;
  fill: string;
}

export default function DisplayResults({result} : {result : ApiResponse}) {
  const atsData = result.ats_score.breakdown
  const ACTUAL_SCORE = Object.values(atsData).reduce(
    (acc, value) => acc + value,
    0
  );
  const chartData: ChartData[] = [
    ...Object.entries(atsData).map(([key, value], index) => ({
      category: key.replace("_", " "),
      score: value,
      fill: `hsl(var(--chart-${index + 1}))`,
    })),
    {
      category: "Remaining",
      score: 100 - ACTUAL_SCORE,
      fill: "hsl(var(--muted))",
    },
  ];

  const chartConfig: ChartConfig = {
    score: { label: "Score" },
    relevance: { label: "Relevance", color: "hsl(var(--chart-1))" },
    keyword_match: { label: "Keyword Match", color: "hsl(var(--chart-2))" },
    formatting: { label: "Formatting", color: "hsl(var(--chart-3))" },
    contact_completeness: {
      label: "Contact Completeness",
      color: "hsl(var(--chart-4))",
    },
    remaining: { label: "Missing", color: "hsl(var(--muted))" }, // Add Remaining to config
  } satisfies ChartConfig;
  const renderLabel = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props: any) => {
      const { viewBox } = props;
      if (
        viewBox &&
        "cx" in viewBox &&
        "cy" in viewBox &&
        typeof viewBox.cx === "number" &&
        typeof viewBox.cy === "number"
      ) {
        return (
          <text
            x={viewBox.cx}
            y={viewBox.cy}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            <tspan
              x={viewBox.cx}
              y={viewBox.cy}
              className="fill-foreground text-3xl font-bold"
            >
              {ACTUAL_SCORE}%
            </tspan>
            <tspan
              x={viewBox.cx}
              y={viewBox.cy + 24}
              className="fill-muted-foreground"
            >
              Total Score
            </tspan>
          </text>
        );
      }
      return null;
    },
    [ACTUAL_SCORE]
  );
  const htmlArray = convertMarkdownArrayToHTML(result.suggestions);

  return (
    <div className="flex max-sm:flex-col items-stretch max-w-2xl flex-wrap flex-1 gap-4 w-full">
      <div className="flex h-fit items-center border py-3 rounded-xl flex-col gap-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square min-w-[150px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="score"
              nameKey="category"
              innerRadius={50}
              strokeWidth={5}
            >
              <Label content={renderLabel} />
            </Pie>
          </PieChart>
        </ChartContainer>
        <h2 className="text-lg font-bold">ATS Score</h2>
      </div>
      {result.missing_sections && (
        <div className="flex flex-col h-fit text-sm p-2 text-muted-foreground gap-2 rounded-xl border bg-muted/60">
          <h2 className="text-base font-bold text-primary">Missing Sections</h2>
          {result.missing_sections.critical.length > 0 && (
            <div className="bg-destructive rounded-md">
              <h3>Critical</h3>
              <ul className="list-disc pl-3">
                {result.missing_sections.critical.map((sec, idx) => (
                  <li key={idx}>{sec}</li>
                ))}
              </ul>
            </div>
          )}
          {result.missing_sections.recommended.length > 0 && (
            <div className="bg-muted rounded-md p-2">
              <h3 className="text-sm font-medium text-primary/80">
                Recommended
              </h3>
              <ul className="list-disc pl-3">
                {result.missing_sections.recommended.map((sec, idx) => (
                  <li key={idx}>{sec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {result.missing_skills && (
        <div className="p-2 rounded-xl flex flex-col bg-muted/60 text-sm gap-2">
          <h2 className="font-bold text-base text-primary">Skills</h2>
          {result.missing_skills.must_have.length > 0 && (
            <div className="p-2 bg-muted rounded-lg">
              <h3 className="text-sm font-medium text-primary/60">Must Have</h3>
              <ul className="list-disc text-muted-foreground pl-3">
                {result.missing_skills.must_have.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
          {result.missing_skills.nice_to_have.length > 0 && (
            <div className="p-2 bg-muted rounded-lg">
              <h3 className="text-sm font-medium text-primary/60">
                Nice to Have
              </h3>
              <ul className="list-disc text-muted-foreground pl-3">
                {result.missing_skills.nice_to_have.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {result.missing_achievements && (
        <div className="flex flex-col text-sm p-2 rounded-xl text-muted-foreground border gap-2 bg-muted">
          <h2 className="font-bold text-base text-primary">
            Missing Achievements
          </h2>
          <ul className="flex list-disc pl-4 pr-2 flex-col gap-3">
            {result.missing_achievements.map((ma, idx) => (
              <li key={idx}>{ma}</li>
            ))}
          </ul>
        </div>
      )}
      {result.suggestions && (
        <div className="p-2 rounded-xl border dark:border-0">
          <h2 className="text-lg mb-4 font-bold bg-clip-text bg-gradient-to-r from bg-pink-500 to-violet-500 text-transparent">
            AI Suggestions
          </h2>
          <ul className="flex list-disc pl-3 flex-col text-sm gap-8">
            {htmlArray.map((sg, idx) => (
              <li
                key={idx}
                className="p-2 rounded-xl border dark:border-0 shadow dark:shadow-0 bg-muted/60 *:*:text-primary"
                dangerouslySetInnerHTML={{ __html: sg }}
              ></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
