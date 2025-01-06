import React from 'react'

const AdminLayout = ({children} : {children : React.ReactNode}) => {
  return (
    <main className='w-full h-svh overflow-hidden'>
        {children}
    </main>
  )
}

export default AdminLayout