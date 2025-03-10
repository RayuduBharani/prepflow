import { BackgroundLines } from '@/components/ui/background-lines'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = async () => {
  return (
    <BackgroundLines svgOptions={{ duration: 2 }} className="flex isolate items-center justify-center w-full flex-col px-4 max-sm:h-full sm:h-full">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900
       to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl max-sm:text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
       font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md">
        Shape Your Future, <br /> Achieve Your Dreams
      </h2>
      <p className="max-w-xl mx-auto text-sm sm:text-lg md:text-lg text-neutral-700 dark:text-neutral-400 text-center motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md">
        A Journey of Growth – Providing You with Tools, Resources,
        and Roadmaps to Shape Your Career Excellence .
      </p>
      <Button className='mt-5 cursor-pointer z-50 sm:hidden motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md'><Link href="/dsa-sheets">Get started</Link></Button>
    </BackgroundLines>
  )
}

export default page