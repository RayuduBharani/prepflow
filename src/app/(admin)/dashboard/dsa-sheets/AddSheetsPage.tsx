'use client'
import React from 'react'
import CarouselForm from '@/components/DSA/CarouselForm'
import Form from 'next/form'
import { seedDSASheets } from '@/actions/seedAction'
import { extractData } from '@/actions/extractData'
import { Button } from '@/components/ui/button'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const AddSheetsPage = () => {
  const client = new QueryClient()
  return (
    <QueryClientProvider client={client}>
    <CarouselForm />
          <div className="flex justify-between">
          <Form action={seedDSASheets}>
            <Button size={'sm'} className="text-xs" type="submit">Seed Data</Button>
          </Form>
          <Form action={extractData}>
            <Button size={'sm'} className="text-xs" type="submit">Extract Data</Button>
          </Form>
          </div>
    </QueryClientProvider>
  )
}

export default AddSheetsPage