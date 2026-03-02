"use server";
import { cache } from "react";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { toSlug } from "@/lib/utils";

export const getCarouselsData = cache(async (userId?: string) => {
  const results = await prisma.sheets.findMany({
    select: {
      id: true,
      name: true,
      _count: true,
      categories: {
        select: {
          name: true,
          _count: {
            select: {
              problems: true,
            },
          },
          problems: {
            select: {
              title: true,
              slug: true,
              difficulty: true,
              ...(userId && {
                UserProgress: {
                  where: { userId },
                  select: { isCompleted: true },
                  take: 1,
                },
              }),
            },
            orderBy: { difficulty: "asc" },
          },
        },
        orderBy : {id : "asc"}
      },
    },
    orderBy : {id : 'desc'}
  });

  const data = results.map((sheet) => ({
    ...sheet,
    categories: sheet.categories.map((category) => ({
      ...category,
      _count: {
        problems: category.problems.length,
        solved: category.problems.reduce(
          (acc, problem) =>
            acc +
            (problem.UserProgress?.some((progress) => progress.isCompleted)
              ? 1
              : 0),
          0,
        ),
      },
      problems: category.problems.map((problem) => ({
        ...problem,
        ...(userId && {
          isCompleted: problem.UserProgress?.[0]?.isCompleted ?? false,
        }),
        UserProgress: undefined,
      })),
    })),
  }));

  return data;
});

export const updateCompanyImage = async (formData: FormData) => {
  try {
    const name = formData.get("company") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!name || !imageUrl) {
      throw new Error("Company name or image URL is missing.");
    }
    await prisma.problemCompany.update({
      where: { name },
      data: { image: imageUrl },
      select: { name: true, image: true },
    });
  } catch (error) {
    console.error("Failed to update company image:", error);
    throw new Error("Could not update the company image.");
  }
  revalidatePath("/admin/companies");
};

export const searchProblems = async (query: string) => {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const problems = await prisma.problem.findMany({
      where: {
        OR: [
          { title: { contains: trimmed, mode: "insensitive" } },
          { slug: { contains: trimmed, mode: "insensitive" } },
        ],
      },
      take: 50,
      select: {
        title: true,
        slug: true,
        difficulty: true,
        platform: true,
      },
    });

    return problems;
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
};

export const addSheets = async (formData: FormData) => {
  const carouselName = formData.get("carouselName") as string;

  // Group form data by category index
  const categoryMap = new Map<number, { name: string; problems: string[] }>();

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("category-")) {
      const index = parseInt(key.replace("category-", ""));
      if (!categoryMap.has(index)) {
        categoryMap.set(index, { name: value as string, problems: [] });
      }
    } else if (key.startsWith("problem-")) {
      const index = parseInt(key.replace("problem-", ""));
      if (!categoryMap.has(index)) {
        categoryMap.set(index, { name: "", problems: [] });
      }
      categoryMap.get(index)!.problems.push(value as string);
    }
  }

  // Convert map to array and filter out empty categories
  const categories = Array.from(categoryMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, { name, problems }]) => ({ category: name, problems }))
    .filter(({ category, problems }) => category.trim() && problems.length > 0);
  try {
    await prisma.$transaction(async (prisma) => {
      const sheet = await prisma.sheets.create({
        data: {
          name: carouselName,
          slug: toSlug(carouselName),
          categories: {
            create: categories.map(({ category, problems }) => ({
              name: category,
              problems: {
                connect: problems.map((slug) => ({ slug })),
              },
              slug: toSlug(category),
            })),
          },
        },
      });
      console.log("Sheet and categories added:", sheet);
      const cookieStore = await cookies();
      cookieStore.set("sheet", carouselName, { expires: 2 });
    }, {timeout : 10000});
  } catch (err) {
    console.dir(err, { depth: 3 });
  } finally {
    await prisma.$disconnect();
  }
};

export const fetchProblemsBySlug = async (slugs: string[]) => {
  if (!slugs.length) return [];
  try {
    return await prisma.problem.findMany({
      where: { slug: { in: slugs } },
      select: { title: true, slug: true, difficulty: true },
    });
  } catch (error) {
    console.error("fetchProblemsBySlug failed:", error);
    return [];
  }
};

