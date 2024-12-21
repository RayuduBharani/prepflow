import { signIn } from '@/auth'
import { Button } from '@/components/ui/button'
import React from 'react'
import Form from 'next/form'
import Sonner from '@/components/Sonner'
import Google from '@/components/icons/Google'
import Github from '@/components/icons/Github'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { LogIn } from 'lucide-react'

const page = () => {
  return (
    <>
    <div className='w-full h-full flex items-center justify-center'>
      <div className='border flex flex-col rounded-md shadow-xl gap-2 p-4'>
        <h1 className='text-xl font-bold'>PrepFlow <span className='text-primary text-xs'>Login</span></h1>
      <Separator className='mb-4' />
      <div className='flex gap-2 w-full justify-between'>
      <Form action={async () => {
        'use server'
        await signIn("google")
      }}>
        <Button className='text-xs' size={'sm'} effect={'expandIcon'} iconPlacement='left' icon={Google} variant={'secondary'} type='submit'>Signin with Google</Button>
      </Form>
      <Form action={async () => {
        'use server'
        await signIn('github')
      }}>
        <Button className='text-xs' size={'sm'} variant={'default'} effect={'expandIcon'} iconPlacement='left' icon={Github} type='submit'>Signin with Github</Button>
      </Form>
      </div>
      </div>
    </div>
    <Sonner />
    </>

  )
}

export default page