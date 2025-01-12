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
import Form from "next/form";
import { jobPosting } from "@/app/actions/actions";
import FormButton from "@/components/snippets/FormButton";

async function PostJob() {
  return (
    <div className="w-full h-full pt-[4rem] overflow-hidden sm:px-10">
      <div className="w-full py-5 px-2 h-full flex flex-col overflow-y-scroll scrollbar-hide">
        <h1 className="text-lg sm:text-lg font-bold tracking-tight text-primary">Post New Job</h1>
        <p className="text-muted-foreground mt-1 text-sm">Fill in the details below to create a new job listing.</p>

        <Form action={jobPosting} className="w-full h-full mt-7 space-y-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input name="company" id="company" placeholder="Enter company name" className="border-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input name="title" id="title" placeholder="Enter job title" className="border-muted" suppressContentEditableWarning={true}/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select name="jobtype">
                  <SelectTrigger className="border-muted" id="type" name="jobtype">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full_time">Full-time</SelectItem>
                    <SelectItem value="Part_time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input name="location" id="location" placeholder="Enter location" className="border-muted" suppressContentEditableWarning={true}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input name="salary" id="salary" placeholder="e.g. $80K - $120K" className="border-muted" suppressContentEditableWarning={true}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Input name="experience" id="experience" placeholder="e.g. 5+ years" className="border-muted" suppressContentEditableWarning={true}/>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo URL</Label>
              <Input name="logo" id="logo" type="text" placeholder="Enter logo URL" className="border-muted" suppressContentEditableWarning={true}/>
            </div>
          </div>

          <Separator />

          {/* About the Role */}
          <div className="space-y-2">
            <Label htmlFor="about">About the Role</Label>
            <Textarea
              name="about"
              id="about"
              placeholder="Provide a brief overview of the role and its impact"
              className="min-h-[100px] border-muted resize-none"
            />
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <Label htmlFor="responsibilities">Key Responsibilities</Label>
            <Textarea
              name="responsibilities"
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
              name="requirements"
              id="requirements"
              placeholder="List the job requirements (one per line)"
              className="min-h-[150px] border-muted resize-none"
            />
            <p className="text-xs text-muted-foreground">Enter each requirement on a new line</p>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Required Skills</Label>
            <Input name="skills" id="skills" placeholder="e.g. React, Node.js, TypeScript" className="border-muted" suppressContentEditableWarning={true}/>
            <p className="text-xs text-muted-foreground">Separate skills with commas</p>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits</Label>
            <Textarea
              name="benefits"
              id="benefits"
              placeholder="List the benefits and perks (one per line)"
              className="min-h-[150px] border-muted resize-none"
            />
            <p className="text-xs text-muted-foreground">Enter each benefit on a new line</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="joburl">Job Url</Label>
            <Input name="url" id="joburl" placeholder="e.g. React, Node.js, TypeScript" className="border-muted" suppressContentEditableWarning={true}/>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <FormButton formtype="Job"/>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default PostJob