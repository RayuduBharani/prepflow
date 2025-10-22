import { BackgroundLines } from '@/components/ui/background-lines'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import type { Metadata } from 'next'
import { metadata as defaultMetadata } from '@/lib/defaultMetadata'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'PrepFlow - Master Tech Interviews | DSA, System Design & Coding Practice',
  description: 'Ace your FAANG and tech interviews with PrepFlow. Practice DSA problems, learn system design, use our online compiler, check your resume with ATS, and prepare like a pro. Your path to landing your dream job starts here.',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'PrepFlow - Your Complete Interview Preparation Platform',
    description: 'Master data structures, algorithms, system design, and ace technical interviews at top tech companies.',
  },
}

const page = async () => {
  return (
    <main>
      <BackgroundLines 
        svgOptions={{ duration: 2 }} 
        className="flex isolate items-center justify-center w-full flex-col px-4 max-sm:h-full sm:h-full"
      >
        <h1 className="bg-clip-text text-transparent text-center bg-linear-to-b from-neutral-900
         to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl max-sm:text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
         font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md">
          Shape Your Future, <br /> Achieve Your Dreams
        </h1>
        <p className="max-w-xl mx-auto text-sm sm:text-lg md:text-lg text-neutral-700 dark:text-neutral-400 text-center motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md">
          A Journey of Growth - Providing You with Tools, Resources,
          and Roadmaps to Shape Your Career Excellence.
        </p>
        <Button asChild className='mt-5 cursor-pointer z-50 sm:hidden motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md'>
          <Link href="/dsa-sheets">Get Started Free</Link>
        </Button>
      </BackgroundLines>
    </main>
  )
}

export default page