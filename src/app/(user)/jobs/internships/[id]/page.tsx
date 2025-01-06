import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function InternshipView() {
  return (
    <div className="w-full h-full overflow-hidden pt-[4rem] sm:px-10">
      <div className="w-full h-full px-4 py-6 overflow-y-auto scrollbar-hide">
        {/* Header Section */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-lg text-primary sm:text-xl font-bold">
                Software Engineer Intern
              </h1>
              <p className="text-sm sm:text-base text-foreground font-medium">
                Microsoft
              </p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border bg-background p-2 flex-shrink-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Badge variant="outline" className="text-xs sm:text-sm">Full-time</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm">Remote</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm">$1,500/month</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm">3 months</Badge>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Details Section */}
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">About the Internship</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              This internship offers a unique opportunity to work with a team of talented engineers to solve real-world problems. 
              You'll gain hands-on experience in software development, contributing to impactful projects.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
              <li>Assist in the design and development of software applications</li>
              <li>Collaborate with team members on project goals and deliverables</li>
              <li>Write clean and efficient code following best practices</li>
              <li>Conduct testing and debugging to ensure quality</li>
              <li>Prepare documentation and reports as needed</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Requirements</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
              <li>Currently enrolled in a Bachelor's or Master's program in Computer Science or a related field</li>
              <li>Knowledge of JavaScript, React, and Node.js</li>
              <li>Strong problem-solving and analytical skills</li>
              <li>Ability to work independently and in a team environment</li>
              <li>Excellent communication skills</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {["JavaScript", "React", "Node.js", "Problem-solving", "Git", "API Integration"].map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Benefits</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
              <li>Monthly stipend of $1,500</li>
              <li>Flexible work hours and remote options</li>
              <li>Access to exclusive training and development resources</li>
              <li>Mentorship from experienced engineers</li>
              <li>Certificate of completion and possible full-time opportunities</li>
            </ul>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <Button size="lg" className="flex-1 sm:flex-none sm:min-w-[200px]">
            Apply Now
          </Button>
          <Button variant="outline" size="lg" className="flex-1 sm:flex-none sm:min-w-[200px]">
            Save Internship
          </Button>
        </div>
      </div>
    </div>
  );
}
