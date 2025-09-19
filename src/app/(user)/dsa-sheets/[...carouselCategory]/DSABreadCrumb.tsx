import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Metadata } from "next";
import { metadata as defaultMetadata } from "@/lib/defaultMetadata";

type PageProps = {
  params: {
    sheetName: string;
    categoryName: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sheetName, categoryName } = params;

  return {
    ...defaultMetadata,
    title: `${categoryName} | ${sheetName} DSA Sheet | PrepFlow`,
    description: `Solve ${categoryName} problems from the ${sheetName} DSA Sheet on PrepFlow. Curated questions for coding interviews and FAANG preparation.`,
    keywords: [
      ...(defaultMetadata.keywords || []),
      `${sheetName} DSA Sheet`,
      `${categoryName} Problems`,
      "Coding Interview Prep",
      "DSA Practice",
      "FAANG Interview Questions",
    ],
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `${categoryName} - ${sheetName} DSA Sheet | PrepFlow`,
      description: `Boost your preparation with ${categoryName} problems from the ${sheetName} DSA Sheet.`,
      url: `https://prepflow.vercel.app/dsa-sheets/${sheetName}/${categoryName}`,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${categoryName} | ${sheetName} DSA Sheet - PrepFlow`,
      description: `Practice ${categoryName} questions from the ${sheetName} DSA Sheet curated for coding interviews.`,
    },
    alternates: {
      canonical: `https://prepflow.vercel.app/dsa-sheets/${sheetName}/${categoryName}`,
    },
  };
}

const DSABreadCrumb = ({
  carouselCategory,
  sheetName,
  categoryName,
}: {
  carouselCategory: string[];
  sheetName: string;
  categoryName: string;
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="text-xs">
          <BreadcrumbLink href="/dsa-sheets">DSA Sheets</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="text-xs">
          <BreadcrumbLink href={`/dsa-sheets#${carouselCategory[0]}`}>
            {sheetName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="text-xs">
          <BreadcrumbPage>{categoryName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DSABreadCrumb;