export async function addProblem(problem: IProblem) {
  const result = await addProblems([problem]);
  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, id: result.ids[0] };
}

const BATCH_SIZE = 50;

export async function addProblems(problems: IProblem[]) {
  if (problems.length === 0) return { success: true as const, ids: [], count: 0 };

  try {
    // 1. Collect all unique tags/topics/companies across all problems
    const allTopicTags = [...new Set(problems.flatMap((p) => p.topicTags))];
    const allMainTopics = [...new Set(problems.flatMap((p) => p.mainTopics))];
    const allCompanyTags = [...new Set(problems.flatMap((p) => p.companyTags))];

    // 2. Ensure all lookup rows exist in parallel
    await Promise.all([
      allTopicTags.length > 0
        ? prisma.problemTopic.createMany({
            data: allTopicTags.map((name) => ({ name })),
            skipDuplicates: true,
          })
        : Promise.resolve(),
      allMainTopics.length > 0
        ? prisma.problemMainTopic.createMany({
            data: allMainTopics.map((name) => ({ name })),
            skipDuplicates: true,
          })
        : Promise.resolve(),
      allCompanyTags.length > 0
        ? prisma.problemCompany.createMany({
            data: allCompanyTags.map((name) => ({ name, slug: toSlug(name) })),
            skipDuplicates: true,
          })
        : Promise.resolve(),
    ]);

    // 3. Upsert problems in batches
    const ids: number[] = [];

    for (let i = 0; i < problems.length; i += BATCH_SIZE) {
      const batch = problems.slice(i, i + BATCH_SIZE);

      const upserted = await Promise.all(
        batch.map((problem) =>
          prisma.problem.upsert({
            where: { slug: problem.slug },
            select: { id: true },
            create: {
              title: problem.title,
              slug: problem.slug,
              isPremium: problem.isPremium,
              dislikes: problem.dislikes,
              likes: problem.likes,
              difficulty: problem.difficulty,
              url: problem.url,
              accepted: problem.accepted,
              submissions: problem.submissions ?? 0,
              acceptanceRate: problem.acceptanceRate ?? 0,
              platform: problem.platform,
              topicTags: { connect: problem.topicTags.map((name) => ({ name })) },
              mainTopics: { connect: problem.mainTopics.map((name) => ({ name })) },
              companyTags: { connect: problem.companyTags.map((name) => ({ name })) },
            },
            update: {
              title: problem.title,
              isPremium: problem.isPremium,
              dislikes: problem.dislikes,
              likes: problem.likes,
              difficulty: problem.difficulty,
              url: problem.url,
              accepted: problem.accepted,
              submissions: problem.submissions ?? 0,
              acceptanceRate: problem.acceptanceRate ?? 0,
              platform: problem.platform,
              topicTags: { set: problem.topicTags.map((name) => ({ name })) },
              mainTopics: { set: problem.mainTopics.map((name) => ({ name })) },
              companyTags: { set: problem.companyTags.map((name) => ({ name })) },
            },
          }),
        ),
      );

      ids.push(...upserted.map((p) => p.id));
    }

    // 4. Link similar questions — resolve slugs → ids then bulk insert
    const allSimilarSlugs = [
      ...new Set(problems.flatMap((p) => p.similarQuestions.map((q) => q.slug))),
    ];

    if (allSimilarSlugs.length > 0) {
      const slugToId = new Map(
        (
          await prisma.problem.findMany({
            where: { slug: { in: allSimilarSlugs } },
            select: { id: true, slug: true },
          })
        ).map((p) => [p.slug, p.id]),
      );

      // Build the slug → upserted id map
      const problemSlugToId = new Map(
        problems.map((p, i) => [p.slug, ids[i]]),
      );

      const similarRows = problems.flatMap((problem) => {
        const problemId = problemSlugToId.get(problem.slug)!;
        return problem.similarQuestions
          .filter((q) => slugToId.has(q.slug))
          .map((q) => ({ problemId, similarId: slugToId.get(q.slug)! }));
      });

      if (similarRows.length > 0) {
        await prisma.similarProblem.createMany({
          data: similarRows,
          skipDuplicates: true,
        });
      }
    }

    return { success: true as const, ids, count: ids.length };
  } catch (error) {
    console.error("addProblems failed:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
