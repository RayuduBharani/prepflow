import React from 'react'

const AdminLayout = ({children} : {children : React.ReactNode}) => {
  return (
    <main className='py-[4rem]'>
        {children}
    </main>
  )
}

export default AdminLayout