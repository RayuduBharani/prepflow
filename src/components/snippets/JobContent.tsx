import { getJobs } from "@/app/actions/actions";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Calendar, DollarSign, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import Experience from "./Experience";

export async function JobContent() {
    const jobsData = await getJobs()
    
    return (
        <div className="w-full h-full p-2 sm:p-4 space-y-4">
            <Separator />
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* Filters Sidebar */}
                <div className="w-full h-fit lg:w-[300px] flex-shrink-0 space-y-4 sm:space-y-6 bg-background/50 p-3 sm:p-4 rounded-lg border">
                    {/* Search Input */}
                    <div className="relative w-full">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <Input className="pl-10 bg-background" placeholder="Search jobs..." />
                    </div>

                    <ScrollArea className="h-auto lg:h-[calc(100vh-12rem)] pb-4">
                        <div className="space-y-6 pr-4">
                            {/* Experience Level */}
                           <Experience />

                            <Separator />

                            {/* Job Type */}
                            <div className="space-y-4">
                                <div className="font-semibold">Job Type</div>
                                <div className="space-y-3">
                                    {['Full-time', 'Part-time', 'Contract', 'Freelance'].map((type) => (
                                        <div className="flex items-center space-x-2" key={type}>
                                            <Checkbox id={type} />
                                            <label htmlFor={type} className="text-sm leading-none">
                                                {type}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Salary Range */}
                            <div className="space-y-4">
                                <div className="font-semibold">Salary Range</div>
                                <div className="space-y-3">
                                    {[
                                        '$0 - $50k/year',
                                        '$50k - $100k/year',
                                        '$100k - $150k/year',
                                        '$150k+/year'
                                    ].map((range) => (
                                        <div className="flex items-center space-x-2" key={range}>
                                            <Checkbox id={range} />
                                            <label htmlFor={range} className="text-sm leading-none">
                                                {range}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <Button className="w-full">Apply Filters</Button>
                </div>

                {/* Jobs Content */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {jobsData.map((job, index) => (
                            <div key={index} className="group relative bg-background rounded-lg border hover:shadow-md transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative p-3 sm:p-4">
                                    {/* Company Logo and Title */}
                                    <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border bg-background p-1.5 sm:p-2 flex-shrink-0">
                                            <img className="w-full h-full object-contain" src={job.logo} alt={`${job.company} logo`} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                                                {job.title}
                                            </h3>
                                            <p className="text-sm text-primary truncate">
                                                {job.company}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Job Details with smaller text on mobile */}
                                    <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="truncate">{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="truncate">{job.experience}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            <span className="truncate">{job.salary}</span>
                                        </div>
                                    </div>

                                    {/* Skills with adjusted spacing */}
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                        {job.skills.slice(0, 3).map((skill, i) => (
                                            <Badge key={i} variant="secondary">{skill}</Badge>
                                        ))}
                                        {job.skills.length > 3 && (
                                            <Badge variant="outline">+{job.skills.length - 3} more</Badge>
                                        )}
                                    </div>

                                    {/* Footer with adjusted padding */}
                                    <div className="flex items-center justify-between pt-2 sm:pt-3 border-t">
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(job.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                        <Button size="sm" variant="default" asChild>
                                            <Link href={`/jobs/${job.id}`}>View Details</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}