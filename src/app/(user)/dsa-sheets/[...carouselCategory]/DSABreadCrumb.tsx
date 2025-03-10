import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";

const DSABreadCrumb = ({carouselCategory, sheetName, categoryName} : {carouselCategory : string[], sheetName : string, categoryName : string}) => {
  return (
    <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className='text-xs'>
            <BreadcrumbLink href="/dsa-sheets">DSA Sheets</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className='text-xs'>
            <BreadcrumbLink href={`/dsa-sheets#${carouselCategory[0]}`}>{sheetName}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className='text-xs'>
            <BreadcrumbPage>{categoryName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
  )
}

export default DSABreadCrumb