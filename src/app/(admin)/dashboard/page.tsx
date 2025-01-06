import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="w-full h-full pt-[4rem] sm:px-12 mt-7 px-2">
      <h1 className="text-lg font-bold text-primary">Admin Dashboard</h1>
      <div className="grid grid-cols-1 mt-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Jobs</CardTitle>
            <CardDescription>Create and manage job listings</CardDescription>
          </CardHeader>
          <CardContent>
              <Button className="w-full" asChild><Link href="dashboard/post-job">Create New Job</Link></Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Post Internships</CardTitle>
            <CardDescription>Create and manage internship listings</CardDescription>
          </CardHeader>
          <CardContent>
              <Button className="w-full" asChild><Link href="dashboard/post-internship">Create New Job</Link></Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Post Roadmaps</CardTitle>
            <CardDescription>Create learning paths and roadmaps</CardDescription>
          </CardHeader>
          <CardContent>
              <Button className="w-full"><Link href="/post-roadmap">Create New Roadmap</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}