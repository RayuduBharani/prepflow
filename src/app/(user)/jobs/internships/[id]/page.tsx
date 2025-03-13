import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Params } from 'next/dist/server/request/params';
import Link from 'next/link';
import { getSingleIntern } from '@/actions/job-actions';
import Image from 'next/image';
import Share from '@/components/Share';

export default async function InternshipView({ params }: { params: Params }) {
  const { id } = await params
  const internshipData = await getSingleIntern(id as string)
  return (
    <div className="max-w-[50rem] mx-auto h-fit pt-[4rem] sm:px-3 motion-opacity-in-0 motion-translate-y-in-[2%] motion-blur-in-sm">
      <div className='w-full h-fit px-4 py-6 motion-preset-fade motion-duration-2000'>
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-lg text-primary sm:text-xl font-bold">
                {internshipData?.title}
              </h1>
              <p className="text-sm sm:text-base text-foreground font-medium">
                {internshipData?.company}
              </p>
            </div>
            <div className="w-12 h-12 dark:bg-foreground sm:w-16 sm:h-16 rounded-lg border bg-background p-2 flex-shrink-0">
              <Image
                width={100}
                height={100}
                src={internshipData?.logo as string}
                alt={internshipData?.company || 'Company Logo'}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Badge variant="outline" className="text-xs sm:text-sm">{internshipData?.internType}</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm">{internshipData?.stipend}</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm">{internshipData?.duration}</Badge>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">About the Internship</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {internshipData?.about}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Requirements</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
              {
                internshipData?.requirements.map((item, index) => {
                  return (
                    <li key={index}>{item}</li>
                  )
                })
              }
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {internshipData?.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </section>

          {internshipData?.benefits && internshipData.benefits.length > 1 ? <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Benefits</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
              {internshipData?.benefits.map((item, index) => (
                <li key={index}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section> : null}
        </div>

        <div className="flex items-center gap-4 mt-8">
          <Button size="lg" className="flex-1 sm:flex-none sm:min-w-[200px]" asChild>
            <Link href={internshipData?.url || '#'} target='_blank'>Apply Now</Link>
          </Button>
          <Share />
        </div>
      </div>
    </div>
  );
}
