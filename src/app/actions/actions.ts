"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma";
import { cache } from "react";
import { InternType, JobType } from "@prisma/client";

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
              isCompleted: true,
            },
          },
        },
      },
      _count: {
        select: {
          problems: true,
        },
      },
    },
    orderBy: {
      problems: {
        _count: "desc",
      },
    },
  });

  const results = companies.map((company) => ({
    id: company.id,
    name: company.name,
    image: company.image,
    totalProblems: company._count.problems,
    solvedProblems: company.problems.reduce(
      (acc, problem) => acc + (problem.UserProgress.length > 0 ? 1 : 0),
      0
    ),
  }));
  return results;
});

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

export const getUserProgressQuuestions = cache(async (userId: string) => {
  const results = await prisma.userProgress.findMany({
    where: {
      userId,
    },
    include: {
      problem: true,
    },
  });
  return results;
});

export const getUserProgress = cache(async (userId: string) => {
  const results = await prisma.userProgress.findMany({
    where: {
      userId: userId,
      isCompleted: true,
    },
  });
  return results;
});

export const createUserProgress = cache(
  async (userId: string, problemId: number, isCompleted: boolean) => {
    const findUserQuestion = await prisma.userProgress.findFirst({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });
    console.log("findUserQuestion", findUserQuestion);
    if (findUserQuestion == null) {
      const results = await prisma.userProgress.create({
        data: {
          userId,
          problemId,
          isCompleted,
        },
      });
      return results;
    } else {
      const deleteQuestion = await prisma.userProgress.delete({
        where: {
          id: findUserQuestion.id,
        },
      });
      console.log("deleteQuestion", deleteQuestion);
    }
  }
);

export const jobPosting = cache(async (formData: FormData) => {
  const company = formData.get("company") as string;
  const title = formData.get("title") as string;
  const jobtype = formData.get("jobtype") as JobType;
  const location = formData.get("location") as string;
  const salary = formData.get("salary") as string;
  const url = formData.get("url") as string;
  const experience = formData.get("experience") as string;
  const logo = formData.get("logo") as string;
  const about = formData.get("about") as string;
  const responsibilities = (formData.get("responsibilities") as string).split(
    "\n"
  );
  const requirements = (formData.get("requirements") as string).split("\n");
  const skills = (formData.get("skills") as string)
    .split(",")
    .map((skill) => skill.trim());
  const benefits = (formData.get("benefits") as string).split("\n");
  await prisma.jobs.create({
    data: {
      company,
      title,
      logo,
      location,
      salary,
      url,
      about,
      responsibilities,
      requirements,
      skills,
      benefits,
      jobtype,
      experience,
    },
  });
  revalidatePath("dashboard/post-job");
});

export const internshipPosting = cache(async (formData: FormData) => {
    const company = formData.get("company") as string;
    const title = formData.get("title") as string;
    const internType = formData.get("internType") as InternType
    const location = formData.get("location") as string;
    const stipend = formData.get("stipend") as string;
    const url = formData.get("url") as string;
    const logo = formData.get("logo") as string;
    const about = formData.get("about") as string;
    const requirements = (formData.get("requirements") as string).split("\n");
    const skills = (formData.get("skills") as string).split(",").map(skill => skill.trim());
    const benefits = (formData.get("benefits") as string).split("\n");
    const duration = formData.get("duration") as string

    await prisma.internships.create({
        data: {
            company, title, internType, location, stipend, url, logo, about, requirements, skills, benefits,
            duration
        },
    });

  revalidatePath("dashboard/post-internship");
});

export const getJobs = cache(async (searchParams: IsearchParams) => {
    const params = await searchParams;
    const experienceArray = params.experience ? (Array.isArray(params.experience) ? params.experience : [params.experience]) : [];
    const jobTypeArray = params.jobType ? (Array.isArray(params.jobType) ? params.jobType : [params.jobType]) : [];
    const salaryRangeArray = params.salaryRange ? (Array.isArray(params.salaryRange) ? params.salaryRange : [params.salaryRange]) : [];
    const where: any = {};
    
    if (jobTypeArray.length > 0) {
        where.jobtype = {
            in: jobTypeArray.map(type => {
                if (type === "Full-time") return JobType.Full_time;
                if (type === "Part-time") return JobType.Part_time;
                if (type === "Contract") return JobType.Contract;
                if (type === "Freelance") return JobType.Remote;
                return null;
            }).filter(Boolean)
        };
    }
    
    const allJobs = await prisma.jobs.findMany({
        where: where
    });

    let filteredJobs = allJobs;

    // Filter by experience
    if (experienceArray.length > 0) {
        // ...existing experience filtering code...
    }

    // Filter by salary
    if (salaryRangeArray.length > 0) {
        filteredJobs = filteredJobs.filter((job) => {
            const jobSalary = parseSalary(job.salary);
            if (!jobSalary) return false;

            return salaryRangeArray.some((range) => {
                if (range === "25 LPA+") {
                    return jobSalary.min >= 25;
                }
                
                const [minStr, maxStr] = range.split('-');
                const rangeMin = parseInt(minStr);
                const rangeMax = parseInt(maxStr);
                
                return jobSalary.min >= rangeMin && jobSalary.max <= rangeMax;
            });
        });
    }

    return filteredJobs;
});

const parseExperience = (expString: string) => {
    if (!expString) 
        return null;

    if (expString.toLowerCase() === "fresher") 
        return { min: 0, max: 0, label: "Fresher" };

    const match = expString.match(/(\d+)[+-]?/g);
    if (!match) 
        return null;

    const minExp = parseInt(match[0]);
    const maxExp = match.length > 1 ? parseInt(match[1]) : minExp;

    return { min: minExp, max: maxExp };
};

const parseSalary = (salaryString: string) => {
    if (!salaryString) return null;
    const numbers = salaryString.match(/\d+/g);
    if (!numbers) return null;

    if (salaryString.includes('+')) {
        const min = parseInt(numbers[0]);
        return { min, max: min };
    }

    const min = parseInt(numbers[0]);
    const max = numbers.length > 1 ? parseInt(numbers[1]) : min;
    return { min, max };
}

export const getSingleJob = cache(async (id: string) => {
  const result = await prisma.jobs.findFirst({
    where: {
      id: id,
    },
  });
  return result;
});

export const getInternships = cache(async () => {
  const results = await prisma.internships.findMany();
  return results;
});

export const getSingleIntern = cache(async (id: string) => {
  const results = await prisma.internships.findFirst({
    where: {
      id: id,
    },
  });
  return results;
});

export const getCarouselCategoryData = cache(
  async (carouselSlug: string, categorySlug: string, userId?: string) => {
    const results = await prisma.sheetCategory.findFirst({
      where: { AND: [{ slug: categorySlug, sheet: { slug: carouselSlug } }] },
      include: {
        sheet: { select: { name: true } },
        problems: {
          select: {
            title: true,
            slug: true,
            difficulty: true,
            UserProgress: {
              where: { AND : [{userId : userId, isCompleted : true}]},
              select : {userId : true, isCompleted : true, }
            },
          },
        },
      },
    });

    if (!results) {
      return null;
    }
    const totalProblemsCount = results.problems.length;

    const solvedProblemsCount = results.problems.filter((problem) =>
      problem.UserProgress.length > 0
    ).length;

    return {
      ...results,
      totalProblemsCount,
      solvedProblemsCount,
    };
  }
);
