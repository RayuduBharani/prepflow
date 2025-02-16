'use server'

import { prisma } from "@/prisma"

export async function submitCompanyName(formData : FormData) {
    const company = formData.get('company') as string
    const results = await prisma.problemCompany.findMany({})

}