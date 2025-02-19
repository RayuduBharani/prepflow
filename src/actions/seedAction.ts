"use server";
import { prisma } from "@/prisma";
import problems from "../../platform_data";
import { revalidatePath } from "next/cache";  
import companiesData from "../../companies";
import sheetsData from "../../sheetsData";
import { toSlug } from "@/lib/utils";

export async function seedData(prevState: any, formData: FormData) {
  if (!problems || problems.length === 0) {
    return { message: "No problems to seed.", processed: 0, total: 0 };
  }

  const totalProblems = problems.length;
  let processedProblems = 0;

  console.log(`Starting seeding process for ${totalProblems} problems...`);

  for (const problemData of problems) {
    console.log(`Processing problem: ${problemData.title} (${processedProblems + 1}/${totalProblems})`);

    await prisma.$transaction(async (prisma) => {
      // 1️⃣ Upsert TopicTags
      const topicTags = await prisma.problemTopic.createMany({
        data: problemData.topicTags.map((tag) => ({ name: tag })),
        skipDuplicates: true,
      });

      // 2️⃣ Upsert CompanyTags
      const companyTags = await Promise.all(
        problemData.companyTags.map(async (company) => {
          let slug = toSlug(company);
          const existingCompany = await prisma.problemCompany.findUnique({ where: { slug } });

          if (existingCompany) {
            slug = `${slug}-${Math.random().toString(36).substring(2, 9)}`;
          }

          return prisma.problemCompany.upsert({
            where: { name: company },
            update: {},
            create: { name: company, slug },
          });
        })
      );

      // 3️⃣ Upsert MainTopics
      const mainTopics = await prisma.problemMainTopic.createMany({
        data: problemData.mainTopics.map((topic) => ({ name: topic })),
        skipDuplicates: true,
      });

      // 4️⃣ Upsert TopicSlugs
      const topicSlugs = await prisma.problemTopicSlug.createMany({
        data: problemData.topicSlugs.map((slug) => ({ slug })),
        skipDuplicates: true,
      });

      // 5️⃣ Handle Slug Uniqueness
      let slug = problemData.slug;
      const existingProblem = await prisma.problem.findUnique({ where: { slug } });

      if (existingProblem) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 9)}`;
      }

      // 6️⃣ Create Problem
      const problem = await prisma.problem.create({
        data: {
          title: problemData.title,
          slug,
          isPremium: problemData.isPremium ?? false,
          dislikes: problemData.dislikes ?? 0,
          likes: problemData.likes ?? 0,
          difficulty: problemData.difficulty,
          url: problemData.url ?? "",
          accepted: problemData.accepted ?? 0,
          submissions: problemData.submissions ?? 0,
          acceptanceRate: problemData.acceptanceRate ?? 0,
          platform: problemData.platform,
          topicTags: {
            connect: problemData.topicTags.map((tag) => ({ name: tag })),
          },
          companyTags: {
            connect: companyTags.map((company) => ({ id: company.id })),
          },
          mainTopics: {
            connect: problemData.mainTopics.map((topic) => ({ name: topic })),
          },
          topicSlugs: {
            connect: problemData.topicSlugs.map((slug) => ({ slug })),
          },
        },
      });

      // 7️⃣ Create SimilarProblems
      await prisma.similarProblem.createMany({
        data: await Promise.all(
          problemData.similarQuestions.map(async (similarQuestion) => {
            const similarProblem = await prisma.problem.findUnique({
              where: { slug: similarQuestion.slug },
            });

            return similarProblem
              ? { problemId: problem.id, similarId: similarProblem.id }
              : null;
          })
        ).then((results) => results.filter((x) => x !== null)),
        skipDuplicates: true,
      });

      processedProblems++;
      console.log(`Completed problem: ${problemData.title} (${processedProblems}/${totalProblems})`);
    });
  }

  console.log("Database seeded successfully!");
  return { message: "Database seeded successfully!", processed: processedProblems, total: totalProblems };
}

export async function dropTables(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Starting drop tables process...`);

  const tablesToDrop = [
    "_ProblemCompanyProblems",
    "_ProblemMainTopicProblems",
    "_ProblemTopicProblems",
    "_ProblemTopicSlugProblems",
    "SimilarProblem",
    "Problem",
    "ProblemCompany",
    "ProblemMainTopic",
    "ProblemTopic",
    "ProblemTopicSlug",
  ];

  try {
    for (let i = 0; i < tablesToDrop.length; i++) {
      const table = tablesToDrop[i];

      // Ensure the table name is valid
      if (!table || typeof table !== "string") {
        console.warn(
          `[${new Date().toISOString()}] Skipping invalid table name:`,
          table
        );
        continue;
      }

      console.log(`[${new Date().toISOString()}] Dropping table: ${table}`);

      // Drop the table using raw SQL
      await prisma.$executeRawUnsafe(
        `DROP TABLE IF EXISTS "${table}" CASCADE;`
      );

      console.log(
        `[${new Date().toISOString()}] Successfully dropped table: ${table}`
      );
    }

    console.log(
      `[${new Date().toISOString()}] All specified tables dropped successfully.`
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error while dropping tables:`,
      error
    );
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log(`[${new Date().toISOString()}] Database connection closed.`);
  }
}

export async function seedCompaniesImages(formData: FormData) {
  try {
    // Prepare update operations for each company
    const updateOperations = companiesData.map((company) =>
      prisma.problemCompany.update({
        data: { image: company.image },
        where: { name: company.name },
      })
    );

    // Execute the update operations in a single transaction
    await prisma.$transaction(updateOperations);
    console.log("Companies images updated successfully.");
  } catch (error) {
    console.error("Error seeding companies images:", error);
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
    revalidatePath("/admin/companies");
  }
}

export async function seedDSASheets(formData: FormData) {
  try {
    await prisma.$transaction(async (prisma) => {
      const sheet = await prisma.sheets.create({
        data: {
          name: sheetsData.name,
          slug: sheetsData.slug,
          categories: {
            create: sheetsData.categories.map(({ name, problems, slug }) => ({
              name: name,
              problems: {
                connect: problems.map((problem) => ({ slug: problem.slug })),
              },
              slug: slug,
            })),
          },
        },
      });
      console.log("Sheet and categories added:", sheet);
    });
  } catch (err) {
    console.dir(err, { depth: 3 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function getSheets() {
  const results = await prisma.sheets.findMany({
    select: {
      name: true,
      categories: {
        select: {
          name: true,
          problems: { select: { title: true, slug: true } },
          _count: false,
          id: false,
        },
      },
      _count: false,
    },
  });
  return results;
}
