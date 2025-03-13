"use server";
import { cache } from "react";
import { prisma } from "@/prisma";
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
      },
    },
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
            (problem.UserProgress?.some((progress) => progress.isCompleted) ? 1 : 0),
          0
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
  if (!query.trim()) return [];

  try {
    const normalizedQuery = query
      .toLowerCase()
      .replace(/-/g, " ") // Convert slugs to normal words
      .replace(/\s+/g, " ") // Remove extra spaces
      .trim();

    const problems = await prisma.problem.findMany({
      where: {
        OR: [
          { title: { contains: normalizedQuery, mode: "insensitive" } },
          { slug: { contains: query.replace(/\s+/g, "-"), mode: "insensitive" } }, // Handle direct slug matches
        ],
      },
      take: 50, // Limit results for efficiency
      orderBy: {
        title: "asc", // Prioritize alphabetical order (or use ranking)
      },
      select: {
        title: true,
        slug: true,
        difficulty: true,
        platform: true,
      },
    });

    return problems;
  } catch (err) {
    console.error("Error searching problems:", err);
    return [];
  }
};

export const addSheets = async (formData: FormData) => {
  const carouselName = formData.get("carouselName") as string;
  let problems: string[] = [];
  // eslint-disable-next-line no-var
  var categories: { category: string; problems: string[] }[] = [];
  let currCategory = "";

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("category-")) {
      if (currCategory) {
        categories.push({ category: currCategory, problems });
        problems = [];
      }
      currCategory = value as string;
    } else if (key === "problem") {
      problems.push(value as string);
    }
  }
  if (currCategory) {
    categories.push({ category: currCategory, problems });
  }
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
    });
  } catch (err) {
    console.dir(err, { depth: 3 });
  } finally {
    await prisma.$disconnect();
  }
};
