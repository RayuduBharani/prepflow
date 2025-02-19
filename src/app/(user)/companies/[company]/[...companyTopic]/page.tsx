import { getPlatformQuestions } from '@/actions/company-actions'
import SheetIcon from '@/app/(user)/dsa-sheets/[...carouselCategory]/SheetIcon'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { getDifficultyColor } from '@/lib/utils'
import { CircleCheck, Filter } from 'lucide-react'
import React from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


export default async function CompanyTopicQuestions({ params }: { params: { company: string, companyTopic: [string, "LEETCODE" | "GFG"] } }) {
  const { company, companyTopic } = await params
  const questions = await getPlatformQuestions(company, companyTopic[0], companyTopic[1])
  // console.log(questions[0].problems)
  return (
    <div className="pt-[5rem] w-full h-full max-sm:px-3 px-6 flex flex-col items-center gap-4 shadow-sm overflow-hidden overflow-y-scroll scrollbar-hide">
      <div className='mx-auto w-1/2 max-md:w-3/4 space-y-2 h-fit max-sm:w-full p-4 border rounded-md'>
        <div className="flex gap-2 items-center">
          <SheetIcon />
          <h1 className="text-2xl font-semibold">Array</h1>
        </div>
        <div className="flex items-center w-full">
          <CircleCheck size={20} strokeWidth={1} className="mr-1" />
          <p className="text-xs text-nowrap mr-4">
            10 solved
          </p>
          <Progress
            className=""
            value={10}
          />
        </div>
      </div>
      <div className='mx-auto w-1/2 max-md:w-3/4 max-sm:w-full border p-4 rounded-md'>
        <div className='flex items-center gap-2 mb-4'>
          <Filter size={18} />
          <h3 className='font-medium'>Filters</h3>
        </div>
          <RadioGroup defaultValue="All" className='flex flex-wrap gap-6'>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="All" id="All" />
              <Label htmlFor="All">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Easy" id="Easy" />
              <Label htmlFor="Easy" className='text-green-500'>Easy</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Medium" id="Medium" />
              <Label htmlFor="Medium" className='text-orange-400'>Medium</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Hard" id="Hard" />
              <Label htmlFor="Hard" className='text-red-500'>Hard</Label>
            </div>
          </RadioGroup>
      </div>

      {
        questions[0].problems.map((problem, index) => {
          return (
            <div key={index} className='mx-auto w-1/2 max-md:w-3/4 max-sm:w-full border p-4 rounded-md flex justify-between'>
              <div className='flex  items-center truncate'>
                <Checkbox className='justify-start' />
                <p className='text-sm mx-10 font-medium truncate'>{problem.title}</p>
              </div>
              <p className={`${getDifficultyColor(problem.difficulty)} text-xs`}>{problem.difficulty}</p>
            </div>
          )
        })
      }
    </div>
  )
}
