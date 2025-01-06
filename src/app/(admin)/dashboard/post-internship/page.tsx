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

export default function PostInternship() {
  return (
    <div className="w-full h-full pt-[4rem] overflow-hidden sm:px-10">
      <div className="w-full py-5 px-2 h-full flex flex-col overflow-y-scroll scrollbar-hide">
        <h1 className="text-lg sm:text-lg font-bold tracking-tight text-primary">Post New Internship</h1>
        <p className="text-muted-foreground mt-1">Fill in the details below to create a new internship listing.</p>

        <form className="w-full h-full mt-4 space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Enter company name" className="border-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Internship Title</Label>
                <Input id="title" placeholder="Enter internship title" className="border-muted" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Internship Type</Label>
                <Select>
                  <SelectTrigger className="border-muted">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location or 'Remote'" className="border-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stipend">Stipend Range</Label>
                <Input id="stipend" placeholder="e.g. $500 - $1000" className="border-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Internship Duration</Label>
              <Input id="duration" placeholder="e.g. 3 months, 6 months" className="border-muted" />
            </div>
          </div>

          <Separator />

          {/* About the Internship */}
          <div className="space-y-2">
            <Label htmlFor="about">About the Internship</Label>
            <Textarea
              id="about"
              placeholder="Provide a brief overview of the internship and its goals"
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
              placeholder="List the internship requirements (one per line)"
              className="min-h-[150px] border-muted resize-none"
            />
            <p className="text-xs text-muted-foreground">Enter each requirement on a new line</p>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Required Skills</Label>
            <Input id="skills" placeholder="e.g. Python, Data Analysis, Communication" className="border-muted" />
            <p className="text-xs text-muted-foreground">Separate skills with commas</p>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits</Label>
            <Textarea
              id="benefits"
              placeholder="List the benefits of this internship (one per line)"
              className="min-h-[150px] border-muted resize-none"
            />
            <p className="text-xs text-muted-foreground">Enter each benefit on a new line</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg">Post Internship</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
