"use server";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import companiesData from "../../companies";
import { sheetsData } from "../../sheets";
import { problems } from "../../platform_data";
import { toSlug } from "@/lib/utils";

export async function seedData() {
  if (!problems || problems.length === 0) {
    return { message: "No problems to seed.", processed: 0, total: 0 };
  }

  const totalProblems = problems.length;
  console.log(`Starting optimized seeding process for ${totalProblems} problems...`);

  // Step 1: Pre-seed ALL tags, companies, topics, and slugs in bulk (MUCH faster)
  console.log('Step 1/4: Pre-seeding all tags and companies in bulk...');

  const allTopicTags = new Set<string>();
  const allCompanyNames = new Set<string>();
  const allMainTopics = new Set<string>();
  const allTopicSlugs = new Set<string>();

  problems.forEach(p => {
    p.topicTags.forEach(tag => allTopicTags.add(tag));
    p.companyTags.forEach(company => allCompanyNames.add(company));
    p.mainTopics.forEach(topic => allMainTopics.add(topic));
    p.topicSlugs.forEach(slug => allTopicSlugs.add(slug));
  });

  // Bulk create all tags/companies/topics at once
  await Promise.all([
    prisma.problemTopic.createMany({
      data: Array.from(allTopicTags).map(name => ({ name })),
      skipDuplicates: true,
    }),
    prisma.problemMainTopic.createMany({
      data: Array.from(allMainTopics).map(name => ({ name })),
      skipDuplicates: true,
    }),
    prisma.problemTopicSlug.createMany({
      data: Array.from(allTopicSlugs).map(slug => ({ slug })),
      skipDuplicates: true,
    }),
  ]);

  // Create companies with slugs
  await Promise.all(
    Array.from(allCompanyNames).map(async (name) => {
      const slug = toSlug(name);
      await prisma.problemCompany.upsert({
        where: { name },
        update: {},
        create: { name, slug },
      }).catch(() => {}); // Ignore duplicates
    })
  );

  // Step 2: Fetch all reference IDs once (no more repeated lookups!)
  console.log('Step 2/4: Fetching reference data...');
  const [allCompanies, existingProblems] = await Promise.all([
    prisma.problemCompany.findMany({ select: { id: true, name: true } }),
    prisma.problem.findMany({ select: { slug: true } }),
  ]);

  const companyMap = new Map(allCompanies.map(c => [c.name, c.id]));
  const existingSlugs = new Set(existingProblems.map(p => p.slug));

  // Step 3: Pre-generate unique slugs to avoid race conditions
  console.log('Step 3/4: Preparing problem data...');
  const problemsWithSlugs = problems.map(problemData => {
    let slug = problemData.slug;
    if (existingSlugs.has(slug)) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 9)}`;
    }
    existingSlugs.add(slug);
    return { ...problemData, uniqueSlug: slug };
  });

  // Step 4: Create all problems in parallel batches
  console.log('Step 4/5: Creating problems in parallel batches...');
  const BATCH_SIZE = 5; // Process 5 problems at a time
  const batches = [];

  for (let i = 0; i < problemsWithSlugs.length; i += BATCH_SIZE) {
    const batch = problemsWithSlugs.slice(i, i + BATCH_SIZE);
    batches.push(
      Promise.allSettled(
        batch.map(async (problemData, idx) => {
          const overallIdx = i + idx;
          console.log(`Processing: ${problemData.title} (${overallIdx + 1}/${totalProblems})`);

          // Create problem with connections
          return prisma.problem.create({
            data: {
              title: problemData.title,
              slug: problemData.uniqueSlug,
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
                connect: problemData.topicTags.map(tag => ({ name: tag })),
              },
              companyTags: {
                connect: problemData.companyTags
                  .map(company => ({ id: companyMap.get(company) }))
                  .filter(c => c.id !== undefined),
              },
              mainTopics: {
                connect: problemData.mainTopics.map(topic => ({ name: topic })),
              },
              topicSlugs: {
                connect: problemData.topicSlugs.map(slug => ({ slug })),
              },
            },
          });
        })
      )
    );
  }

  const results = await Promise.all(batches);
  const createdProblems = results
    .flat()
    .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof prisma.problem.create>>> =>
      r.status === 'fulfilled' && r.value != null
    )
    .map(r => r.value);

  console.log(`Step 5/5: Linking similar problems... (${createdProblems.length} problems created)`);

  // Step 5: Create similar problem relationships in bulk
  const problemSlugToId = new Map<string, number>();
  for (const problem of createdProblems) {
    if (problem.slug && problem.id) {
      problemSlugToId.set(problem.slug, problem.id);
    }
  }

  const similarLinks: Array<{ problemId: number; similarId: number }> = [];
  for (const problemData of problemsWithSlugs) {
    const problemId = problemSlugToId.get(problemData.uniqueSlug);
    if (!problemId || !problemData.similarQuestions) continue;

    for (const similar of problemData.similarQuestions) {
      const similarId = problemSlugToId.get(similar.slug);
      if (similarId && problemId !== similarId) {
        similarLinks.push({ problemId, similarId });
      }
    }
  }

  if (similarLinks.length > 0) {
    await prisma.similarProblem.createMany({
      data: similarLinks,
      skipDuplicates: true,
    });
  }

  console.log("Database seeded successfully!");
  return { message: "Database seeded successfully!", processed: createdProblems.length, total: totalProblems };
}

export async function seedCompaniesImages() {
  try {
    // Execute updates in parallel batches for better performance
    const batchSize = 10; // Update 10 companies at a time
    const batches = [];

    for (let i = 0; i < companiesData.length; i += batchSize) {
      const batch = companiesData.slice(i, i + batchSize);
      batches.push(
        Promise.allSettled(
          batch.map((company) =>
            prisma.problemCompany.update({
              data: { image: company.image },
              where: { name: company.name },
            }).catch((err) => {
              console.warn(`Failed to update company ${company.name}:`, err.message);
              return null;
            })
          )
        )
      );
    }

    await Promise.all(batches);
    console.log("Companies images updated successfully.");
  } catch (error) {
    console.error("Error seeding companies images:", error);
    throw error;
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
    revalidatePath("/admin/companies");
  }
}

export async function seedDSASheets() {
  try {
    await prisma.$transaction(
      async (prisma) => {
        // Step 1: Fetch all existing problem slugs from the database
        const existingProblems = await prisma.problem.findMany({
          select: { slug: true },
        });
        const existingSlugs = new Set(existingProblems.map((problem) => problem.slug));
        console.log(`Found ${existingSlugs.size} existing problems in the database.`);

        // Step 2: Seed sheets with categories, filtering out non-existent problems
        for (const sheetData of sheetsData) {
          const sheet = await prisma.sheets.create({
            data: {
              name: sheetData.name,
              slug: sheetData.slug,
              categories: {
                create: sheetData.categories.map(({ name, problems, slug }) => {
                  // Filter problems to only include those that exist in the database
                  const validProblems = problems.filter((problem) =>
                    existingSlugs.has(problem.slug)
                  );

                  return {
                    name,
                    slug,
                    problems: {
                      connect: validProblems.map((problem) => ({ slug: problem.slug })),
                    },
                  };
                }),
              },
            },
          });
          console.log(`Sheet and categories added: ${sheet.name}`, sheet);
        }
      },
      { timeout: 15000 } // Set timeout to 15 seconds
    );
  } catch (err) {
    console.dir(err, { depth: 3 });
  } finally {
    await prisma.$disconnect();
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
    // Use a transaction for dropping tables with timeout
    await prisma.$transaction(
      async (prisma) => {
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
      },
      { timeout: 15000 } // Set timeout to 15 seconds
    );

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