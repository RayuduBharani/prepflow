import { companyTopics, getCompanyTopicProgress } from '@/actions/company-actions'
import { auth } from '@/auth'
import { Progress } from '@/components/ui/progress'
import { toTitleCase } from '@/lib/utils'
import { ChevronsRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

async function LeetcodeQuestions({ company }: { company: string }) {
  const [data, session] = await Promise.all([companyTopics(company), auth()])
  const progress = session?.user 
    ? await getCompanyTopicProgress(session.user.id, company, "LEETCODE") 
    : []

  if (!data.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="mt-10 text-lg text-primary motion-translate-y-loop-25">Not found</p>
      </div>
    )
  }

  const cardStyles = {
    container: "min-w-[13rem] cursor-pointer border rounded-lg p-4 transition-all duration-300 bg-background hover:bg-muted flex-1 shadow-md intersect:motion-preset-slide-up motion-delay-0",
    progress: "my-2",
    icon: "w-5 h-5 text-primary",
    text: "text-sm",
    subtext: "text-xs"
  }

  return (
    <div className="flex flex-wrap gap-4">
      {data.map((topic, index) => {
        const topicProgress = progress.filter(p => 
          topic.problems.some(prob => prob.id === p.problemId)
        ).length
        const progressPercentage = topic._count.problems 
          ? (topicProgress / topic._count.problems) * 100 
          : 0

        return (
          <div 
            key={topic.slug} 
            className={cardStyles.container}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Link href={`/companies/${company}/${topic.slug}/LEETCODE`}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h2 className={cardStyles.text}>{toTitleCase(topic.slug)}</h2>
                </div>
                <Progress value={progressPercentage} className={cardStyles.progress} />
                <div className="flex items-center justify-between">
                  <span className={cardStyles.subtext}>
                    {topicProgress} / {topic._count.problems} solved
                  </span>
                  <ChevronsRight className={cardStyles.icon} />
                </div>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default LeetcodeQuestions