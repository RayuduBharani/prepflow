'use server'

import { prisma } from "@/prisma"
import { cache } from "react"

export const getCompanyImg = cache(async (name: string) => {
    return prisma.problemCompany.findFirst({
        where: {
            slug: name
        },
        include: {
            _count: {
                select: {
                    problems: true
                }
            }
        }
    })
})

export const getCompanies = cache(async (currentPage: number) => {
    const data = await prisma.problemCompany.findMany({
        orderBy: { problems: { _count: 'desc' } },
        include: { _count: { select: { problems: true } } },
        take: 10,
        skip: (currentPage - 1) * 10,
    })
    return data
})

export const companyTopics = cache(async (slug: string) => {
    const result = await prisma.problemTopicSlug.findMany({
        where: {
            problems: {
                some: {
                    companyTags: {
                        some: {
                            slug: slug
                        },
                    },
                    platform: 'LEETCODE',
                },
            },
        },
        orderBy: { problems: { _count: 'desc' } },
        include: { _count: { select: { problems: { where: { companyTags: { some: { slug } }, platform: 'LEETCODE' } }, } } }
    })
    return result
}) // leetcode company topics

export const GFGcompanyTopics = cache(async (slug: string) => {
    const result = await prisma.problemTopicSlug.findMany({
        where: {
            problems: {
                some: {
                    companyTags: {
                        some: {
                            slug: slug
                        },
                    },
                    platform: 'GFG',
                },
            },
        },
        orderBy: { problems: { _count: 'desc' } },
        include: { _count: { select: { problems: { where: { companyTags: { some: { slug } }, platform: 'GFG' } }, } } }
    })
    return result
}) // gfg company topics


export const getPlatformQuestions = cache(async (company: string, companyTopic: string , platform : "LEETCODE" | "GFG") => {
    console.log(company , companyTopic)
    const data = await prisma.problemCompany.findMany({
        where: {
            slug : company
        },
        include: {
            problems: {
                where: {
                    platform : platform,
                    topicSlugs : {
                        some : {
                            slug : companyTopic,
                        }
                    },
                }
            },
            _count : true
        }
    })
    return data
})