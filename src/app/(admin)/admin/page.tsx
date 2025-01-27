import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import { changeToAdmin } from '@/app/actions/actions';
import { dropTables, seedData } from '@/app/actions/seedAction';
import { prisma } from '@/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

async function Admin() {
    const session = await auth()
    if (!session) {
        return redirect('/')
    }
    const usersData = await prisma.user.findMany()
    return (
        <div className='py-[4rem] px-6 w-full gap-4 h-full flex justify-center items-center flex-col'>
            <h1 className='text-2xl font-bold'>Admin Page</h1>
            <div className='w-full h-fit flex flex-wrap flex-col gap-3'>
                {usersData.map(user => (
                    <div key={user.id} className='flex justify-between items-center bg-muted p-3 rounded-md'>
                        <p>{user.email}</p>
                        <p className={user.role === 'ADMIN' ? 'text-primary' : "text-muted-foreground"}>{user.role}</p>
                    </div>
                ))}
            </div>
            <form action={changeToAdmin} className='min-w-[25%] h-fit flex flex-col gap-3'>
                <Input name='email' className='h-10 bg-muted' type='email' placeholder='Enter user email' />
                <Button size={'sm'}>Change Role</Button>
            </form>
            <form action={seedData}>
                <Button type='submit' variant={'outline'}>Seed Data</Button>
            </form>
            <form action={dropTables}>
                <Button variant={'destructive'} type='submit'>Drop Tables</Button>
            </form>
        </div>
    )
}

export default Admin