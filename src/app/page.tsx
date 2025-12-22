import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React from "react";
import type { Metadata } from "next";
import { metadata as defaultMetadata } from "@/lib/defaultMetadata";
import {
  Code2,
  BriefcaseIcon,
  Building2,
  CheckCircle2,
  Target,
  Zap,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { GridPattern } from "@/components/ui/grid-background";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "PrepFlow - Master Tech Interviews | DSA, System Design & Coding Practice",
  description:
    "Ace your FAANG and tech interviews with PrepFlow. Practice DSA problems, learn system design, use our online compiler, check your resume with ATS, and prepare like a pro. Your path to landing your dream job starts here.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "PrepFlow - Your Complete Interview Preparation Platform",
    description:
      "Master data structures, algorithms, system design, and ace technical interviews at top tech companies.",
  },
};

const features = [
  {
    icon: BookOpen,
    title: "Curated DSA Sheets",
    description:
      "Practice with carefully selected DSA problems organized by topics and difficulty levels.",
    link: "/dsa-sheets",
    badge: "Core Feature",
  },
  {
    icon: Building2,
    title: "Company-Wise Questions",
    description:
      "Target your preparation with real questions asked by top tech companies like Google, Amazon, and Microsoft.",
    link: "/companies",
    badge: "Strategic",
  },
  {
    icon: Code2,
    title: "Online Compiler",
    description:
      "Write, run, and test code instantly in multiple languages without leaving the platform.",
    link: "/compiler",
    badge: "Hands-on",
  },
  {
    icon: BriefcaseIcon,
    title: "Jobs & Internships",
    description:
      "Discover the latest tech opportunities and apply directly from one unified platform.",
    link: "/jobs",
    badge: "Opportunities",
  },
  {
    icon: CheckCircle2,
    title: "ATS Resume Checker",
    description:
      "Optimize your resume to pass Applicant Tracking Systems and land more interviews.",
    link: "/ats-checker",
    badge: "Career Tool",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Save Time",
    text: "Everything you need in one place - no more jumping between multiple platforms.",
  },
  {
    icon: Target,
    title: "Focused Preparation",
    text: "Company-specific questions and curated sheets help you prepare with intention.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    text: "Monitor your growth and stay motivated throughout your preparation journey.",
  },
];

const page = async () => {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <BackgroundLines
        svgOptions={{ duration: 2 }}
        className="flex isolate items-center justify-center h-dvh w-full flex-col px-4 py-20 md:py-32"
      >
        <h1
          className="bg-clip-text text-transparent text-center bg-linear-to-b from-primary/40
         to-primary text-6xl max-sm:text-3xl
         font-sans relative z-20 font-bold tracking-tight motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md max-w-5xl"
        >
          Shape Your Future, <br /> Achieve Your Dreams
        </h1>
        <p className="max-w-3xl mx-auto max-sm:text-xs text-base text-muted-foreground text-center mt-6 motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md leading-relaxed">
          PrepFlow is your unified platform for technical interview preparation.
          Practice DSA problems, prepare with company-specific questions, code
          in our online compiler, and discover opportunities - all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8 motion-opacity-in-0 motion-translate-y-in-25 motion-blur-in-md z-50">
          <Button asChild size="sm">
            <Link href="/dsa-sheets">Start Practicing</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/jobs">Explore Jobs</Link>
          </Button>
        </div>
      </BackgroundLines>

        <section className="py-20 px-4 relative @container min-h-dvh max-w-7xl mx-auto">
      <GridPattern strokeDasharray="1 2" className="fill-primary/30 -z-10 stroke-primary/80 mask-[radial-gradient(140vh_circle_at_center,var(--muted),transparent)] sm:mask-[radial-gradient(80vh_circle_at_center,var(--muted),transparent)] md:mask-[radial-gradient(50vw_circle_at_center,var(--muted),transparent)] lg:mask-[radial-gradient(60vw_circle_at_center,var(--muted),transparent)]" />
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="text-primary">Succeed</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              PrepFlow brings together all the essential tools and resources you
              need to ace technical interviews at top companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link href={feature.link} key={index} className="group">
                <Card className="h-full transition-all hover:shadow-lg hover:scale-102 hover:border-primary/50 bg-transparent backdrop-blur-[0.8px] border-primary/20">
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors backdrop-blur-sm">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

      {/* Why PrepFlow Section */}
      <section className="py-20 min-h-dvh px-4 bg-radial from-primary/10 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-primary">PrepFlow?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by students, for students. We understand the challenges of
              interview preparation because we&apos;ve been there.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.text}</p>
              </div>
            ))}
          </div>

          <Card className="max-w-4xl mx-auto bg-radial-[at_25%_25%] from-primary/10 to-background backdrop-blur-[1px]">
            <CardHeader>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground italic
             space-y-4">
              <p>
                As students passionate about web development and technical
                growth, we built PrepFlow to solve a real problem we faced
                during our own preparation: scattered resources, lack of
                structure, and the absence of a unified platform.
              </p>
              <p>
                PrepFlow is our solution—a centralized, beginner-friendly hub
                that offers everything you need to prepare for internships and
                full-time roles at top tech companies.
              </p>
              <p className="font-medium text-foreground">
                We built this platform we wish we had when we started our
                journey—and now we&apos;re sharing it with every aspiring
                developer who needs a better way to prepare.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 min-h-dvh flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students preparing for their dream jobs.
            Everything is free and always will be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="sm">
              <Link href="/dsa-sheets">Get Started Now</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/compiler">Try the Compiler</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
