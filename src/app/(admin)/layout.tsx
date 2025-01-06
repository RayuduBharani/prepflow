import React from 'react'

const AdminLayout = ({children} : {children : React.ReactNode}) => {
  return (
    <main className='py-[4rem] px-6 w-full'>
        {children}
    </main>
  )
}

export default AdminLayout