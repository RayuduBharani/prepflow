"use server";
import { prisma } from "@/prisma";
import problems from "../../platform_data";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import companiesData from "../../companies";
import sheetsData from "../../sheetsData";
import { toSlug } from "@/lib/utils";

export async function seedData(formData: FormData) {
  const totalProblems = problems.length;
  let processedProblems = 0;

  console.log(`Starting seeding process for ${totalProblems} problems...`);

  for (const problemData of problems) {
    console.log(
      `Processing problem: ${problemData.title} (${
        processedProblems + 1
      }/${totalProblems})`
    );

    // Create or find TopicTags
    const topicTags = await Promise.all(
      problemData.topicTags.map(async (tag) => {
        return prisma.problemTopic.upsert({
          where: { name: tag },
          update: {},
          create: { name: tag },
        });
      })
    );

    // Create or find CompanyTags
    const companyTags = await Promise.all(
      problemData.companyTags.map(async (company) => {
        let slug = toSlug(company);
        let existingCompany = await prisma.problemCompany.findUnique({
          where: { slug },
        });

        // If the slug already exists, append a unique identifier
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

    // Create or find MainTopics
    const mainTopics = await Promise.all(
      problemData.mainTopics.map(async (topic) => {
        return prisma.problemMainTopic.upsert({
          where: { name: topic },
          update: {},
          create: { name: topic },
        });
      })
    );

    // Create or find TopicSlugs
    const topicSlugs = await Promise.all(
      problemData.topicSlugs.map(async (slug) => {
        return prisma.problemTopicSlug.upsert({
          where: { slug },
          update: {},
          create: { slug },
        });
      })
    );

    let slug = problemData.slug;
    const existingProblem = await prisma.problem.findUnique({
      where: { slug },
    });

    // If the slug already exists, append a unique identifier
    if (existingProblem) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 9)}`;
    }

    const problem = await prisma.problem.create({
      data: {
        title: problemData.title,
        slug,
        isPremium: problemData.isPremium,
        dislikes: problemData.dislikes,
        likes: problemData.likes,
        difficulty: problemData.difficulty,
        url: problemData.url,
        accepted: problemData.accepted,
        submissions: problemData.submissions,
        acceptanceRate: problemData.acceptanceRate,
        platform: problemData.platform,
        topicTags: { connect: topicTags.map((tag) => ({ id: tag.id })) },
        companyTags: {
          connect: companyTags.map((company) => ({ id: company.id })),
        },
        mainTopics: { connect: mainTopics.map((topic) => ({ id: topic.id })) },
        topicSlugs: { connect: topicSlugs.map((slug) => ({ id: slug.id })) },
      },
    });

    // Create SimilarProblems
    for (const similarQuestion of problemData.similarQuestions) {
      const similarProblem = await prisma.problem.findUnique({
        where: { slug: similarQuestion.slug },
      });

      if (similarProblem) {
        await prisma.similarProblem.create({
          data: {
            problemId: problem.id,
            similarId: similarProblem.id,
          },
        });
      }
    }

    processedProblems++;
    console.log(
      `Completed problem: ${problemData.title} (${processedProblems}/${totalProblems})`
    );
  }

  console.log("Database seeded successfully!");
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
