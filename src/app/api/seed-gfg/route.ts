import prisma from "@/prisma";
import { Difficulty, Platform } from "../../../../generated/prisma/enums";
import { getAcceptedSubmissions, toSlug } from "@/lib/utils";

const BATCH_SIZE = 100;
const CONCURRENT_PAGE_FETCHES = 5;

const VALID_DIFFICULTIES = new Set<string>(["EASY", "MEDIUM", "HARD", "BASIC", "SCHOOL"]);

interface ValidationError {
  slug: string;
  field: string;
  value: unknown;
}

function validateGfgProblem(
  raw: GfgProblemResult
): { problem: IProblem; errors: null } | { problem: null; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  const slug = raw.slug ?? "";

  if (!raw.problem_name?.trim()) errors.push({ slug, field: "problem_name", value: raw.problem_name });
  if (!slug.trim())              errors.push({ slug, field: "slug",         value: raw.slug });
  if (!raw.problem_url?.trim())  errors.push({ slug, field: "problem_url",  value: raw.problem_url });

  const upperDifficulty = (raw.difficulty as string)?.toUpperCase();
  if (!upperDifficulty || !VALID_DIFFICULTIES.has(upperDifficulty)) {
    errors.push({ slug, field: "difficulty", value: raw.difficulty });
  }

  if (errors.length > 0) return { problem: null, errors };

  const accuracy = Number(raw.accuracy?.split("%")[0] || 0);

  return {
    problem: {
      title: raw.problem_name,
      slug: raw.slug,
      platform: Platform.GFG,
      difficulty: upperDifficulty as Difficulty,
      url: raw.problem_url,
      submissions: raw.all_submissions,
      accepted: getAcceptedSubmissions(raw.all_submissions, accuracy),
      acceptanceRate: accuracy,
      companyTags: (raw.tags?.company_tags ?? []).filter(Boolean) as string[],
      topicTags: (raw.tags?.topic_tags ?? []).filter(Boolean) as string[],
      similarQuestions: [],
      mainTopics: [],
    },
    errors: null,
  };
}

