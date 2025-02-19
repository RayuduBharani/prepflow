import { companyTopics, getCompanyImg } from "@/actions/company-actions";
import { Progress } from "@/components/ui/progress";
import { toTitleCase } from "@/lib/utils";
import { Building2, ChevronsRight } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Leetcode from "@/components/icons/Leetcode";
import GFGIcon from "@/components/icons/GFG";
import LeetcodeQuestions from "./Leetcode";
import GFGQuestions from "./GFG";


async function CompanyPage({ params }: { params: { company: string } }) {
    const { company } = await params;
    const Img = await getCompanyImg(company);
    return (
        <Tabs defaultValue="LEETCODE" className="w-full h-full pt-[5rem] pb-2 max-sm:px-2 sm:px-5 overflow-hidden overflow-y-scroll scrollbar-hide">
            <div className="flex items-center gap-4 mb-8 justify-between max-sm:flex-col">
                <div className="w-full flex items-center gap-4">
                    <div className="w-[4rem] h-[4rem] relative">
                        {Img && Img.image != "None" ? <Image
                            src={Img.image != null ? Img.image : ""}
                            alt="Company Logo"
                            fill
                            className="object-contain"
                        /> :
                            <div className="h-12 w-12 rounded-lg border flex items-center justify-center bg-muted">
                                <Building2 className="h-6 w-6 text-muted-foreground" />
                            </div>}
                    </div>
                    <div className="flex-1 max-w-[60%] max-sm:max-w-full">
                        <h1 className="text-md font-bold mb-2">
                            {company} Practice Topics
                        </h1>
                        <div className="space-y-2">
                            <Progress value={33} />
                            <p className="text-sm text-muted-foreground">Overall Progress: 24/ {Img?._count.problems} questions solved</p>
                        </div>
                    </div>
                </div>
                <TabsList className="w-[15%] max-md:w-[40%] max-sm:w-full max-sm:mt-2">
                    <TabsTrigger value="LEETCODE">
                        <Leetcode />
                    </TabsTrigger>
                    <TabsTrigger value="GFG">
                        <GFGIcon />
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="LEETCODE">

                <LeetcodeQuestions company={company} />
            </TabsContent>
            <TabsContent value="GFG">

                <GFGQuestions company={company} />
            </TabsContent>
        </Tabs>
    );
}

export default CompanyPage;