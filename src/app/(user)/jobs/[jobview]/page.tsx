import React from 'react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Params } from 'next/dist/server/request/params'
import Link from 'next/link'
import ShareButton from '@/components/snippets/ShareButton'
import { getSingleJob } from '@/actions/job-actions'
import Image from 'next/image'

export default async function JobView({ params }: { params: Params }) {
  const { jobview } = await params
  const jobData = await getSingleJob(jobview as string)
  return (
    <div className='w-full h-full overflow-hidden pt-[4rem] sm:px-10'>
      <div className='w-full h-full px-4 py-6 overflow-y-auto scrollbar-hide'>
        {/* Header Section */}
        <div className="space-y-4 md:space-y-6 motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-lg text-primary sm:text-xl font-bold">{jobData?.title}</h1>
              <p className="text-sm sm:text-base text-foreground font-medium">{jobData?.company}</p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border bg-background p-2 flex-shrink-0">
              <Image
                src={jobData?.logo as string} 
                alt={jobData?.company || 'company logo'}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Badge variant="outline" className="text-xs sm:text-sm">{jobData?.jobtype}</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm">{jobData?.experience}</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm">{jobData?.salary}</Badge>
          </div>
          <p className='text-sm font-bold'><span className='text-primary'>Date of Posted :</span> {jobData?.createdAt.toLocaleDateString('en-US',{
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}</p>
        </div>

        <Separator className="my-6 motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md" />

        {/* Details Section */}
        <div className="space-y-6 motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md">
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">About the Role</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {jobData?.about}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
              {
                jobData?.responsibilities.map((item, index) => {
                  return (
                    <li key={index}>{item}</li>
                  )
                })
              }
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Requirements</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
              {
                jobData?.requirements.map((item, index) => {
                  return (
                    <li key={index}>{item}</li>
                  )
                })
              }
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {jobData?.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Benefits</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
              {jobData?.benefits.map((item, index) => (
                <li key={index}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <Button 
            asChild
            className="px-6 rounded-full"
          >
            <Link href={jobData?.url || '#'} target='_blank'>Apply Now</Link>
          </Button>
          <ShareButton />
        </div>
      </div>
    </div>
  )
}
