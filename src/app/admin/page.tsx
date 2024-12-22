import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import { changeToAdmin } from '../actions/actions';

async function Admin() {
    return (
        <div className='py-[4rem] w-full h-full flex justify-center items-center flex-col'>
            <form action={changeToAdmin} className='min-w-[25%] h-fit flex flex-col gap-3'>
                <Input name='email' className='h-10 bg-muted' type='email' placeholder='Enter user email' />
                <Button size={'sm'}>Change Role</Button>
            </form>
        </div>
    )
}

export default Admin