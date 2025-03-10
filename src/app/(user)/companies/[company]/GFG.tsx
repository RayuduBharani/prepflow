import { GFGcompanyTopics, getCompanyTopicProgress } from "@/actions/company-actions"
import { auth } from "@/auth"
import { Progress } from "@/components/ui/progress"
import { toTitleCase } from "@/lib/utils"
import { ChevronsRight } from "lucide-react"
import Link from "next/link"

export default async function GFGQuestions({ company }: { company: string }) {
  const data = await GFGcompanyTopics(company)
  const session = await auth()
  const progress = session?.user ? await getCompanyTopicProgress(session.user.id, company, "GFG") : null;
  return (
    <div className="flex flex-wrap gap-4">
      {data.length > 0 ? data.map((topic, index) => {
        const topicProgress = progress?.filter(p =>
          topic.problems.some(prob => prob.id === p.problemId)
        )?.length ?? 0;

        const progressPercentage = topic._count.problems > 0 ?
          (topicProgress / topic._count.problems) * 100 : 0;

        return (
          <div key={index} className="min-w-[13rem] cursor-pointer border 
                rounded-lg p-4 transition-all duration-300 bg-background hover:bg-muted flex-1 shadow-md intersect:motion-preset-slide-up motion-delay-0"
            style={{ animationDelay: `${index * 100}ms` }}>
            <Link href={`/companies/${company}/${topic.slug}/GFG`}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm">{toTitleCase(topic.slug)}</h2>
                </div>

                <Progress value={progressPercentage} className="my-2" />

                <div className="flex justify-between items-center text-xs">
                  <span>{topicProgress} / {topic._count.problems} solved</span>
                  <ChevronsRight className="w-5 h-5 text-primary" />
                </div>
              </div>
            </Link>
          </div>
        )
      }) :
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-lg mt-10 motion-translate-y-loop-25 text-primary">Not found</p>
        </div>}
    </div>
  )
}
