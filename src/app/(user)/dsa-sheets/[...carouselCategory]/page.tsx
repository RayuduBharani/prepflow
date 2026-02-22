import { getCarouselCategoryData } from "@/actions/actions";
import { notFound, redirect } from "next/navigation";
import DSABreadCrumb from "./DSABreadCrumb";
import type { Metadata } from "next";
import { toTitleCase } from "@/lib/utils";
import LoginAlert from "@/components/LoginAlert";
import { getSession } from "@/auth-client";
import FiltersPanelWrapper from "@/app/(user)/companies/[company]/[...companyTopic]/FiltersPanelWrapper";

type Props = {
  params: Promise<{ carouselCategory: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { carouselCategory } = await params;
  return {
    title: `${toTitleCase(carouselCategory[1])} - ${toTitleCase(
      carouselCategory[0]
    )}`,
  };
}

const CarouselCategoryPage = async ({
  params,
}: {
  params: Promise<{ carouselCategory: string[] }>;
}) => {
  const { carouselCategory } = await params;
  if (carouselCategory.length !== 2) {
    return redirect("/dsa-sheets");
  }
  const userId = (await getSession())?.userId;
  const data = await getCarouselCategoryData(
    carouselCategory[0],
    carouselCategory[1],
    userId
  );
  if (!data) {
    notFound();
  }

  const solvedCount = userId ? data.solvedProblemsCount : 0;

  // Compute difficulty breakdown for the FiltersPanel
  const difficultyCount = data.problems.reduce(
    (acc, p) => {
      const key = p.difficulty as string;
      if (!acc[key]) acc[key] = { solved: 0, unsolved: 0 };
      if (p.UserProgress?.isCompleted) acc[key].solved++;
      else acc[key].unsolved++;
      return acc;
    },
    {} as Record<string, { solved: number; unsolved: number }>
  );

  return (
    <div className="pt-20 max-sm:px-3 min-h-screen px-6 max-w-2xl mx-auto w-full">
      <LoginAlert userId={userId} />

      <DSABreadCrumb
        carouselCategory={carouselCategory}
        sheetName={data.sheet.name}
        categoryName={data.name}
      />

      <FiltersPanelWrapper
        companyTopic={data.name}
        problems={data.problems as Problem[]}
        userId={userId}
        solvedProblems={solvedCount}
        totalProblems={data.totalProblemsCount}
        difficultyCount={difficultyCount}
      />
    </div>
  );
};

export default CarouselCategoryPage;

