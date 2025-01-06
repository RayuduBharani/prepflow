import React from 'react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function JobView() {
  return (
    <div className='w-full h-full overflow-hidden pt-[4rem] sm:px-10'>
      <div className='w-full h-full px-4 py-6 overflow-y-auto scrollbar-hide'>
        {/* Header Section */}
        <div className="space-y-4 md:space-y-6 motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-lg text-primary sm:text-xl font-bold">Senior Full Stack Developer</h1>
              <p className="text-sm sm:text-base text-foreground font-medium">Google</p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border bg-background p-2 flex-shrink-0">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png" 
                alt="Google logo"
                className="w-full h-full object-contain" 
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Badge variant="outline" className="text-xs sm:text-sm">Full-time</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm">Remote</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm">$120K - $180K</Badge>
          </div>
        </div>

        <Separator className="my-6 motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md" />

        {/* Details Section */}
        <div className="space-y-6 motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md">
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">About the Role</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Join our dynamic team to build next-generation web applications using cutting-edge technologies. 
              You'll be working on complex problems and delivering high-quality solutions that impact millions of users globally.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
              <li>Design and implement scalable web applications</li>
              <li>Collaborate with cross-functional teams</li>
              <li>Write clean, maintainable, and efficient code</li>
              <li>Participate in code reviews and technical discussions</li>
              <li>Mentor junior developers and contribute to team growth</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Requirements</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
              <li>5+ years of experience in full-stack development</li>
              <li>Strong proficiency in React, Node.js, and TypeScript</li>
              <li>Experience with cloud platforms (AWS/GCP)</li>
              <li>Excellent problem-solving and communication skills</li>
              <li>Bachelor's degree in Computer Science or related field</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {["React", "Node.js", "TypeScript", "Cloud", "Docker", "CI/CD", "MongoDB", "Redis"].map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold">Benefits</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground">
              {[
                "Competitive salary and equity package",
                "Health, dental, and vision insurance",
                "Flexible work hours and remote work options",
                "Professional development budget",
                "401(k) matching"
              ].map((item, index) => (
                <li key={index}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <Button>
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  )
}
