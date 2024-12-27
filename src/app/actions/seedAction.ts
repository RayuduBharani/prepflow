'use server'
import { prisma } from "@/prisma";
import { readFileSync } from "fs";


export async function seedData(formData: FormData): Promise<void> {
    try {
      const problems: IProblem[] = JSON.parse(readFileSync('platform_data.json', 'utf-8'));
      const problemsToCreate = [];
      const topicsToCreate = new Set<string>();
      const companiesToCreate = new Set<string>();
      const mainTopicsToCreate = new Set<string>();
      const topicSlugsToCreate = new Set<string>();
  
      // Collect all unique tags and slugs
      for (const problem of problems) {
        problem.topicTags.forEach(tag => topicsToCreate.add(tag));
        problem.companyTags.forEach(company => companiesToCreate.add(company));
        problem.mainTopics.forEach(topic => mainTopicsToCreate.add(topic));
        problem.topicSlugs.forEach(slug => topicSlugsToCreate.add(slug));
  
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
      }
  
      // Create all entities in parallel
      await Promise.all([
        // Create topics
        prisma.problemTopic.createMany({
          data: Array.from(topicsToCreate).map(name => ({ name })),
          skipDuplicates: true,
        }),
        // Create companies
        prisma.problemCompany.createMany({
          data: Array.from(companiesToCreate).map(name => ({ name })),
          skipDuplicates: true,
        }),
        // Create main topics
        prisma.problemMainTopic.createMany({
          data: Array.from(mainTopicsToCreate).map(name => ({ name })),
          skipDuplicates: true,
        }),
        // Create topic slugs
        prisma.problemTopicSlug.createMany({
          data: Array.from(topicSlugsToCreate).map(slug => ({ slug })),
          skipDuplicates: true,
        })
      ]);
  
      // Create problems
      await prisma.problem.createMany({
        data: problemsToCreate,
        skipDuplicates: true,
      });
  
      // Fetch created problems to get their IDs
      const createdProblems = await prisma.problem.findMany({
        where: {
          slug: {
            in: problems.map(p => p.slug)
          }
        }
      });
  
      // Create similar problems relationships
      const similarProblemsData = [];
      for (const problem of problems) {
        const problemRecord = createdProblems.find(p => p.slug === problem.slug);
        if (!problemRecord) continue;
  
        for (const similar of problem.similarQuestions) {
          const similarRecord = createdProblems.find(p => p.slug === similar.slug);
          if (similarRecord) {
            similarProblemsData.push({
              problemId: problemRecord.id,
              similarId: similarRecord.id,
            });
          }
        }
      }
  
      if (similarProblemsData.length > 0) {
        await prisma.similarProblem.createMany({
          data: similarProblemsData,
          skipDuplicates: true,
        });
      }
  
      // Create relationships between problems and their tags
      for (const problem of createdProblems) {
        const originalProblem = problems.find(p => p.slug === problem.slug);
        if (!originalProblem) continue;
  
        await prisma.problem.update({
          where: { id: problem.id },
          data: {
            topicTags: {
              connect: originalProblem.topicTags.map(name => ({ name }))
            },
            companyTags: {
              connect: originalProblem.companyTags.map(name => ({ name }))
            },
            mainTopics: {
              connect: originalProblem.mainTopics.map(name => ({ name }))
            },
            topicSlugs: {
              connect: originalProblem.topicSlugs.map(slug => ({ slug }))
            }
          }
        });
      }
  
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error;
    }
  }
  
  