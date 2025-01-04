import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="w-full h-full pt-[4rem] px-12 mt-7">
      <h1 className="text-lg font-bold text-primary">Admin Dashboard</h1>
      <div className="grid grid-cols-1 mt-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Jobs</CardTitle>
            <CardDescription>Create and manage job listings</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/post-job">
              <Button className="w-full">Create New Job</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Post Internships</CardTitle>
            <CardDescription>Create and manage internship listings</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/post-internship">
              <Button className="w-full">Create New Job</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Post Roadmaps</CardTitle>
            <CardDescription>Create learning paths and roadmaps</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/post-roadmap">
              <Button className="w-full">Create New Roadmap</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}