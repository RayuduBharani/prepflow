import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Params } from 'next/dist/server/request/params';
import { getSingleIntern } from '@/app/actions/actions';
import Link from 'next/link';

export default async function InternshipView({ params }: { params: Params }) {
  const { id } = await params
  const internshipData = await getSingleIntern(id as string)
  return (
    <div className="w-full h-full overflow-hidden pt-[4rem] sm:px-10">
      <div className="w-full h-full px-4 py-6 overflow-y-auto scrollbar-hide">
        {/* Header Section */}
        <div className="space-y-4 md:space-y-6 motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-lg text-primary sm:text-xl font-bold">
                {internshipData?.title}
              </h1>
              <p className="text-sm sm:text-base text-foreground font-medium">
                {internshipData?.company}
              </p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border bg-background p-2 flex-shrink-0">
              <img
                src={internshipData?.logo}
                alt={internshipData?.company}
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

        <Separator className="my-6 motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md" />

        {/* Details Section */}
        <div className="space-y-6 motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md">
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

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Benefits</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
              {internshipData?.benefits.map((item, index) => (
                <li key={index}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <Button size="lg" className="flex-1 sm:flex-none sm:min-w-[200px]" asChild>
            <Link href={internshipData?.url!} target='_blank'>Apply Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
