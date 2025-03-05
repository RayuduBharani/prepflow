import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toTitleCase } from '@/lib/utils'



export default function CompaniesBreadcrumb({companyName , topic} : {companyName: string , topic ?: string}) {
    return (
        <Breadcrumb className='mb-3'>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/companies">Companies page</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/companies/${companyName}`}>{companyName} Topics</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{topic ? toTitleCase(topic) : "questions" }</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

    )
}
