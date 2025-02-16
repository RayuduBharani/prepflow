"use server";
import { prisma } from "@/prisma";
import { readFileSync } from "fs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import sheetsData from "../../sheetsData";

export async function seedData(formData: FormData): Promise<void> {
  console.log(`[${new Date().toISOString()}] Starting data seeding process...`);

  try {
    console.log(
      `[${new Date().toISOString()}] Reading platform data from JSON file...`
    );
    const problems: IProblem[] = JSON.parse(
      readFileSync("platform_data.json", "utf-8")
    );

    const problemsToCreate: any = [];
    const topicsToCreate = new Set<string>();
    const companiesToCreate = new Set<string>();
    const mainTopicsToCreate = new Set<string>();
    const topicSlugsToCreate = new Set<string>();

    console.log(
      `[${new Date().toISOString()}] Parsing problems and collecting tags...`
    );
    problems.forEach((problem, index) => {
      problem.topicTags.forEach((tag) => topicsToCreate.add(tag));
      problem.companyTags.forEach((company) => companiesToCreate.add(company));
      problem.mainTopics.forEach((topic) => mainTopicsToCreate.add(topic));
      problem.topicSlugs.forEach((slug) => topicSlugsToCreate.add(slug));

      problemsToCreate.push({
        title: problem.title,
        slug: problem.slug,
        isPremium: problem.isPremium || false,
        dislikes: problem.dislikes || null,
        likes: problem.likes || null,
        difficulty: problem.difficulty,
        url: problem.url,
        accepted: problem.accepted || null,
        submissions: problem.submissions,
        acceptanceRate: problem.acceptanceRate,
        platform: problem.platform,
      });

      if (
        (index + 1) % Math.ceil(problems.length / 10) === 0 ||
        index === problems.length - 1
      ) {
        const percentage = Math.floor(((index + 1) / problems.length) * 100);
        console.log(
          `[${new Date().toISOString()}] Processed ${index + 1}/${
            problems.length
          } problems (${percentage}%).`
        );
      }
    });

    console.log(
      `[${new Date().toISOString()}] Starting parallel creation of topics, companies, main topics, and topic slugs...`
    );
    await Promise.all([
      prisma.problemTopic
        .createMany({
          data: Array.from(topicsToCreate).map((name) => ({ name })),
          skipDuplicates: true,
        })
        .then(() =>
          console.log(
            `[${new Date().toISOString()}] Topics created successfully.`
          )
        ),

      prisma.problemCompany
        .createMany({
          data: Array.from(companiesToCreate).map((name) => ({ name })),
          skipDuplicates: true,
        })
        .then(() =>
          console.log(
            `[${new Date().toISOString()}] Companies created successfully.`
          )
        ),

      prisma.problemMainTopic
        .createMany({
          data: Array.from(mainTopicsToCreate).map((name) => ({ name })),
          skipDuplicates: true,
        })
        .then(() =>
          console.log(
            `[${new Date().toISOString()}] Main topics created successfully.`
          )
        ),

      prisma.problemTopicSlug
        .createMany({
          data: Array.from(topicSlugsToCreate).map((slug) => ({ slug })),
          skipDuplicates: true,
        })
        .then(() =>
          console.log(
            `[${new Date().toISOString()}] Topic slugs created successfully.`
          )
        ),
    ]);

    console.log(`[${new Date().toISOString()}] Creating problems...`);
    await prisma.problem.createMany({
      data: problemsToCreate,
      skipDuplicates: true,
    });
    console.log(`[${new Date().toISOString()}] Problems created successfully.`);

    console.log(
      `[${new Date().toISOString()}] Fetching created problems for further processing...`
    );
    const createdProblems = await prisma.problem.findMany({
      where: {
        slug: {
          in: problems.map((p) => p.slug),
        },
      },
    });

    console.log(
      `[${new Date().toISOString()}] Creating similar problem relationships...`
    );
    const similarProblemsData: any = [];
    problems.forEach((problem, index) => {
      const problemRecord = createdProblems.find(
        (p) => p.slug === problem.slug
      );
      if (!problemRecord) return;

      for (const similar of problem.similarQuestions) {
        const similarRecord = createdProblems.find(
          (p) => p.slug === similar.slug
        );
        if (similarRecord) {
          similarProblemsData.push({
            problemId: problemRecord.id,
            similarId: similarRecord.id,
          });
        }
      }
      if (
        (index + 1) % Math.ceil(problems.length / 10) === 0 ||
        index === problems.length - 1
      ) {
        const percentage = Math.floor(((index + 1) / problems.length) * 100);
        console.log(
          `[${new Date().toISOString()}] Processed similar questions for ${
            index + 1
          }/${problems.length} problems (${percentage}%).`
        );
      }
    });

    if (similarProblemsData.length > 0) {
      await prisma.similarProblem.createMany({
        data: similarProblemsData,
        skipDuplicates: true,
      });
      console.log(
        `[${new Date().toISOString()}] Similar problem relationships created successfully.`
      );
    } else {
      console.log(
        `[${new Date().toISOString()}] No similar problem relationships to create.`
      );
    }

    console.log(
      `[${new Date().toISOString()}] Creating problem relationships with tags, companies, main topics, and slugs...`
    );
    for (let i = 0; i < createdProblems.length; i++) {
      const problem = createdProblems[i];
      const originalProblem = problems.find((p) => p.slug === problem.slug);
      if (!originalProblem) continue;

      await prisma.problem.update({
        where: { id: problem.id },
        data: {
          topicTags: {
            connect: originalProblem.topicTags.map((name) => ({ name })),
          },
          companyTags: {
            connect: originalProblem.companyTags.map((name) => ({ name })),
          },
          mainTopics: {
            connect: originalProblem.mainTopics.map((name) => ({ name })),
          },
          topicSlugs: {
            connect: originalProblem.topicSlugs.map((slug) => ({ slug })),
          },
        },
      });
      if (
        (i + 1) % Math.ceil(createdProblems.length / 10) === 0 ||
        i === createdProblems.length - 1
      ) {
        const percentage = Math.floor(((i + 1) / createdProblems.length) * 100);
        console.log(
          `[${new Date().toISOString()}] Processed relationships for ${i + 1}/${
            createdProblems.length
          } problems (${percentage}%).`
        );
      }
    }
    console.log(
      `[${new Date().toISOString()}] Problem relationships created successfully.`
    );

    console.log(
      `[${new Date().toISOString()}] Data seeding process completed successfully.`
    );
    const cookieStore = await cookies();
    cookieStore.set("seed", "seed-value", { expires: 2 });
    revalidatePath("/admin");
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error during data seeding:`,
      error
    );
    throw error;
  }
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
    // Read and parse the companies data file
    const fileContent = readFileSync("companies.json", "utf-8");
    const companiesData: { name: string; image: string }[] =
      JSON.parse(fileContent);

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
            slug : sheetsData.slug,
            categories: {
              create: sheetsData.categories.map(({ name, problems, slug }) => ({
                name: name,
                problems: {
                  connect: problems.map((problem) => ({ slug : problem.slug })),
                },
                slug : slug
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
      name : true,
      categories: {
        select: { name :true, problems: { select: { title: true, slug: true }, }, _count : false, id : false },
      },
      _count : false,
    },
  });
  return results
}
