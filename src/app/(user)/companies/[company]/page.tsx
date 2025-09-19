import { getCompanyImg } from "@/actions/company-actions";
import { getUserProgressQuuestions } from "@/actions/actions";
import { auth } from "@/auth";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2 } from "lucide-react";
import Image from "next/image";
import { toTitleCase } from "@/lib/utils";
import type { Metadata } from "next";
import CompaniesBreadcrumb from "@/components/companiesBreadcrumb";
import Leetcode from "@/components/icons/Leetcode";
import GFGIcon from "@/components/icons/GFG";
import ProblemsTab from "./ProblemsTab";
import {metadata as defaultMetadata} from '@/lib/defaultMetadata'

type Props = {
  params: Promise<{ company: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company } = await params;
  const companyName = toTitleCase(company);

  return {
    ...defaultMetadata,
    title: `${companyName} Problems | PrepFlow`,
    description: `Practice and track your progress on ${companyName} coding interview problems. Solve questions from LeetCode and GeeksforGeeks curated for top tech companies.`,
    keywords: [
      ...(defaultMetadata.keywords || []),
      `${companyName} interview questions`,
      `${companyName} DSA problems`,
      `${companyName} coding challenges`,
      "LeetCode company-wise problems",
      "GFG company-wise problems",
      "PrepFlow DSA sheets",
    ],
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `${companyName} Problems | PrepFlow`,
      description: `Sharpen your coding skills with ${companyName} interview preparation problems. Curated DSA practice questions with progress tracking.`,
      url: `https://prepflow.vercel.app/companies/${company}`,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${companyName} Problems - PrepFlow`,
      description: `Solve ${companyName} coding interview questions on PrepFlow. Get curated problems from LeetCode & GFG.`,
    },
    alternates: {
      canonical: `https://prepflow.vercel.app/companies/${company}`,
    },
  };
}

async function CompanyPage({ params }: { 
  params: Promise<{ company: string }>; 
  searchParams: Promise<{ difficulty?: string }>;
}) {
  const { company } = await params;
  const [imgData, session] = await Promise.all([
    getCompanyImg(company),
    auth()
  ]);
  const userProgress = await getUserProgressQuuestions(
    session?.user?.id ?? "",
    company
  );

  const styles = {
    container: "w-full pt-20 mx-auto max-w-200 pb-2 max-sm:px-2 sm:px-5",
    card: "flex max-sm:flex-col items-center border p-4 rounded-lg mb-3 gap-4 justify-between",
    logo: "w-16 relative h-16",
    placeholder: "h-12 w-12 rounded-lg border flex items-center justify-center bg-muted",
    title: "text-md font-bold mb-2",
    text: "text-xs text-muted-foreground"
  };

  const progressPercentage = imgData?._count.problems 
    ? (userProgress.length / imgData._count.problems) * 100 
    : 0;

  return (
    <Tabs defaultValue="LEETCODE" className={styles.container}>
      <CompaniesBreadcrumb companyName={company} />
      <div className={styles.card}>
        <div className="w-full flex items-center gap-4 ">
          <div className={`${styles.logo} rounded-md dark:bg-foreground`}>
            {imgData?.image && imgData.image !== "None" ? (
              <Image
                src={imgData.image}
                alt="Company Logo"
                fill
                className="object-contain rounded-md "
              />
            ) : (
              <div className={styles.placeholder}>
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 max-w-[60%] max-sm:max-w-full">
            <h1 className={styles.title}>{toTitleCase(company)}</h1>
            <div className="space-y-2">
              <Progress value={progressPercentage} />
              <p className={styles.text}>
                Overall Progress: {userProgress.length}/{imgData?._count.problems || 0} questions solved
              </p>
            </div>
          </div>
        </div>
        <TabsList className="max-sm:w-full">
          <TabsTrigger value="LEETCODE"><Leetcode /></TabsTrigger>
          <TabsTrigger value="GFG"><GFGIcon /></TabsTrigger>
        </TabsList>
      </div>

      <TabsContent className="pb-8" value="LEETCODE">
        {/* <LeetcodeQuestions company={company} /> */}
        <ProblemsTab company={company} platform='LEETCODE' session={session} />
      </TabsContent>
      <TabsContent className="pb-8" value="GFG">
      <ProblemsTab company={company} platform='GFG' session={session} />
      </TabsContent>
    </Tabs>
  );
}

export default CompanyPage;