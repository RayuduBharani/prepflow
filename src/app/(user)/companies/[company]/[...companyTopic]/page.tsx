import { getComapanyProgress, getPlatformQuestions } from '@/actions/company-actions'
import SheetIcon from '@/app/(user)/dsa-sheets/[...carouselCategory]/SheetIcon'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { getDifficultyColor, toSlug, toTitleCase } from '@/lib/utils'
import { CircleCheck, Filter } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { getUserProgress } from '@/actions/actions'
import { auth } from '@/auth'
import UserCheckBox from '@/components/snippets/UserCheckBox'
import Filters from './Filters'


export default async function CompanyTopicQuestions({ params, searchParams }: { params: { company: string, companyTopic: [string, "LEETCODE" | "GFG"] }, searchParams: { difficulty?: string } }) {
  const { company, companyTopic } = await params
  const { difficulty } = await searchParams
  const questions = await getPlatformQuestions(company, companyTopic[0], companyTopic[1], difficulty as "EASY" | "MEDIUM" | "HARD" | "All")
  const session = await auth()
  const progress = await getUserProgress(session?.user.id as string, difficulty as "EASY" | "MEDIUM" | "HARD" | "All") || []
  console.log("progress", progress)
  const persentage = await getComapanyProgress(session?.user.id as string, companyTopic[0], company, companyTopic[1], difficulty as "EASY" | "MEDIUM" | "HARD" | "All")
  console.log("persentage", persentage)
  return (
    <div className="pt-[5rem] w-full h-full max-sm:px-3 px-6 flex flex-col items-center gap-4 shadow-sm overflow-hidden overflow-y-scroll scrollbar-hide">
      <div className='mx-auto w-1/2 max-md:w-3/4 space-y-2 h-fit max-sm:w-full p-4 border rounded-md'>
        <div className="flex gap-2 items-center">
          <SheetIcon />
          <h1 className="text-2xl font-semibold">{toTitleCase(companyTopic[0])}</h1>
        </div>
        <div className="flex items-center w-full">
          <CircleCheck size={20} strokeWidth={1} className="mr-1" />
          <p className="text-xs text-nowrap mr-4">
            {persentage} solved
          </p>
          <Progress
            value={questions.length > 0 && questions[0].problems.length > 0 ? (persentage / questions[0].problems.length) * 100 : 0}
          />
        </div>
      </div>
      <div className='mx-auto w-1/2 max-md:w-3/4 max-sm:w-full border p-4 rounded-md'>
        <div className='flex items-center gap-2 mb-4'>
          <Filter size={18} />
          <h3 className='font-medium'>Filters</h3>
        </div>
        <Filters />
      </div>

      {
        questions[0].problems.map((problem, index) => {
          return (
            <div key={index} className='mx-auto w-1/2 max-md:w-3/4 max-sm:w-full border p-4 rounded-md flex justify-between'>
              <div className='flex  items-center truncate'>
                {
                  session == null ? <Checkbox /> : <UserCheckBox session={session} question={problem} info={progress} path='companies/microsoft/dynamic-programming/LEETCODE' />
                }
                <Link href={problem.url} target='_blank'><p className='hover:underline text-sm mx-10 font-medium truncate'>{problem.title}</p></Link>
              </div>
              <p className={`${getDifficultyColor(problem.difficulty)} text-xs`}>{problem.difficulty}</p>
            </div>
          )
        })
      }
    </div>
  )
}
