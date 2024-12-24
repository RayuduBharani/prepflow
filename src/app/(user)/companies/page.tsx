import { HoverEffect } from '@/components/ui/card-hover-effect'
import React from 'react'

export const projects = [
  {
    title: "Stripe",
    link: "1",
  },
  {
    title: "Netflix",
    link: "2",
  },
  {
    title: "Google",
    link: "3",
  },
  {
    title: "Meta",
    link: "4",
  },
  {
    title: "Amazon",
    link: "5",
  },
  {
    title: "Microsoft",
    link: "6",
  },
];

const CompaniesPage = () => {
  return (
    <div className='w-full h-full pt-[4rem] sm:px-10 overflow-hidden'>
      <h1 className='text-xl font-bold mt-7 text-primary sm:px-2 max-sm:px-4'>Company Wise Questions</h1>
      <p className='text-sm text-neutral-600 dark:text-neutral-400 mt-1 sm:px-2 max-sm:px-4'>A collection of questions asked by various companies in their interviews</p>

      <div className='w-full h-[86%] mt-2 overflow-y-scroll scrollbar-hide'>
          <div className="">
            <HoverEffect items={projects} />
          </div>
      </div>
    </div>
  )
}

export default CompaniesPage