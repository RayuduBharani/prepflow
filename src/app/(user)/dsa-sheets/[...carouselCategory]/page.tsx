import { getCarouselCategoryData } from "@/actions/actions";
import { notFound, redirect } from "next/navigation";
import DSABreadCrumb from "./DSABreadCrumb";
import { auth } from "@/auth";
import { Progress } from "@/components/ui/progress";
import SheetIcon from "@/components/SheetIcon";
import { CircleCheck } from "lucide-react";
import HoverProblem from "@/components/HoverProblem";
import type { Metadata } from "next";
import { toTitleCase } from "@/lib/utils";
import LoginAlert from "@/components/LoginAlert";

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
  const userId = (await auth())?.user.id;
  const data = await getCarouselCategoryData(
    carouselCategory[0],
    carouselCategory[1],
    userId
  );
  if (!data) {
    notFound();
  }
  return (
      <div className="pt-[5rem] max-sm:px-3 px-6 max-w-2xl mx-auto w-full">
        <LoginAlert userId={userId} />
        <DSABreadCrumb
          carouselCategory={carouselCategory}
          sheetName={data.sheet.name}
          categoryName={data.name}
        />
        <div className="border flex flex-col gap-2 mt-2 rounded-md p-4">
          <div className="flex gap-2 items-center">
            <SheetIcon />
            <h1 className="text-2xl font-semibold">{data.name}</h1>
          </div>
          <div className="flex items-center w-full">
            <CircleCheck size={20} strokeWidth={1} className="mr-1" />
            <p className="text-xs text-nowrap mr-4">
              {`${userId != undefined ? data.solvedProblemsCount : 0}/${data.totalProblemsCount}`} solved 
            </p>
            <Progress
              className=""
              value={userId != undefined ?(data.solvedProblemsCount / data.totalProblemsCount) * 100 : 0}
            />
          </div>
        </div>
        <HoverProblem userId={userId} problems={data.problems} />
      </div>
  );
};

export default CarouselCategoryPage;
