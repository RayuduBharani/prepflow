"use server";

import prisma from "@/prisma";
import { getSession } from "@/auth-client";
import { UserRole, Difficulty, Platform, JobType, InternType, NodeType } from "../../generated/prisma/enums";

// ── helpers ────────────────────────────────────────────────────────────────────

/** Drain a table in batches to stay within serverless memory limits. */
async function fetchInBatches<T>(
  fetcher: (skip: number, take: number) => Promise<T[]>,
  batchSize = 2000,
): Promise<T[]> {
  const results: T[] = [];
  let skip = 0;
  while (true) {
    const batch = await fetcher(skip, batchSize);
    results.push(...batch);
    if (batch.length < batchSize) break;
    skip += batchSize;
  }
  return results;
}

/**
 * JSON replacer that safely serialises BigInt values and converts Date objects
 * to ISO strings so the output is fully round-tripable.
 */
function safeReplacer(_key: string, value: unknown): unknown {
  if (typeof value === "bigint") return value.toString();
  return value;
}

// ── main action ────────────────────────────────────────────────────────────────

export type BackupResult =
  | { success: true; data: string; filename: string }
  | { success: false; error: string };

/**
 * Server action — exports every Prisma model as a single JSON string.
 *
 * Designed to run on serverless runtimes (Vercel, etc.):
 *  - uses the Prisma client (no pg_dump/native binaries)
 *  - batches large tables so no single fetch blows the memory limit
 *  - returns a serialised string ready for the client to download
 *
 * Requires an authenticated ADMIN session.
 */
