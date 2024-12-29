import { Button } from "@/components/ui/button";
import { prisma } from "@/prisma";
import Link from "next/link";

async function SheetQuestions({ params }: { params: { typeSlug: string } }) {
    const { typeSlug } = await params
    const prismaData = await prisma.problem.findMany({
        where: {
            mainTopics: {
                some: {
                    name: typeSlug
                }
            }
        },
        include : {
            companyTags : true ,
            mainTopics : true ,
        }
    })
    console.log(prismaData)
    return (
        <div className="w-full h-full pt-[4rem] sm:px-10 overflow-hidden bg-background text-foreground">
            <h1 className="text-lg font-bold mt-7 text-primary sm:px-2 max-sm:px-4">
                Practice questions
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 sm:px-2 max-sm:px-4">
                Challenge Yourself with These Questions
            </p>
            {
                prismaData.length > 0 ? <div className="w-full max-h-[85%] mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-0 overflow-y-scroll scrollbar-hide">
                {
                    prismaData.map((question, index) => {
                        return (
                            <div key={index} className="w-full bg-muted rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                <div className="p-5 flex flex-col gap-4 flex-grow">
                                    <h2 className="text-lg font-semibold text-foreground line-clamp-2">
                                        {question.title}
                                    </h2>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-primary">{question.difficulty}</span>
                                        <span className="text-muted-foreground">
                                            Acceptance: <span className="font-medium">{question.acceptanceRate}%</span>
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        <span className="font-semibold">Topics:</span> Array, Strings
                                    </p>
                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground">Companies</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {question.companyTags.map((company, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-background font-semibold text-[0.7rem] px-3 py-1.5 rounded-md shadow-sm border border-muted text-primary"
                                                >
                                                    {company.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <Button size={"sm"} className="m-5 mt-auto" asChild>
                                    <Link href={question.url} target="_blank">Visit</Link>
                                </Button>
                            </div>
                        )
                    })
                }
            </div> : 
            <div className="w-full h-[85%] flex justify-center items-center">
                <p className="font-bold text-primary animate-pulse">
                    data not found
                </p>
            </div>
            }
        </div>
    );
}
export default SheetQuestions