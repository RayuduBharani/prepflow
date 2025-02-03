import Link from 'next/link'
import { Button } from '../ui/button'
import UserCheckBox from './UserCheckBox';
import { auth } from '@/auth';
import type { Session } from "next-auth";
import { Checkbox } from '../ui/checkbox';
import { getUserProgress } from '@/actions/actions';

async function QuestionCards({ prismaData }: IPrismaDsaSheetData) {
    const session: Session | null = await auth()
    const info: Iinfo[] = session?.user?.id ? await getUserProgress(session.user.id) : []
    return (
        <div className="w-full mt-5 h-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-0 overflow-hidden">
            {prismaData.map((question, index) => (
                <div key={index} className="w-full p-4 bg-secondary rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
                    <div className="flex flex-col gap-4 flex-grow">
                        <div className="flex items-center gap-3">
                            {
                                session == null ? <Checkbox /> : <UserCheckBox session={session} question={question} info={info} />
                            }
                            <h2 className="text-lg text-primary font-semibold line-clamp-2">
                                {question.title}
                            </h2>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className={`text-xs font-semibold ${question.difficulty === "EASY"
                                ? "text-green-700"
                                : question.difficulty === "MEDIUM"
                                    ? "text-yellow-500"
                                    : question.difficulty === "HARD"
                                        ? "text-red-500"
                                        : ""
                                }`}>{question.difficulty}</span>
                            <span className="">
                                Acceptance:{" "}
                                <span className="font-medium">
                                    {question.acceptanceRate}%
                                </span>
                            </span>
                        </div>
                        <p className="text-sm  line-clamp-2 text-muted-foreground">
                            <span className="font-semibold">Topics : </span>{" "}
                            {question.mainTopics.map((topic) => topic.name).join(", ")}
                        </p>
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold text-muted-foreground">
                                Companies
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {question.companyTags.map((company, index) => (
                                    <span key={index} className="bg-background font-semibold text-[0.8rem] px-3 py-1.5 rounded-md shadow-sm border border-muted text-primary">
                                        {company.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Button size="sm" className="mt-3" variant="default" asChild>
                        <Link href={question.url} target="_blank">
                            Visit
                        </Link>
                    </Button>
                </div>
            ))}
        </div>
    )
}
export default QuestionCards;