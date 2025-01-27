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
import FormButton from "@/components/snippets/FormButton";
import Form from "next/form";
import { internshipPosting } from "@/app/actions/actions";

export default function PostInternship() {
  return (
      <div className="w-full px-2 flex flex-col">
        <h1 className="text-lg sm:text-lg font-bold tracking-tight text-primary">Post New Internship</h1>
        <p className="text-muted-foreground mt-1">Fill in the details below to create a new internship listing.</p>

        <Form action={internshipPosting} className="w-full h-full mt-4 space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" name="company" placeholder="Enter company name" className="border-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Internship Title</Label>
                <Input id="title" name="title" placeholder="Enter internship title" className="border-muted" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Internship Type</Label>
                <Select name="internType">
                  <SelectTrigger className="border-muted" name="internType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="Enter location or 'Remote'" className="border-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stipend">Stipend Range</Label>
                <Input id="stipend" name="stipend" placeholder="e.g. $500 - $1000" className="border-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Eexperience</Label>
                <Input id="experience" name="experience" placeholder="e.g. 1+ years" className="border-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Internship Duration</Label>
              <Input id="duration" name="duration" placeholder="e.g. 3 months, 6 months" className="border-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Internship Company logo</Label>
              <Input id="logo" name="logo" placeholder="e.g. logo.png" className="border-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Internship URL</Label>
              <Input id="url" name="url" placeholder="Enter URL" className="border-muted" />
            </div>
          </div>

          <Separator />

          {/* About the Internship */}
          <div className="space-y-2">
            <Label htmlFor="about">About the Internship</Label>
            <Textarea
              id="about"
              name="about"
              placeholder="Provide a brief overview of the internship and its goals"
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
              placeholder="List the internship requirements (one per line)"
              className="min-h-[150px] border-muted resize-none"
            />
            <p className="text-xs text-muted-foreground">Enter each requirement on a new line</p>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Required Skills</Label>
            <Input id="skills" name="skills" placeholder="e.g. Python, Data Analysis, Communication" className="border-muted" />
            <p className="text-xs text-muted-foreground">Separate skills with commas</p>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits</Label>
            <Textarea
              id="benefits"
              name="benefits"
              placeholder="List the benefits of this internship (one per line)"
              className="min-h-[150px] border-muted resize-none"
            />
            <p className="text-xs text-muted-foreground">Enter each benefit on a new line</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <FormButton formtype="Internship" />
          </div>
        </Form>
      </div>
  );
}
