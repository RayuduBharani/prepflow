import { getInternships } from "@/app/actions/actions";
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

// const internshipsData = [
//     {
//         company: "Microsoft",
//         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
//         title: "Cloud Platform Intern",
//         duration: "6 months",
//         location: "Redmond, WA",
//         stipend: "$7500/month",
//         description: "Work with Azure cloud services and help build scalable solutions for enterprise customers.",
//         requirements: ["Cloud knowledge", "Java/Python", "Database skills"]
//     },
//     {
//         company: "Meta",
//         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2048px-Meta_Platforms_Inc._logo.svg.png",
//         title: "ML Research Intern",
//         duration: "4 months",
//         location: "Remote",
//         stipend: "$7800/month",
//         description: "Research and implement machine learning solutions for social media applications.",
//         requirements: ["ML/AI background", "Python", "Research experience"]
//     },
//     {
//         company: "Amazon",
//         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
//         title: "AWS Intern",
//         duration: "3 months",
//         location: "Seattle, WA",
//         stipend: "$7600/month",
//         description: "Develop and maintain AWS services while learning cloud infrastructure.",
//         requirements: ["AWS knowledge", "Systems design", "Programming skills"]
//     },
//     {
//         company: "Apple",
//         logo: "https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png",
//         title: "iOS Development Intern",
//         duration: "6 months",
//         location: "Cupertino, CA",
//         stipend: "$7700/month",
//         description: "Create innovative mobile experiences for Apple's ecosystem.",
//         requirements: ["Swift knowledge", "UI/UX skills", "Mobile development"]
//     }
// ];

export async function InternContent() {
    const internshipsData = await getInternships()
    return (
        <div className="w-full h-full px-2 py-2 space-y-4 sm:space-y-6">
            <Separator className="" />
            <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                <div className="relative w-full sm:max-w-[400px]">
                    <svg className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input className="pl-8 sm:pl-10 bg-background border text-sm" placeholder="Search internships..." />
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
                        <DropdownMenuLabel>Filter Internships</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            Location
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Duration
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Company
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {
                    internshipsData.map((internship, index) => (
                        <div key={index}
                            className="group min-h-[350px] sm:h-[400px] bg-background rounded-lg sm:rounded-xl p-4 sm:p-6 border hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col justify-between">
                            <div className="space-y-3 sm:space-y-4 ">
                                <div className="flex justify-between items-start gap-3 sm:gap-4">
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <p className="text-sm font-medium text-primary">{internship.company}</p>
                                        <h2 className="font-bold text-lg sm:text-xl text-foreground truncate group-hover:text-primary transition-colors">
                                            {internship.title}
                                        </h2>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            {internship.duration}
                                        </span>
                                    </div>
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border bg-background p-2 flex-shrink-0">
                                        <img className="w-full h-full object-contain" src={internship.logo} alt={`${internship.company} logo`} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="truncate">{internship.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="truncate">{internship.stipend}</span>
                                    </div>
                                </div>

                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                    {internship.about}
                                </p>

                                <div className="flex flex-wrap gap-1.5">
                                    {internship.skills.map((skill, i) => (
                                        <span key={i} className="px-2 py-0.5 text-xs rounded-md bg-secondary text-secondary-foreground">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end pt-4 mt-4 border-t">
                                <Button variant="outline" size="sm"><Link href={`/jobs/internships/${internship.id}`}>View this internship</Link></Button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}
