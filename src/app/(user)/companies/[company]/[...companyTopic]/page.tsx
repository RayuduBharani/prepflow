import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCompanyTopicWiseProblems } from "@/actions/company-actions";
import FiltersPanel from "./FiltersPanel";
import CompaniesBreadcrumb from "@/components/companiesBreadcrumb";
import LoginAlert from "@/components/LoginAlert";

const CarouselCategoryPage = async ({
  params,
}: {
  params: Promise<{ company: string; companyTopic: string[] }>;
}) => {
  const { company, companyTopic } = await params;
  if (!companyTopic) {
    return redirect("/companies");
  }
  const userId = (await auth())?.user.id;
  const { totalProblems, solvedProblems, problems, difficultyCount } =
    await getCompanyTopicWiseProblems(
      company,
      companyTopic[0],
      companyTopic[1] as Platform,
      userId
    );
  if (problems.length == 0) {
    notFound();
  }
  return (
    <div className="pt-[5rem] max-sm:px-3 px-6 mx-auto max-w-[40rem]">
      <LoginAlert />
      <CompaniesBreadcrumb companyName={company} topic={companyTopic[0]} />
      <div className="mx-auto max-sm:w-full max-w-[40rem]">
        <FiltersPanel
          difficultyCount={difficultyCount}
          companyTopic={companyTopic[0]}
          problems={problems}
          userId={userId}
          solvedProblems={solvedProblems}
          totalProblems={totalProblems}
        />
      </div>
    </div>
  );
};

export default CarouselCategoryPage;
