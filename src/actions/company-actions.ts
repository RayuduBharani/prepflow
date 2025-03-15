"use server";

import { prisma } from "@/prisma";
import { cache } from "react";

export const getCompanyImg = cache(async (name: string) => {
  return prisma.problemCompany.findFirst({
    where: {
      slug: name,
    },
    include: {
      _count: {
        select: {
          problems: true,
        },
      },
    },
  });
});

export const getCompanies = cache(
  async (currentPage: number, searchValue?: string) => {
    return await prisma.problemCompany.findMany({
      where: searchValue
        ? {
            name: {
              contains: searchValue,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { problems: { _count: "desc" } },
      include: { _count: { select: { problems: true } } },
      take: 20,
      skip: (currentPage - 1) * 20,
    });
  }
);

interface ProblemTopicResult {
  slug: string;
  count: number;
  solvedCount?: number;
}

export const getCompanyPlatformProblems = cache(
  async (slug: string, platform: Platform, userId?: string): Promise<ProblemTopicResult[]> => {
    try {
      // Execute both queries in parallel
      const [totalResults, solvedResults] = await Promise.all([
        // Total problems per topic
        prisma.problemTopicSlug.findMany({
          where: {
            problems: {
              some: {
                companyTags: { some: { slug } },
                platform,
              },
            },
          },
          orderBy : {problems : { _count : 'desc'}},
          select: {
            slug: true,
            _count: {
              select: {
                problems: {
                  where: {
                    companyTags: { some: { slug } },
                    platform,
                  },
                },
              },
            },
          },
        }),
        // Solved problems (only if userId provided)
        userId
          ? prisma.problemTopicSlug.findMany({
              where: {
                problems: {
                  some: {
                    companyTags: { some: { slug } },
                    platform,
                    UserProgress: { some: { userId, isCompleted : true } },
                  },
                },
              },
              select: {
                slug: true,
                _count: {
                  select: {
                    problems: {
                      where: {
                        companyTags: { some: { slug } },
                        platform,
                        UserProgress: { some: { userId, isCompleted : true } },
                      },
                    },
                  },
                },
              },
            })
          : Promise.resolve([]),
      ]);

      // Combine results efficiently using a Map
      const resultMap = new Map<string, ProblemTopicResult>();
      
      // Process total counts
      totalResults.forEach(({ slug, _count }) => {
        resultMap.set(slug, {
          slug,
          count: _count.problems,
          solvedCount: 0, // Default solved count
        });
      });

      // Update with solved counts if available
      if (userId) {
        solvedResults.forEach(({ slug, _count }) => {
          const existing = resultMap.get(slug);
          if (existing) {
            existing.solvedCount = _count.problems;
          } else {
            resultMap.set(slug, {
              slug,
              count: 0,
              solvedCount: _count.problems,
            });
          }
        });
      }

      return Array.from(resultMap.values());
    } catch (error) {
      console.error('Error in getCompanyPlatformProblems:', error);
      throw new Error('Failed to fetch company platform problems');
    }
  }
);// gfg company topics

export async function getCompanyTopicProgress(
  userId: string,
  companySlug: string,
  platform: Platform
) {
  return prisma.userProgress.findMany({
    where: {
      userId: userId,
      problem: {
        companyTags: { some: { slug: companySlug } },
        platform: platform,
      },
    },
  });
}

// Cygnuxxs Area

export const getCompanyTopicWiseProblems = cache(
  async (
    companySlug: string,
    topicSlug: string,
    platform: Platform,
    userId?: string
  ) => {
    const results = await prisma.problem.findMany({
      where: {
        companyTags: { some: { slug: companySlug } },
        topicSlugs: { some: { slug: topicSlug } },
        platform,
      },
      select: {
        title: true,
        slug: true,
        platform: true,
        companyTags: { select: { name: true } },
        UserProgress: {
          where: { userId: userId, isCompleted: true },
          select: { isCompleted: true, userId: true },
          take: 1,
        },
        difficulty: true,
        url: true,
      },
      orderBy: { likes : 'desc' }, // Add ordering to ensure consistent pagination
    });

    const total = await prisma.problem.count({
      where: {
        companyTags: { some: { slug: companySlug } },
        topicSlugs: { some: { slug: topicSlug } },
        platform,
      },
    });

    const problems = results.map((problem) => ({
      ...problem,
      UserProgress: problem.UserProgress[0] || null,
    }));

    const solvedProblems = userId
      ? await prisma.userProgress.count({
          where: {
            userId: userId,
            isCompleted: true,
            problem: {
              platform,
              companyTags: { some: { slug: companySlug } },
              topicSlugs: { some: { slug: topicSlug } },
            },
          },
        })
      : 0;

    // Count problems by difficulty
    const difficultyCount = results.reduce(
      (acc, problem) => {
        const status = problem.UserProgress[0]?.isCompleted
          ? "solved"
          : "unsolved";
        acc[problem.difficulty][status] += 1;
        return acc;
      },
      {
        SCHOOL: { solved: 0, unsolved: 0 },
        BASIC: { solved: 0, unsolved: 0 },
        EASY: { solved: 0, unsolved: 0 },
        MEDIUM: { solved: 0, unsolved: 0 },
        HARD: { solved: 0, unsolved: 0 },
      }
    );
    return {
      totalProblems: total,
      solvedProblems,
      problems,
      difficultyCount,
    };
  }
);
