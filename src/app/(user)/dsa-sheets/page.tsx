import { CircleArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { prisma } from "@/prisma";

const DSAPage = async () => {
    const prismaData = await prisma.problemMainTopic.findMany()
    return (
        <div className="w-full h-full pt-[4rem] sm:px-10 overflow-hidden">
            <h1 className="text-lg font-bold mt-7 text-primary sm:px-2 max-sm:px-4">
                DSA Practice Sheet
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 sm:px-2 max-sm:px-4">
                Explore and solve various DSA problems to enhance your skills.
            </p>
            <div className="w-full max-h-[85%] grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 justify-center p-3 overflow-y-scroll scrollbar-hide">
                {
                    prismaData.length > 0 ? prismaData.map((topic, index) => {
                        return (
                            <div key={index}
                                className="bg-muted w-full h-fit rounded-lg flex p-5 flex-col gap-3">
                                <h1 className="text-lg font-bold">{topic.name.charAt(0).toUpperCase() + topic.name.slice(1).toLowerCase()}</h1>
                                <Progress value={20} />
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        10 out of 20
                                    </p>
                                    <Link href={`dsa-sheets/${topic.name}`}><CircleArrowRight size={20} className="cursor-pointer" /></Link>
                                </div>
                            </div>
                        )
                    }) : <div>
                        No topics
                    </div>
                }
            </div>
        </div>
    );
};

export default DSAPage;
