import { signIn } from '@/auth'
import { Button } from '@/components/ui/button'
import React from 'react'
import Form from 'next/form'

const page = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <Form action={async () => {
        'use server'
        await signIn("google")
      }}>
        <Button type='submit'>Signin with Google</Button>
      </Form>
    </div>
  )
}

export default page