function sseEvent(payload: object): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: object) => controller.enqueue(encoder.encode(sseEvent(payload)));

      try {
        // 1. Pre-fetch existing slugs
        send({ type: "info", message: "Indexing existing GFG problems..." });
        const existingRows = await prisma.problem.findMany({
          where: { platform: Platform.GFG },
          select: { slug: true },
        });
        const existingSlugs = new Set(existingRows.map((r) => r.slug));
        const collected: IProblem[] = [];
        let page = 1;
        let hasNext = true;
        let skipped = 0;

        // 2. Fetch all pages concurrently in blocks
        while (hasNext) {
          send({ type: "info", message: `Fetching pages ${page}-${page + CONCURRENT_PAGE_FETCHES - 1}...` });

          const pagePromises = Array.from({ length: CONCURRENT_PAGE_FETCHES }, (_, i) => {
            const p = page + i;
            const url = new URL("https://practiceapi.geeksforgeeks.org/api/vr/problems/");
            url.searchParams.set("pageMode", "explore");
            url.searchParams.set("sortBy", "submissions");
            url.searchParams.set("page", String(p));
            return fetch(url.toString(), { headers: { Accept: "application/json" } })
              .then(res => (res.ok ? (res.json() as Promise<GfgApiResponse>) : null))
              .catch(() => null);
          });

          const results = await Promise.all(pagePromises);

          for (const data of results) {
            if (!data?.results?.length) {
              hasNext = false;
              continue;
            }
            for (const p of data.results) {
              if (existingSlugs.has(p.slug)) continue;
              existingSlugs.add(p.slug); // deduplicate within this run

              const result = validateGfgProblem(p);
              if (result.errors) {
                skipped++;
                const fieldList = result.errors.map(e => `${e.field}=${JSON.stringify(e.value)}`).join(", ");
                send({ type: "warn", message: `Skipped "${p.slug ?? "?"}": ${fieldList}` });
                continue;
              }
              collected.push(result.problem);
            }
            if (!data.next) hasNext = false;
          }
          page += CONCURRENT_PAGE_FETCHES;
          send({ type: "progress", message: `Found ${collected.length} new problems so far...` });
        }

        if (collected.length === 0) {
          send({ type: "success", message: "Database is already up to date." });
          return;
        }

        // 3. Upsert all unique tags in bulk
        send({ type: "info", message: "Syncing tags and companies..." });
        const allCompanies = [...new Set(collected.flatMap(p => p.companyTags))];
        const allTopics    = [...new Set(collected.flatMap(p => p.topicTags))];

        await Promise.all([
          prisma.problemCompany.createMany({
            data: allCompanies.map(name => ({ name, slug: toSlug(name) })),
            skipDuplicates: true,
          }),
          prisma.problemTopic.createMany({
            data: allTopics.map(name => ({ name })),
            skipDuplicates: true,
          }),
          prisma.problemMainTopic.createMany({
            data: allTopics.map(name => ({ name })),
            skipDuplicates: true,
          }),
        ]);

        // 4. Resolve tag name → id maps for explicit join-table inserts
        const [companyRows, topicRows] = await Promise.all([
          prisma.problemCompany.findMany({ where: { name: { in: allCompanies } }, select: { id: true, name: true } }),
          prisma.problemTopic.findMany({ where: { name: { in: allTopics } }, select: { id: true, name: true } }),
        ]);
        const companyIdByName = new Map(companyRows.map(r => [r.name, r.id]));
        const topicIdByName   = new Map(topicRows.map(r => [r.name, r.id]));

        // 5. Insert problems in batches using createMany (skipDuplicates handles edge cases)
        send({ type: "info", message: `Inserting ${collected.length} problems in batches of ${BATCH_SIZE}...` });
        let seeded = 0;

        for (let i = 0; i < collected.length; i += BATCH_SIZE) {
          const batch = collected.slice(i, i + BATCH_SIZE);

          // Insert the problem rows (flat, no relations)
          await prisma.problem.createMany({
            data: batch.map(p => ({
              title:          p.title,
              slug:           p.slug,
              platform:       p.platform as Platform,
              difficulty:     p.difficulty as Difficulty,
              submissions:    p.submissions ?? 0,
              url:            p.url,
              accepted:       p.accepted ?? 0,
              acceptanceRate: p.acceptanceRate ?? 0,
            })),
            skipDuplicates: true, // safe fallback for any remaining edge-case duplicates
          });

          // Fetch the IDs of the just-inserted problems to build join-table rows
          const insertedProblems = await prisma.problem.findMany({
            where: { slug: { in: batch.map(p => p.slug) } },
            select: { id: true, slug: true },
          });
          const problemIdBySlug = new Map(insertedProblems.map(r => [r.slug, r.id]));

          // Build join-table rows
          const topicLinks:   { A: number; B: number }[] = [];
          const companyLinks: { A: number; B: number }[] = [];

          for (const p of batch) {
            const problemId = problemIdBySlug.get(p.slug);
            if (!problemId) continue;
            for (const name of p.topicTags) {
              const tagId = topicIdByName.get(name);
              if (tagId) topicLinks.push({ A: problemId, B: tagId }); // A=Problem, B=ProblemTopic (alphabetical)
            }
            for (const name of p.companyTags) {
              const tagId = companyIdByName.get(name);
              if (tagId) companyLinks.push({ A: problemId, B: tagId }); // A=Problem, B=ProblemCompany (alphabetical)
            }
          }

          // Write join-table rows via Prisma raw (PostgreSQL: $1,$2 placeholders)
          // Prisma names implicit M2M tables as "_<RelationName>"
          if (topicLinks.length > 0) {
            const placeholders = topicLinks.map((_, i) => `($${i * 2 + 1},$${i * 2 + 2})`).join(",");
            await prisma.$executeRawUnsafe(
              `INSERT INTO "_ProblemTopicProblems" ("A","B") VALUES ${placeholders} ON CONFLICT DO NOTHING`,
              ...topicLinks.flatMap(r => [r.A, r.B])
            );
          }
          if (companyLinks.length > 0) {
            const placeholders = companyLinks.map((_, i) => `($${i * 2 + 1},$${i * 2 + 2})`).join(",");
            await prisma.$executeRawUnsafe(
              `INSERT INTO "_ProblemCompanyProblems" ("A","B") VALUES ${placeholders} ON CONFLICT DO NOTHING`,
              ...companyLinks.flatMap(r => [r.A, r.B])
            );
          }

          seeded += batch.length;
          send({ type: "progress", message: `Seeded ${Math.min(seeded, collected.length)}/${collected.length} problems.` });
        }

        send({ type: "success", message: `Seeding complete! (${skipped} problem${skipped === 1 ? "" : "s"} skipped)` });
        send({ type: "done", count: collected.length });

      } catch (error) {
        send({ type: "error", message: error instanceof Error ? error.message : "Unknown error" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}