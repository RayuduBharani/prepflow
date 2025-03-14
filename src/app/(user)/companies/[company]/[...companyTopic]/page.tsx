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
      0,
      10,
      userId
    );
  // console.log(problems);
  if (problems.length == 0) {
    notFound();
  }
  return (
    <div className="pt-[5rem] min-h-screen max-md:px-3 px-6 mx-auto max-w-[40rem]">
      <LoginAlert userId={userId} />
      <CompaniesBreadcrumb companyName={company} topic={companyTopic[0]} />
        <FiltersPanel
          difficultyCount={difficultyCount}
          companyTopic={companyTopic[0]}
          problems={problems}
          userId={userId}
          solvedProblems={solvedProblems}
          totalProblems={totalProblems}
          company={company}
          platform={companyTopic[1] as Platform}
        />
    </div>
  );
};

export default CarouselCategoryPage;
