import React from 'react'
import {prisma} from '@/prisma'
import { DataTable } from './data-table'
import {columns} from './columns'
import Form from 'next/form'
import { cache } from 'react'
import { Input } from '@/components/ui/input'
import { changeCompanyImage } from '@/app/actions/actions'
import { Button } from '@/components/ui/button'

const getCompaniesData = cache(async() => {
  return await prisma.problemCompany.findMany()
})

const page = async () => {
  const companiesData = await getCompaniesData()
  return (
    <div className='grid sm:grid-flow-col px-12 w-full gap-4 h-full'>
      <div className=''>
        <h1 className='text-primary text-base font-semibold'>Update Company Image</h1>
        <Form className='flex flex-col gap-3' action={changeCompanyImage}>
          <Input name='imageUrl' placeholder='Enter the image URL' minLength={8} />
          <Button variant={'outline'}>Update</Button>
        </Form>
      </div>
      <div className='flex flex-col gap-2'>
        <h1 className='text-base flex text-primary font-semibold'>Company Images</h1>
        <DataTable columns={columns} data={companiesData} />
      </div>
    </div>
  )
}

export default page