export async function createDatabaseBackup(): Promise<BackupResult> {
  // ── 1. Auth guard ────────────────────────────────────────────────────────────
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  // better-auth customSession plugin injects `role` onto the session object
  const role = (session as unknown as { role?: UserRole }).role;
  if (role !== UserRole.ADMIN) {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    // ── 2. Static / small tables — fetch all in one shot (parallelised) ─────────
    const [
      problemTopics,
      problemCompanies,
      problemMainTopics,
      users,
      sheets,
      jobs,
      internships,
      roadmaps,
      nodes,
      edges,
      verifications,
    ] = await Promise.all([
      prisma.problemTopic.findMany(),
      prisma.problemCompany.findMany(),
      prisma.problemMainTopic.findMany(),

      // Users — omit sensitive tokens but keep identifiers & meta
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          leetcode_username: true,
          lastLogin: true,
        },
      }),

      // Sheets with nested categories (no problem data — resolved via junction)
      prisma.sheets.findMany({
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
              sheetId: true,
            },
          },
        },
      }),

      prisma.jobs.findMany(),
      prisma.internships.findMany(),
      prisma.roadmap.findMany(),
      prisma.node.findMany(),
      prisma.edge.findMany(),
      prisma.verification.findMany(),
    ]);

    // ── 3. Large tables — paginated ─────────────────────────────────────────────
    const [problems, similarProblems, userProgress, accounts] =
      await Promise.all([
        // Problems with their scalar fields + relation IDs for full re-import
        fetchInBatches((skip, take) =>
          prisma.problem.findMany({
            skip,
            take,
            include: {
              topicTags: { select: { id: true } },
              companyTags: { select: { id: true } },
              mainTopics: { select: { id: true } },
              sheetCategory: { select: { id: true } },
            },
          }),
        ),

        fetchInBatches((skip, take) =>
          prisma.similarProblem.findMany({ skip, take }),
        ),

        fetchInBatches((skip, take) =>
          prisma.userProgress.findMany({ skip, take }),
        ),

        // Accounts — keep everything except raw tokens
        fetchInBatches((skip, take) =>
          prisma.account.findMany({
            skip,
            take,
            select: {
              id: true,
              accountId: true,
              providerId: true,
              userId: true,
              scope: true,
              createdAt: true,
              updatedAt: true,
            },
          }),
        ),
      ]);

    // ── 4. Assemble backup payload ───────────────────────────────────────────────
    const backup = {
      metadata: {
        version: "1.0",
        timestamp: new Date().toISOString(),
        tables: {
          problems: problems.length,
          problemTopics: problemTopics.length,
          problemCompanies: problemCompanies.length,
          problemMainTopics: problemMainTopics.length,
          similarProblems: similarProblems.length,
          sheets: sheets.length,
          jobs: jobs.length,
          internships: internships.length,
          roadmaps: roadmaps.length,
          nodes: nodes.length,
          edges: edges.length,
          users: users.length,
          userProgress: userProgress.length,
          accounts: accounts.length,
          verifications: verifications.length,
        },
      },
      problems,
      problemTopics,
      problemCompanies,
      problemMainTopics,
      similarProblems,
      sheets,
      jobs,
      internships,
      roadmaps,
      nodes,
      edges,
      users,
      userProgress,
      accounts,
      verifications,
    };

    const data = JSON.stringify(backup, safeReplacer);

    const filename = `backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;

    return { success: true, data, filename };
  } catch (err) {
    console.error("[backup] Failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Backup failed",
    };
  }
}

// ── restore ────────────────────────────────────────────────────────────────────

export type RestoreResult =
  | { success: true; stats: Record<string, number> }
  | { success: false; error: string };

// Minimal shapes that the restore action actually needs from each table

type BProblemTopic = { id: number; name: string | null };
type BProblemCompany = { id: number; name: string; slug: string; image: string | null };
type BProblemMainTopic = { id: number; name: string };
type BSheet = {
  id: number;
  name: string;
  slug: string | null;
  categories: Array<{ id: number; name: string; slug: string; sheetId: number }>;
};
type BProblem = {
  id: number;
  title: string;
  slug: string;
  isPremium: boolean | null;
  dislikes: number | null;
  likes: number | null;
  difficulty: Difficulty;
  url: string;
  accepted: number | null;
  submissions: number;
  acceptanceRate: number;
  platform: Platform;
  topicTags: Array<{ id: number }>;
  companyTags: Array<{ id: number }>;
  mainTopics: Array<{ id: number }>;
  sheetCategory: Array<{ id: number }>;
};
type BSimilarProblem = { id: number; problemId: number; similarId: number };
type BUserProgress = {
  id: number;
  userId: string;
  problemId: number;
  isCompleted: boolean;
  completedAt: string | null;
  updatedAt: string;
};
type BJob = {
  id: string;
  company: string;
  title: string;
  jobtype: JobType;
  location: string;
  salary: string;
  logo: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  url: string;
  createdAt: string;
  experience: string;
};
type BInternship = {
  id: string;
  company: string;
  logo: string;
  title: string;
  location: string;
  stipend: string;
  duration: string;
  about: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  url: string;
  internType: InternType;
  createdAt: string;
};
type BRoadmap = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};
type BNode = {
  id: string;
  type: NodeType;
  label: string;
  positionX: number;
  positionY: number;
  data: unknown;
  roadmapId: string;
  createdAt: string;
  updatedAt: string;
};
type BEdge = {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label: string | null;
  roadmapId: string;
  createdAt: string;
  updatedAt: string;
};
type BUser = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  leetcode_username: string | null;
  lastLogin: string | null;
};
type BAccount = {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  scope: string | null;
  createdAt: string;
  updatedAt: string;
};
type BVerification = {
  id: string;
  identifier: string;
  value: string;
  expiresAt: string;
  createdAt: string | null;
  updatedAt: string | null;
};

type BackupPayload = {
  metadata: { version: string; timestamp: string; tables: Record<string, number> };
  problems: BProblem[];
  problemTopics: BProblemTopic[];
  problemCompanies: BProblemCompany[];
  problemMainTopics: BProblemMainTopic[];
  similarProblems: BSimilarProblem[];
  sheets: BSheet[];
  jobs: BJob[];
  internships: BInternship[];
  roadmaps: BRoadmap[];
  nodes: BNode[];
  edges: BEdge[];
  users: BUser[];
  userProgress: BUserProgress[];
  accounts: BAccount[];
  verifications: BVerification[];
};

const REQUIRED_KEYS: Array<keyof Omit<BackupPayload, "metadata">> = [
  "problems",
  "problemTopics",
  "problemCompanies",
  "problemMainTopics",
  "similarProblems",
  "sheets",
  "jobs",
  "internships",
  "roadmaps",
  "nodes",
  "edges",
  "users",
  "userProgress",
  "accounts",
  "verifications",
];

function isValidBackup(data: unknown): data is BackupPayload {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (!d.metadata || typeof (d.metadata as Record<string, unknown>).version !== "string") return false;
  const missing = REQUIRED_KEYS.filter((k) => !Array.isArray(d[k]));
  if (missing.length > 0) throw new Error(`Missing or invalid fields: ${missing.join(", ")}`);
  return true;
}

/** Split array into chunks of `size`. */
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Server action — restores a database backup produced by `createDatabaseBackup`.
 *
 * Safe to run against a DB that already has data: every write uses
 * `skipDuplicates: true` so existing rows are left untouched.
 *
 * Accepts a `FormData` with a `file` field containing the JSON backup file.
 * Requires an authenticated ADMIN session.
 */
export async function restoreFromBackup(formData: FormData): Promise<RestoreResult> {
  // ── 1. Auth guard ────────────────────────────────────────────────────────────
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const role = (session as unknown as { role?: UserRole }).role;
  if (role !== UserRole.ADMIN) return { success: false, error: "Insufficient permissions" };

  // ── 2. Parse & validate file ─────────────────────────────────────────────────
  const file = formData.get("file") as File | null;
  if (!file) return { success: false, error: "No file provided" };

  let backup: BackupPayload;
  try {
    const text = await file.text();
    const raw: unknown = JSON.parse(text);
    if (!isValidBackup(raw)) return { success: false, error: "Invalid backup structure" };
    backup = raw;
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to parse backup file",
    };
  }

  const stats: Record<string, number> = {};

  try {
    // ── 3. Independent lookup tables ─────────────────────────────────────────────
    const [pt, pmt, pc] = await Promise.all([
      prisma.problemTopic.createMany({
        data: backup.problemTopics.map(({ id, name }) => ({ id, name })),
        skipDuplicates: true,
      }),
      prisma.problemMainTopic.createMany({
        data: backup.problemMainTopics.map(({ id, name }) => ({ id, name })),
        skipDuplicates: true,
      }),
      prisma.problemCompany.createMany({
        data: backup.problemCompanies.map(({ id, name, slug, image }) => ({ id, name, slug, image })),
        skipDuplicates: true,
      }),
    ]);
    stats.problemTopics = pt.count;
    stats.problemMainTopics = pmt.count;
    stats.problemCompanies = pc.count;

    // ── 4. Users (required before Account, UserProgress) ─────────────────────────
    const ur = await prisma.user.createMany({
      data: backup.users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        emailVerified: u.emailVerified,
        image: u.image,
        role: u.role,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
        leetcode_username: u.leetcode_username,
        lastLogin: u.lastLogin ? new Date(u.lastLogin) : null,
      })),
      skipDuplicates: true,
    });
    stats.users = ur.count;

    // ── 5. Verifications, Jobs, Internships (independent) ────────────────────────
    const [vr, jr, ir] = await Promise.all([
      prisma.verification.createMany({
        data: backup.verifications.map((v) => ({
          id: v.id,
          identifier: v.identifier,
          value: v.value,
          expiresAt: new Date(v.expiresAt),
          createdAt: v.createdAt ? new Date(v.createdAt) : null,
          updatedAt: v.updatedAt ? new Date(v.updatedAt) : null,
        })),
        skipDuplicates: true,
      }),
      prisma.jobs.createMany({
        data: backup.jobs.map((j) => ({
          ...j,
          createdAt: new Date(j.createdAt),
        })),
        skipDuplicates: true,
      }),
      prisma.internships.createMany({
        data: backup.internships.map((i) => ({
          ...i,
          createdAt: new Date(i.createdAt),
        })),
        skipDuplicates: true,
      }),
    ]);
    stats.verifications = vr.count;
    stats.jobs = jr.count;
    stats.internships = ir.count;

    // ── 6. Roadmaps → Nodes → Edges ──────────────────────────────────────────────
    const rmr = await prisma.roadmap.createMany({
      data: backup.roadmaps.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
      })),
      skipDuplicates: true,
    });
    stats.roadmaps = rmr.count;

    const nr = await prisma.node.createMany({
      data: backup.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        label: n.label,
        positionX: n.positionX,
        positionY: n.positionY,
        data: (n.data ?? undefined) as object | undefined,
        roadmapId: n.roadmapId,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
      })),
      skipDuplicates: true,
    });
    stats.nodes = nr.count;

    const er = await prisma.edge.createMany({
      data: backup.edges.map((e) => ({
        id: e.id,
        sourceNodeId: e.sourceNodeId,
        targetNodeId: e.targetNodeId,
        label: e.label,
        roadmapId: e.roadmapId,
        createdAt: new Date(e.createdAt),
        updatedAt: new Date(e.updatedAt),
      })),
      skipDuplicates: true,
    });
    stats.edges = er.count;

    // ── 7. Sheets → SheetCategories (scalar only, required before problem M2M) ───
    const sr = await prisma.sheets.createMany({
      data: backup.sheets.map(({ id, name, slug }) => ({ id, name, slug })),
      skipDuplicates: true,
    });
    stats.sheets = sr.count;

    const allCategories = backup.sheets.flatMap((s) => s.categories);
    const scr = await prisma.sheetCategory.createMany({
      data: allCategories.map(({ id, name, slug, sheetId }) => ({ id, name, slug, sheetId })),
      skipDuplicates: true,
    });
    stats.sheetCategories = scr.count;

    // ── 8. Problems (scalars only, M2M restored separately) ──────────────────────
    const pr = await prisma.problem.createMany({
      data: backup.problems.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        isPremium: p.isPremium,
        dislikes: p.dislikes,
        likes: p.likes,
        difficulty: p.difficulty,
        url: p.url,
        accepted: p.accepted,
        submissions: p.submissions,
        acceptanceRate: p.acceptanceRate,
        platform: p.platform,
      })),
      skipDuplicates: true,
    });
    stats.problems = pr.count;

    // ── 9. Problem M2M relations (batched updates of 50) ─────────────────────────
    // Only update problems that had at least one M2M relation in the backup
    const problemsWithRelations = backup.problems.filter(
      (p) =>
        p.topicTags.length > 0 ||
        p.companyTags.length > 0 ||
        p.mainTopics.length > 0 ||
        p.sheetCategory.length > 0,
    );

    for (const batch of chunk(problemsWithRelations, 50)) {
      await Promise.all(
        batch.map((p) =>
          prisma.problem.update({
            where: { id: p.id },
            data: {
              topicTags: { set: p.topicTags },
              companyTags: { set: p.companyTags },
              mainTopics: { set: p.mainTopics },
              sheetCategory: { set: p.sheetCategory },
            },
          }),
        ),
      );
    }
    stats.problemRelationsUpdated = problemsWithRelations.length;

    // ── 10. SimilarProblem ───────────────────────────────────────────────────────
    const spr = await prisma.similarProblem.createMany({
      data: backup.similarProblems.map(({ id, problemId, similarId }) => ({ id, problemId, similarId })),
      skipDuplicates: true,
    });
    stats.similarProblems = spr.count;

    // ── 11. UserProgress ────────────────────────────────────────────────────────
    const upr = await prisma.userProgress.createMany({
      data: backup.userProgress.map((u) => ({
        id: u.id,
        userId: u.userId,
        problemId: u.problemId,
        isCompleted: u.isCompleted,
        completedAt: u.completedAt ? new Date(u.completedAt) : null,
        updatedAt: new Date(u.updatedAt),
      })),
      skipDuplicates: true,
    });
    stats.userProgress = upr.count;

    // ── 12. Accounts (depends on User) ──────────────────────────────────────────
    const ar = await prisma.account.createMany({
      data: backup.accounts.map((a) => ({
        id: a.id,
        accountId: a.accountId,
        providerId: a.providerId,
        userId: a.userId,
        scope: a.scope,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt),
      })),
      skipDuplicates: true,
    });
    stats.accounts = ar.count;

    console.log("[restore] Completed:", stats);
    return { success: true, stats };
  } catch (err) {
    console.error("[restore] Failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Restore failed",
    };
  }
}
