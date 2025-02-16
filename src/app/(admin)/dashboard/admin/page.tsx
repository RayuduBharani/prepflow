import React from 'react'
import { prisma } from '@/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminForm from './AdminForm';

async function Admin() {
    const session = await auth()
    if (!session) {
        return redirect('/')
    }
    const usersData = await prisma.user.findMany()
    return (
        <div className='px-6 pt-[5rem] max-sm:px-3 w-full gap-4 h-full overflow-y-auto flex justify-center items-center flex-col'>
            <AdminForm />
            <h1 className='font-bold text-2xl'>Users Data</h1>
            <div className='w-full h-fit flex flex-wrap flex-col gap-3'>
                {usersData.map(user => (
                    <div key={user.id} className='flex justify-between items-center bg-muted p-3 rounded-md'>
                        <p>{user.email}</p>
                        <p className={user.role === 'ADMIN' ? 'text-primary' : "text-muted-foreground"}>{user.role}</p>
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default Admin