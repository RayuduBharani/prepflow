
"use server"

import prisma from "@/prisma"
import { Platform } from "../../generated/prisma/enums"
import { getAcceptedSubmissions } from "@/lib/utils";

async function extractGfgSlugsFromDb(): Promise<String[]> {
  const problems = await prisma.problem.findMany({
    select: { slug: true },
    where: { platform: Platform.GFG },
  });

  return problems.map((p) => p.slug);
}

export async function extractGfgSlugsFromApi(): Promise<IProblem[]> {
  const existingSlugs = new Set(await extractGfgSlugsFromDb());
  const res: IProblem[] = [];

  let page = 1;
  let hasNext = true;

  const baseUrl = new URL("https://practiceapi.geeksforgeeks.org/api/vr/problems/");
  baseUrl.searchParams.set("pageMode", "explore");
  baseUrl.searchParams.set("sortBy", "difficulty");

  while (hasNext) {
    try {
      const url = new URL(baseUrl.toString());
      url.searchParams.set("page", page.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Failed to fetch page ${page}: ${response.statusText}`);
      }

      const data: GfgResponse = await response.json();

      const newProblems : IProblem[] = (data.results ?? [])
        .filter((problem) => !existingSlugs.has(problem.slug))
        .map((problem) => {
          return {
            title : problem.problemName,
            platform : "GFG",
            difficulty : problem.difficulty,
            slug : problem.slug,
            submissions : problem.allSubmissions,
            url : problem.problemUrl,
            accepted : getAcceptedSubmissions(problem.allSubmissions, Number(problem.accuracy.split("%").at(0))),
            acceptanceRate : Number(problem.accuracy.split("%").at(0)),
            companyTags : problem.tags.companyTags,
            mainTopics : problem.tags.topicTags,
            similarQuestions : [],
            topicTags : problem.tags.topicTags,
          }
        })
      res.push(...newProblems);

      hasNext = Boolean(data.next);
      page++;
    } catch (error) {
      console.error("Error fetching GFG problems:", error);
      break;
    }
  }

  return res;
}
