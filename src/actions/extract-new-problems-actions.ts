
"use server"

import prisma from "@/prisma"
import { Difficulty, Platform } from "../../generated/prisma/enums"
import { getAcceptedSubmissions } from "@/lib/utils";
import { addProblems } from "./adminActions";

const VALID_DIFFICULTIES = new Set<string>(["EASY", "MEDIUM", "HARD", "BASIC", "SCHOOL"]);

async function getExistingGfgSlugs(): Promise<Set<string>> {
  const problems = await prisma.problem.findMany({
    select: { slug: true },
    where: { platform: Platform.GFG },
  });
  return new Set(problems.map((p) => p.slug));
}

export async function extractNewGfgProblems(): Promise<IProblem[]> {
  const existingSlugs = await getExistingGfgSlugs();
  const results: IProblem[] = [];

  const url = new URL("https://practiceapi.geeksforgeeks.org/api/vr/problems/");
  url.searchParams.set("pageMode", "explore");
  url.searchParams.set("sortBy", "difficulty");

  for (let page = 1; ; page++) {
    url.searchParams.set("page", String(page));

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch page ${page}: ${response.statusText}`);
    }

    const data: GfgApiResponse = await response.json();

    for (const p of data.results ?? []) {
      if (!p.slug || !p.problem_name || !p.problem_url || !p.difficulty) continue;
      if (existingSlugs.has(p.slug)) continue;
      const upperDifficulty = (p.difficulty as string).toUpperCase();
      if (!VALID_DIFFICULTIES.has(upperDifficulty)) continue;
      const accuracy = Number(p.accuracy.split("%")[0]);
      results.push({
        title: p.problem_name,
        platform: "GFG",
        difficulty: upperDifficulty as Difficulty,
        slug: p.slug,
        submissions: p.all_submissions,
        url: p.problem_url,
        accepted: getAcceptedSubmissions(p.all_submissions, accuracy),
        acceptanceRate: accuracy,
        companyTags: (p.tags?.company_tags ?? []).filter(Boolean) as string[],
        mainTopics: (p.tags?.topic_tags ?? []).filter(Boolean) as string[],
        similarQuestions: [],
        topicTags: (p.tags?.topic_tags ?? []).filter(Boolean) as string[],
      });
    }

    if (!data.next) break;
  }

  return results;
}

export async function seedNewProblemsFromGfg(): Promise<
  { success: true; count: number } | { success: false; error: string }
> {
  try {
    const problems = await extractNewGfgProblems();
    const result = await addProblems(problems);
    if (!result.success) return result;
    return { success: true, count: result.count };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("seedNewProblemsFromGfg failed:", error);
    return { success: false, error: message };
  }
}