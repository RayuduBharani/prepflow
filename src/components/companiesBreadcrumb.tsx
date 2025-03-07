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
        <Breadcrumb className='mb-5'>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/companies">Company</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/companies/${companyName}`}>{companyName}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{topic ? toTitleCase(topic) : "Problems" }</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

    )
}
