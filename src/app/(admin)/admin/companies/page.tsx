import React from 'react'
import {prisma} from '@/prisma'
import { DataTable } from './data-table'
import {columns} from './columns'
import { cache } from 'react'

const getCompaniesData = cache(async() => {
  return await prisma.problemCompany.findMany()
})

const page = async () => {
  const companiesData = await getCompaniesData()
  return (
    <div className='flex flex-col pt-[4rem] px-6 max-md:px-4 w-full h-full'>
        <h1 className='text-base flex text-primary font-semibold'>Company Images</h1>
        <DataTable columns={columns} data={companiesData} />
    </div>
  )
}

export default page