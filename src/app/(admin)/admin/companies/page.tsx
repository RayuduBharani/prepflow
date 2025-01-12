import React from 'react'
import {prisma} from '@/prisma'
import { DataTable } from './data-table'
import {columns} from './columns'
import { cache } from 'react'
import CheatSheets from './CheatSheets'

const getCompaniesData = cache(async() => {
  return await prisma.problemCompany.findMany()
})

const page = async () => {
  const companiesData = await getCompaniesData()
  return (
    <div className='flex max-sm:flex-col gap-4 pt-[4rem] px-6 max-md:px-4 w-full pb-4'>
      <div>
      <h1 className='text-base text-primary font-semibold'>Company Images</h1>
      <DataTable columns={columns} data={companiesData} />
      </div>
      <div className='w-full'>
        <h1 className='text-base text-primary font-semibold'>Company CheatSheets</h1>
        <CheatSheets />
      </div>
    </div>
  )
}

export default page