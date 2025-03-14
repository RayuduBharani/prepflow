-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'BASIC', 'SCHOOL');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('LEETCODE', 'GFG');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('Full_time', 'Remote', 'Part_time', 'Contract');

-- CreateEnum
CREATE TYPE "InternType" AS ENUM ('Full_time', 'remote', 'Part_time', 'on_site');

-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('MAIN', 'SUB', 'END', 'OPTIONAL');

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimilarProblem" (
    "id" SERIAL NOT NULL,
    "problemId" INTEGER NOT NULL,
    "similarId" INTEGER NOT NULL,

    CONSTRAINT "SimilarProblem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemTopic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProblemTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemCompany" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "ProblemCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemMainTopic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProblemMainTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemTopicSlug" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "ProblemTopicSlug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sheets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,

    CONSTRAINT "Sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SheetCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sheetId" INTEGER NOT NULL,

    CONSTRAINT "SheetCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isPremium" BOOLEAN,
    "dislikes" INTEGER,
    "likes" INTEGER,
    "difficulty" "Difficulty" NOT NULL,
    "url" TEXT NOT NULL,
    "accepted" INTEGER,
    "submissions" INTEGER NOT NULL DEFAULT 0,
    "acceptanceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "platform" "Platform" NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "Jobs" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "jobtype" "JobType" NOT NULL,
    "location" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "responsibilities" TEXT[],
    "requirements" TEXT[],
    "skills" TEXT[],
    "benefits" TEXT[],
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "experience" TEXT NOT NULL,

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internships" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "stipend" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "requirements" TEXT[],
    "skills" TEXT[],
    "benefits" TEXT[],
    "url" TEXT NOT NULL,
    "internType" "InternType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "internships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Node" (
    "id" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "label" TEXT NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,
    "data" JSONB,
    "roadmapId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" TEXT NOT NULL,
    "sourceNodeId" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,
    "label" TEXT,
    "roadmapId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SheetCategoryProblems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SheetCategoryProblems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProblemCategoryProblems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProblemCategoryProblems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProblemTopicProblems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProblemTopicProblems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProblemCompanyProblems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProblemCompanyProblems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProblemMainTopicProblems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProblemMainTopicProblems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProblemTopicSlugProblems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProblemTopicSlugProblems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "SimilarProblem_problemId_idx" ON "SimilarProblem"("problemId");

-- CreateIndex
CREATE INDEX "SimilarProblem_similarId_idx" ON "SimilarProblem"("similarId");

-- CreateIndex
CREATE UNIQUE INDEX "SimilarProblem_problemId_similarId_key" ON "SimilarProblem"("problemId", "similarId");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemTopic_name_key" ON "ProblemTopic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemCompany_name_key" ON "ProblemCompany"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemCompany_slug_key" ON "ProblemCompany"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemMainTopic_name_key" ON "ProblemMainTopic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemTopicSlug_slug_key" ON "ProblemTopicSlug"("slug");

-- CreateIndex
CREATE INDEX "UserProgress_userId_idx" ON "UserProgress"("userId");

-- CreateIndex
CREATE INDEX "UserProgress_problemId_idx" ON "UserProgress"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_problemId_key" ON "UserProgress"("userId", "problemId");

-- CreateIndex
CREATE UNIQUE INDEX "Sheets_slug_key" ON "Sheets"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemCategory_name_key" ON "ProblemCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemCategory_slug_key" ON "ProblemCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_slug_key" ON "Problem"("slug");

-- CreateIndex
CREATE INDEX "Problem_difficulty_idx" ON "Problem"("difficulty");

-- CreateIndex
CREATE INDEX "Problem_difficulty_platform_idx" ON "Problem"("difficulty", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- CreateIndex
CREATE INDEX "Node_roadmapId_idx" ON "Node"("roadmapId");

-- CreateIndex
CREATE INDEX "Edge_roadmapId_idx" ON "Edge"("roadmapId");

-- CreateIndex
CREATE INDEX "_SheetCategoryProblems_B_index" ON "_SheetCategoryProblems"("B");

-- CreateIndex
CREATE INDEX "_ProblemCategoryProblems_B_index" ON "_ProblemCategoryProblems"("B");

-- CreateIndex
CREATE INDEX "_ProblemTopicProblems_B_index" ON "_ProblemTopicProblems"("B");

-- CreateIndex
CREATE INDEX "_ProblemCompanyProblems_B_index" ON "_ProblemCompanyProblems"("B");

-- CreateIndex
CREATE INDEX "_ProblemMainTopicProblems_B_index" ON "_ProblemMainTopicProblems"("B");

-- CreateIndex
CREATE INDEX "_ProblemTopicSlugProblems_B_index" ON "_ProblemTopicSlugProblems"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimilarProblem" ADD CONSTRAINT "SimilarProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimilarProblem" ADD CONSTRAINT "SimilarProblem_similarId_fkey" FOREIGN KEY ("similarId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetCategory" ADD CONSTRAINT "SheetCategory_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SheetCategoryProblems" ADD CONSTRAINT "_SheetCategoryProblems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SheetCategoryProblems" ADD CONSTRAINT "_SheetCategoryProblems_B_fkey" FOREIGN KEY ("B") REFERENCES "SheetCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemCategoryProblems" ADD CONSTRAINT "_ProblemCategoryProblems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemCategoryProblems" ADD CONSTRAINT "_ProblemCategoryProblems_B_fkey" FOREIGN KEY ("B") REFERENCES "ProblemCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemTopicProblems" ADD CONSTRAINT "_ProblemTopicProblems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemTopicProblems" ADD CONSTRAINT "_ProblemTopicProblems_B_fkey" FOREIGN KEY ("B") REFERENCES "ProblemTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemCompanyProblems" ADD CONSTRAINT "_ProblemCompanyProblems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemCompanyProblems" ADD CONSTRAINT "_ProblemCompanyProblems_B_fkey" FOREIGN KEY ("B") REFERENCES "ProblemCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemMainTopicProblems" ADD CONSTRAINT "_ProblemMainTopicProblems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemMainTopicProblems" ADD CONSTRAINT "_ProblemMainTopicProblems_B_fkey" FOREIGN KEY ("B") REFERENCES "ProblemMainTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemTopicSlugProblems" ADD CONSTRAINT "_ProblemTopicSlugProblems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemTopicSlugProblems" ADD CONSTRAINT "_ProblemTopicSlugProblems_B_fkey" FOREIGN KEY ("B") REFERENCES "ProblemTopicSlug"("id") ON DELETE CASCADE ON UPDATE CASCADE;

