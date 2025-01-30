import { getCarouselCategoryData } from "@/app/actions/actions";
import { notFound, redirect } from "next/navigation";
import DSABreadCrumb from "./DSABreadCrumb";
import { auth } from "@/auth";
import { Progress } from "@/components/ui/progress";

const CarouselCategoryPage = async ({
  params,
}: {
  params: Promise<{ carouselCategory: string[] }>;
}) => {
  const { carouselCategory } = await params;
  if (carouselCategory.length !== 2) {
    return redirect('/dsa-sheets')
  }
  const userId = (await auth())?.user.id
  const data = await getCarouselCategoryData(carouselCategory[0], carouselCategory[1], userId)
  if (!data) {
    notFound()
  }
  return (
    <div className="pt-[5rem] max-sm:px-3 px-6">
      <div className="mx-auto w-1/2 max-sm:w-full">
      <DSABreadCrumb carouselCategory={carouselCategory} sheetName={data.sheet.name} categoryName={data.name} />
      <div className="border flex flex-col gap-2 mt-2 rounded-md">
        <h1 className="text-2xl font-semibold">{data.name}
        </h1>
        <div className="flex">
        <p className="text-sm">{`${data.solvedProblemsCount}/${data.totalProblemsCount} solved`}</p>
          <Progress value={(data.solvedProblemsCount/data.totalProblemsCount)*100} />
        </div>
      </div>
      </div>
    </div>
  );
};

export default CarouselCategoryPage;
