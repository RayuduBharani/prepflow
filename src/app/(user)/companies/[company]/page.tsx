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
import LeetcodeQuestions from "./Leetcode";
import GFGQuestions from "./GFG";

type Props = {
  params: Promise<{ company: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company } = await params;
  return { title: `PrepFlow - ${toTitleCase(company)} Problems` };
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
    container: "w-full pt-[5rem] mx-auto max-w-[50rem] pb-2 max-sm:px-2 sm:px-5",
    card: "flex max-sm:flex-col items-center border p-4 rounded-lg mb-3 gap-4 justify-between",
    logo: "w-[4rem] relative h-[4rem]",
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
        <LeetcodeQuestions company={company} />
      </TabsContent>
      <TabsContent className="pb-8" value="GFG">
        <GFGQuestions company={company} />
      </TabsContent>
    </Tabs>
  );
}

export default CompanyPage;