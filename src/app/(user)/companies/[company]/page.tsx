import { getCompanyImg } from "@/actions/company-actions";
import { Progress } from "@/components/ui/progress";
import { Building2 } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Leetcode from "@/components/icons/Leetcode";
import GFGIcon from "@/components/icons/GFG";
import LeetcodeQuestions from "./Leetcode";
import GFGQuestions from "./GFG";
import { getUserProgressQuuestions } from "@/actions/actions";
import { auth } from "@/auth";
import { toTitleCase } from "@/lib/utils";

async function CompanyPage({
  params,
}: {
  params: { company: string };
  searchParams: { difficulty?: string };
}) {
  const { company } = await params;

  const Img = await getCompanyImg(company);
  const session = await auth();
  const userProgress = await getUserProgressQuuestions(
    session?.user.id as string,
    company
  );
  return (
    <Tabs
      defaultValue="LEETCODE"
      className="w-full h-full pt-[5rem] mx-auto max-w-[50rem] pb-2 max-sm:px-2 sm:px-5 overflow-hidden overflow-y-scroll scrollbar-hide"
    >
      <div className="flex max-sm:flex-col items-center border p-4 rounded-lg mb-8 gap-4 justify-between">
        <div className="w-full flex items-center gap-4">
          <div className="w-[4rem] relative h-[4rem]">
            {Img && Img.image != "None" ? (
              <Image
                src={Img.image != null ? Img.image : ""}
                alt="Company Logo"
                fill
                className="object-contain rounded-md"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg border flex items-center justify-center bg-muted">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 max-w-[60%] max-sm:max-w-full">
            <h1 className="text-md font-bold mb-2">
              Practice Problems for {toTitleCase(company)}
            </h1>
            <div className="space-y-2">
              {Img?._count.problems ? (
                <Progress
                  value={(userProgress.length / Img?._count.problems) * 100}
                />
              ) : (
                <Progress value={0} />
              )}
              <p className="text-sm text-muted-foreground">
                Overall Progress: {userProgress.length}/ {Img?._count.problems}{" "}
                questions solved
              </p>
            </div>
          </div>
        </div>
        <TabsList className="max-sm:w-full">
          <TabsTrigger value="LEETCODE">
            <Leetcode />
          </TabsTrigger>
          <TabsTrigger value="GFG">
            <GFGIcon />
          </TabsTrigger>
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
