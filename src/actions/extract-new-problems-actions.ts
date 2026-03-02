
"use server"

import prisma from "@/prisma"
import { Platform } from "../../generated/prisma/enums"
import { getAcceptedSubmissions } from "@/lib/utils";
import { addProblems } from "./adminActions";

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

    const data: GfgResponse = await response.json();

    for (const p of data.results ?? []) {
      if (!p.slug || !p.problemName || !p.problemUrl || !p.difficulty) continue;
      if (existingSlugs.has(p.slug)) continue;
      const accuracy = Number(p.accuracy.split("%")[0]);
      results.push({
        title: p.problemName,
        platform: "GFG",
        difficulty: p.difficulty,
        slug: p.slug,
        submissions: p.allSubmissions,
        url: p.problemUrl,
        accepted: getAcceptedSubmissions(p.allSubmissions, accuracy),
        acceptanceRate: accuracy,
        companyTags: (p.tags.companyTags ?? []).filter(Boolean),
        mainTopics: (p.tags.topicTags ?? []).filter(Boolean),
        similarQuestions: [],
        topicTags: (p.tags.topicTags ?? []).filter(Boolean),
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