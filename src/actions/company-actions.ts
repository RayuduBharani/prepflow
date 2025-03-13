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

export const companyTopics = cache(async (slug: string) => {
  const result = await prisma.problemTopicSlug.findMany({
    where: {
      problems: {
        some: {
          companyTags: {
            some: { slug }
          },
          platform: "LEETCODE",
        },
      },
    },
    include: {
      problems: {
        where: {
          companyTags: { some: { slug } },
          platform: "LEETCODE"
        },
        select: { id: true }
      },
      _count: {
        select: {
          problems: {
            where: { companyTags: { some: { slug } }, platform: "LEETCODE" },
          },
        },
      },
    },
  });
  return result;
}); // leetcode company topics

export const GFGcompanyTopics = cache(async (slug: string) => {
  const result = await prisma.problemTopicSlug.findMany({
    where: {
      problems: {
        some: {
          companyTags: {
            some: { slug }
          },
          platform: "GFG",
        },
      },
    },
    include: {
      problems: {
        where: {
          companyTags: { some: { slug } },
          platform: "GFG"
        },
        select: { id: true }
      },
      _count: {
        select: {
          problems: {
            where: { companyTags: { some: { slug } }, platform: "GFG" },
          },
        },
      },
    },
  });
  return result;
}); // gfg company topics


export async function getCompanyTopicProgress( userId: string, companySlug: string, platform: Platform) {
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
    offset: number,
    pageSize: number,
    userId?: string,
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
      take: pageSize,
      skip: offset, // Use the offset directly for pagination
      orderBy: { title: 'asc' }, // Add ordering to ensure consistent pagination
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
      hasMore: offset + pageSize < total
    };
  }
);
