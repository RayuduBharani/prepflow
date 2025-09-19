import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCompanyTopicWiseProblems } from "@/actions/company-actions";
import FiltersPanel from "./FiltersPanel";
import CompaniesBreadcrumb from "@/components/companiesBreadcrumb";
import LoginAlert from "@/components/LoginAlert";
import { Metadata } from "next";
import { metadata as defaultMetadata } from "@/lib/defaultMetadata";
import { toTitleCase } from "@/lib/utils";

type Props = {
  params: Promise<{ company: string; companyTopic: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company, companyTopic } = await params;
  const companyName = toTitleCase(company);
  const topicName = toTitleCase(companyTopic?.[0] || "DSA");
  const platform = toTitleCase(companyTopic?.[1] || "LeetCode");

  return {
    ...defaultMetadata,
    title: `${companyName} ${topicName} Problems | PrepFlow`,
    description: `Master ${topicName} problems asked in ${companyName} interviews. Practice curated ${platform} challenges, track your progress, and ace coding interviews with PrepFlow.`,
    keywords: [
      ...(defaultMetadata.keywords || []),
      `${companyName} ${topicName} interview questions`,
      `${companyName} ${topicName} coding problems`,
      `${companyName} ${topicName} ${platform} questions`,
      `${companyName} ${topicName} prep`,
      "Company-wise DSA questions",
      "PrepFlow coding interview practice",
    ],
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `${companyName} ${topicName} Problems | PrepFlow`,
      description: `Solve ${topicName} questions for ${companyName} from ${platform}. Curated for coding interview prep on PrepFlow.`,
      url: `https://prepflow.vercel.app/companies/${company}/${companyTopic.join("/")}`,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${companyName} ${topicName} Problems - PrepFlow`,
      description: `Sharpen your coding skills with ${topicName} questions from ${companyName}. Practice ${platform} problems now on PrepFlow.`,
    },
    alternates: {
      canonical: `https://prepflow.vercel.app/companies/${company}/${companyTopic.join("/")}`,
    },
  };
}

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
  // console.log(problems);
  if (problems.length == 0) {
    notFound();
  }
  return (
    <div className="pt-20 min-h-screen max-md:px-3 px-6 mx-auto max-w-160">
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
