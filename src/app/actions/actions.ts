"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma";
import { cache } from "react";

export async function changeToAdmin(formData: FormData) {
  const user = await prisma.user.findUnique({
    where: { email: formData.get("email") as string },
  });
  if (!user) {
    return console.log("user not found");
  }
  if (user.role == "USER") {
    await prisma.user.update({
      where: { email: formData.get("email") as string },
      data: { role: "ADMIN" },
    });
  } else {
    await prisma.user.update({
      where: { email: formData.get("email") as string },
      data: { role: "USER" },
    });
  }
  revalidatePath("/admin");
}

export async function changeCompanyImage(formData: FormData) {
  const entries = formData.entries();
  for (const [key, value] of entries) {
    console.log(key);
  }
}

export const getProblemsByCompany = cache(async (name: string) => {
  const results = await prisma.problemCompany.findUnique({
    where: { name },
    include: { problems: true },
  });
  return results;
});

export const getCompanies = cache(async (userId?: string) => {
  const companies = await prisma.problemCompany.findMany({
    include: {
      problems: {
        include: {
          UserProgress: {
            where: {
              userId,
              isCompleted: true
            }
          }
        }
      },
      _count: {
        select: {
          problems: true
        }
      }
    },
    orderBy: {
      problems: {
        _count: 'desc'
      }
    }
  })

  const results = companies.map(company => ({
    id: company.id,
    name: company.name,
    image: company.image,
    totalProblems: company._count.problems,
    solvedProblems: company.problems.reduce((acc, problem) => 
      acc + (problem.UserProgress.length > 0 ? 1 : 0), 0
    )
  }))
  return results
})

export const getMainTopics = cache(async () => {
  const results = await prisma.problemMainTopic.findMany({
    include: {
      _count: {
        select: { problems: true },
      },
    },
  });
  return results;
});
