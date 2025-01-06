import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function PostJob() {
  return (
    <div className="w-full h-full pt-[4rem] overflow-hidden sm:px-10">
      <div className="w-full py-5 px-2 h-full flex flex-col overflow-y-scroll scrollbar-hide">
        <h1 className="text-lg sm:text-lg font-bold tracking-tight text-primary">Post New Job</h1>
        <p className="text-muted-foreground mt-1">Fill in the details below to create a new job listing.</p>

        <form className="w-full h-full mt-4 space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Enter company name" className="border-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" placeholder="Enter job title" className="border-muted" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select>
                  <SelectTrigger className="border-muted">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location" className="border-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input id="salary" placeholder="e.g. $80K - $120K" className="border-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo URL</Label>
              <Input id="logo" type="url" placeholder="Enter logo URL" className="border-muted" />
            </div>
          </div>

          <Separator />

          {/* About the Role */}
          <div className="space-y-2">
            <Label htmlFor="about">About the Role</Label>
            <Textarea
              id="about"
              placeholder="Provide a brief overview of the role and its impact"
              className="min-h-[100px] border-muted resize-none"
            />
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <Label htmlFor="responsibilities">Key Responsibilities</Label>
            <Textarea
              id="responsibilities"
              placeholder="List the key responsibilities (one per line)"
              className="min-h-[150px] border-muted resize-none"
            />
            <p className="text-xs text-muted-foreground">Enter each responsibility on a new line</p>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="List the job requirements (one per line)"
              className="min-h-[150px] border-muted resize-none"
            />
            <p className="text-xs text-muted-foreground">Enter each requirement on a new line</p>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Required Skills</Label>
            <Input id="skills" placeholder="e.g. React, Node.js, TypeScript" className="border-muted" />
            <p className="text-xs text-muted-foreground">Separate skills with commas</p>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits</Label>
            <Textarea
              id="benefits"
              placeholder="List the benefits and perks (one per line)"
              className="min-h-[150px] border-muted resize-none"
            />
            <p className="text-xs text-muted-foreground">Enter each benefit on a new line</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg">Post Job</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
