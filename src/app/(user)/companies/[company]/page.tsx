import { getCompanyImg } from "@/actions/company-actions";
import { getUserProgressQuestions } from "@/actions/actions";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building2, Trophy, Target, TrendingUp } from "lucide-react";
import Image from "next/image";
import { toTitleCase } from "@/lib/utils";
import type { Metadata } from "next";
import CompaniesBreadcrumb from "@/components/companiesBreadcrumb";
import Leetcode from "@/components/icons/Leetcode";
import GFGIcon from "@/components/icons/GFG";
import ProblemsTab from "./ProblemsTab";
import { metadata as defaultMetadata } from "@/lib/defaultMetadata";
import { getSession } from "@/auth-client";

type Props = {
  params: Promise<{ company: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company } = await params;
  const companyName = toTitleCase(company);

  return {
    ...defaultMetadata,
    title: `${companyName} Problems | PrepFlow`,
    description: `Practice and track your progress on ${companyName} coding interview problems. Solve questions from LeetCode and GeeksforGeeks curated for top tech companies.`,
    keywords: [
      ...(defaultMetadata.keywords || []),
      `${companyName} interview questions`,
      `${companyName} DSA problems`,
      `${companyName} coding challenges`,
      "LeetCode company-wise problems",
      "GFG company-wise problems",
      "PrepFlow DSA sheets",
    ],
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `${companyName} Problems | PrepFlow`,
      description: `Sharpen your coding skills with ${companyName} interview preparation problems. Curated DSA practice questions with progress tracking.`,
      url: `https://prepflow.vercel.app/companies/${company}`,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${companyName} Problems - PrepFlow`,
      description: `Solve ${companyName} coding interview questions on PrepFlow. Get curated problems from LeetCode & GFG.`,
    },
    alternates: {
      canonical: `https://prepflow.vercel.app/companies/${company}`,
    },
  };
}

async function CompanyPage({
  params,
}: {
  params: Promise<{ company: string }>;
  searchParams: Promise<{ difficulty?: string }>;
}) {
  const sessionPromise = getSession();
  const { company } = await params;
  const [imgData, userProgress, session] = await Promise.all([
    getCompanyImg(company),
    sessionPromise.then((s) => getUserProgressQuestions(s?.userId ?? "", company)),
    sessionPromise,
  ]);

  const totalProblems = imgData?._count.problems ?? 0;
  const solvedCount = userProgress.length;
  const progressPercentage = totalProblems
    ? Math.round((solvedCount / totalProblems) * 100)
    : 0;

  // Derive a status label from progress
  const progressLabel =
    progressPercentage === 0
      ? "Not started"
      : progressPercentage < 30
        ? "Getting started"
        : progressPercentage < 70
          ? "In progress"
          : progressPercentage < 100
            ? "Almost there!"
            : "Completed 🎉";

  const progressColor =
    progressPercentage === 0
      ? "text-muted-foreground"
      : progressPercentage < 30
        ? "text-blue-500"
        : progressPercentage < 70
          ? "text-amber-500"
          : progressPercentage < 100
            ? "text-orange-500"
            : "text-green-500";

  return (
    <div className="w-full pt-20 mx-auto max-w-5xl pb-10 px-4 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-5">
        <CompaniesBreadcrumb companyName={company} />
      </div>

      {/* ── Company Header Card ── */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden mb-6">
        {/* Subtle top accent strip */}
        <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/30" />

        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Logo */}
            <div className="relative h-16 w-16 shrink-0 rounded-xl border bg-white dark:bg-white/95 shadow-sm overflow-hidden">
              {imgData?.image && imgData.image !== "None" ? (
                <Image
                  src={imgData.image}
                  alt={`${toTitleCase(company)} logo`}
                  fill
                  sizes="64px"
                  className="object-contain p-1.5"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <Building2 className="h-7 w-7 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Name + stats */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold tracking-tight leading-tight">
                  {toTitleCase(company)}
                </h1>
                {progressPercentage === 100 && (
                  <Badge className="gap-1 bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20">
                    <Trophy className="h-3 w-3" />
                    Completed
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {totalProblems} curated interview questions
              </p>
            </div>

            {/* Quick stats — desktop */}
            <div className="hidden sm:flex items-center gap-5 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-bold tabular-nums">{solvedCount}</p>
                <p className="text-xs text-muted-foreground">Solved</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold tabular-nums">
                  {totalProblems - solvedCount}
                </p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className={`text-2xl font-bold tabular-nums ${progressColor}`}>
                  {progressPercentage}%
                </p>
                <p className="text-xs text-muted-foreground">Done</p>
              </div>
            </div>
          </div>

          {/* Progress section */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                Overall Progress
              </span>
              <span className={`font-semibold ${progressColor}`}>
                {progressLabel}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2 rounded-full" />
            {/* Mobile quick stats */}
            <div className="flex sm:hidden items-center justify-between mt-3 pt-3 border-t border-border/60">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Target className="h-3.5 w-3.5" />
                <span>
                  <span className="font-semibold text-foreground">{solvedCount}</span> solved ·{" "}
                  <span className="font-semibold text-foreground">{totalProblems - solvedCount}</span> left
                </span>
              </div>
              <span className={`text-xs font-bold ${progressColor}`}>
                {progressPercentage}% done
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="LEETCODE">
        <TabsList className="w-full sm:w-auto h-11 rounded-xl bg-muted/60 p-1 mb-5">
          <TabsTrigger
            value="LEETCODE"
            className="flex-1 sm:flex-initial gap-2 rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Leetcode className="h-4 w-4 shrink-0" />
            LeetCode
          </TabsTrigger>
          <TabsTrigger
            value="GFG"
            className="flex-1 sm:flex-initial gap-2 rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <GFGIcon className="h-4 w-4 shrink-0" />
            GeeksforGeeks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="LEETCODE" className="pb-8 mt-0">
          <ProblemsTab company={company} platform="LEETCODE" session={session} />
        </TabsContent>
        <TabsContent value="GFG" className="pb-8 mt-0">
          <ProblemsTab company={company} platform="GFG" session={session} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CompanyPage;