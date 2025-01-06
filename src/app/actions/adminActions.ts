"use server";
import { cache } from "react";
import { prisma } from "@/prisma";

export const addDSACategoriesCarousels = cache(async () => {});

const titleToSlug = (title: string) => {
  return title.toLowerCase().replace(/ /g, "-");
};

export const getCarouselsData = cache(async () => {
  const results = await prisma.problemCategory.findMany({
    include: { _count: { select: { problems: true } }, problems : {select : {title : true, slug : true}} },
  });
  return results
});

export const addCarouselsData = async (formData : FormData) => {

}

export const getProblemsNameandSlug = cache(async () => {
    const results = await prisma.problem.findMany({
        select: { title: true, slug: true },
    });
    return results
    });
