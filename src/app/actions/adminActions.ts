"use server";
import { cache } from "react";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export const addDSACategoriesCarousels = cache(async () => {});

const titleToSlug = (title: string) => {
  return title.toLowerCase().replace(/ /g, "-");
};

export const getCarouselsData = cache(async () => {
  const results = await prisma.problemCategory.findMany({
    include: {
      _count: { select: { problems: true } },
      problems: { select: { title: true, slug: true } },
    },
  });
  return results;
});

export const addCarouselsData = async (formData: FormData) => {};

export const getProblemsNameandSlug = cache(async () => {
  const results = await prisma.problem.findMany({
    select: { title: true, slug: true },
  });
  return results;
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
      data: { image : imageUrl },
      select: { name: true, image: true },
    });
  } catch (error) {
    console.error("Failed to update company image:", error);
    throw new Error("Could not update the company image.");
  }
  revalidatePath('/admin/companies')
};

