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
                <BreadcrumbItem className='text-xs'>
                    <BreadcrumbLink href="/companies">Companies</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className='text-xs'>
                    <BreadcrumbLink href={`/companies/${companyName}`}>{toTitleCase(companyName)}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className='text-xs'>
                    <BreadcrumbPage>{topic ? toTitleCase(topic) : "Problems" }</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

    )
}
