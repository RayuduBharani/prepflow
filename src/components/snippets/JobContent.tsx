import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link";

const jobsData = [
    {
        company: "Microsoft",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
        title: "Cloud Solutions Architect",
        type: "Full-time",
        location: "Redmond, WA",
        salary: "$140K - $200K",
        description: "Design and implement scalable cloud solutions using Azure and modern architectural patterns.",
        skills: ["Azure", "Cloud Architecture", "Kubernetes", "DevOps"]
    },
    {
        company: "Meta",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2048px-Meta_Platforms_Inc._logo.svg.png",
        title: "AI/ML Engineer",
        type: "Remote",
        location: "Remote USA",
        salary: "$150K - $220K",
        description: "Work on cutting-edge AI/ML solutions for social media platforms and virtual reality.",
        skills: ["Python", "TensorFlow", "PyTorch", "Deep Learning"]
    },
    {
        company: "Apple",
        logo: "https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png",
        title: "iOS Developer",
        type: "Hybrid",
        location: "Cupertino, CA",
        salary: "$130K - $190K",
        description: "Create exceptional mobile experiences for Apple's ecosystem using Swift and SwiftUI.",
        skills: ["Swift", "iOS", "SwiftUI", "Xcode"]
    },
    {
        company: "Amazon",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
        title: "DevOps Engineer",
        type: "Full-time",
        location: "Seattle, WA",
        salary: "$125K - $185K",
        description: "Build and maintain scalable infrastructure for AWS services and internal tools.",
        skills: ["AWS", "Docker", "Jenkins", "Terraform"]
    },
    {
        company: "Netflix",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png",
        title: "Backend Engineer",
        type: "Remote",
        location: "Los Gatos, CA",
        salary: "$140K - $210K",
        description: "Design and implement scalable backend services for streaming platform.",
        skills: ["Java", "Spring Boot", "Microservices", "Redis"]
    },
    {
        company: "Salesforce",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png",
        title: "Technical Architect",
        type: "Hybrid",
        location: "San Francisco, CA",
        salary: "$160K - $230K",
        description: "Lead technical architecture for enterprise CRM solutions and cloud platforms.",
        skills: ["Apex", "Lightning", "Integration", "System Design"]
    },
    {
        company: "Adobe",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.png/1200px-Adobe_Corporate_Logo.png",
        title: "Frontend Engineer",
        type: "Full-time",
        location: "San Jose, CA",
        salary: "$115K - $175K",
        description: "Build creative tools and experiences for Adobe's Creative Cloud platform.",
        skills: ["JavaScript", "React", "WebGL", "CSS3"]
    },
    {
        company: "Twitter",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png",
        title: "Data Engineer",
        type: "Remote",
        location: "Remote USA",
        salary: "$130K - $190K",
        description: "Work with big data technologies to process and analyze social media data.",
        skills: ["Spark", "Hadoop", "Python", "SQL"]
    },
    {
        company: "LinkedIn",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png",
        title: "Security Engineer",
        type: "Hybrid",
        location: "Sunnyvale, CA",
        salary: "$135K - $195K",
        description: "Protect user data and implement security measures for professional network platform.",
        skills: ["Security", "Cryptography", "Network Security", "Auth"]
    }
];

export async function JobContent() {
    return (
        <div className="w-full h-full px-2 py-2 space-y-4 sm:space-y-6">
            <Separator className="" />
            <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                <div className="relative w-full sm:max-w-[400px]">
                    <svg className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input className="pl-8 sm:pl-10 bg-background border text-sm" placeholder="Search jobs, companies, or locations..." />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="default" className="w-full sm:w-auto gap-2">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filters
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Filter Jobs</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            Location
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Salary Range
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Job Type
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {jobsData.map((job, index) => (
                    <div key={index}
                        className="group min-h-[350px] sm:h-[400px] bg-background rounded-lg sm:rounded-xl p-4 sm:p-6 border hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col justify-between">
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex justify-between items-start gap-3 sm:gap-4">
                                <div className="flex-1 min-w-0 space-y-1">
                                    <p className="text-sm font-medium text-primary">{job.company}</p>
                                    <h2 className="font-bold text-lg sm:text-xl text-foreground truncate group-hover:text-primary transition-colors">
                                        {job.title}
                                    </h2>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {job.type}
                                    </span>
                                </div>
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border bg-background p-2 flex-shrink-0">
                                    <img className="w-full h-full object-contain" src={job.logo} alt={`${job.company} logo`} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-sm">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="truncate">{job.location}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="truncate">{job.salary}</span>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                {job.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                                {job.skills.map((skill, i) => (
                                    <span key={i} className="px-2 py-0.5 text-xs rounded-md bg-secondary text-secondary-foreground">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-end pt-4 mt-4 border-t">
                            <Button variant="secondary" size="sm" asChild><Link href={`jobs/1`}>View this job</Link></Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
