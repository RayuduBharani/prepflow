import { getCompanies } from "@/actions/company-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  ArrowRightIcon,
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import Link from "next/link";
import { cookies } from "next/headers";
import Image from "next/image";
import type { Metadata } from "next";
import { metadata as defaultMetadata } from "@/lib/defaultMetadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: {
    default: "Prepflow Company Wise Questions",
    template: "%s | PrepFlow",
  },
  description:
    "Practice coding interview questions company by company. Explore curated DSA problems from FAANG and top tech firms like Amazon, Google, Microsoft, and more.",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Company Wise Interview Questions | PrepFlow",
    description:
      "Ace your interviews with company-wise coding questions. Practice Amazon, Google, Microsoft, and other top tech company problems on PrepFlow.",
    url: "https://prepflow.vercel.app/companies",
    images: [
      {
        url: "https://prepflow.vercel.app/og-companies.png",
        width: 1200,
        height: 630,
        alt: "Company Wise Coding Questions on PrepFlow",
      },
    ],
  },
  twitter: {
    ...defaultMetadata.twitter,
    title: "Company Wise Coding Questions | PrepFlow",
    description:
      "Prepare for FAANG and top tech interviews with company-wise curated coding problems. Practice now on PrepFlow.",
    images: ["https://prepflow.vercel.app/og-companies.png"],
  },
  alternates: {
    canonical: "https://prepflow.vercel.app/companies",
  },
  category: "career, education",
};

const CompaniesPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;
  const getCookie = await cookies();
  const searchValue = getCookie.get("searchValue")?.value;
  const companies = await getCompanies(currentPage, searchValue);
  const totalPages = searchValue ? 1 : 16;

  return (
    <div className="w-full min-h-full pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Hero Header ── */}
      <div className="mb-12">
        {/* Label pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-4">
          <Briefcase className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary tracking-wide uppercase">
            Interview Prep
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          {/* Title + subtitle */}
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none">
              Company{" "}
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                Wise Questions
              </span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Ace your next interview by practising real questions asked at
              FAANG and top tech firms. Filter by company, focus on what
              matters.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums">150+</p>
              <p className="text-xs text-muted-foreground mt-0.5">Companies</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums">3k+</p>
              <p className="text-xs text-muted-foreground mt-0.5">Questions</p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-8 max-w-xl">
          <form
            className="relative group"
            action={async (formData: FormData) => {
              "use server";
              const searchValue = formData.get("search") as string;
              const getCookies = await cookies();
              getCookies.set("searchValue", searchValue, { maxAge: 5 });
            }}
          >
            <Input
              name="search"
              className="peer ps-11 pe-12 h-12 rounded-2xl border border-border/60 bg-muted/40 text-sm placeholder:text-muted-foreground/60 transition-all focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:bg-background shadow-sm"
              placeholder="Search companies — e.g. Google, Meta…"
              type="search"
              defaultValue={searchValue || ""}
            />
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 text-muted-foreground/50 peer-focus-within:text-primary transition-colors pointer-events-none">
              <SearchIcon size={18} />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 end-1.5 my-auto h-9 w-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              aria-label="Submit search"
              type="submit"
            >
              <ArrowRightIcon size={16} />
            </Button>
          </form>
        </div>

        {/* Active search indicator */}
        {searchValue && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing results for</span>
            <Badge variant="secondary" className="font-mono text-xs">
              {searchValue}
            </Badge>
            <span>·</span>
            <span className="font-medium">{companies.length} found</span>
          </div>
        )}
      </div>

      {/* ── Grid ── */}
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {companies.map((company, index) => (
            <Link
              key={company.slug}
              href={`/companies/${company.slug}`}
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <article className="relative flex flex-col h-full rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-1 cursor-pointer">
                {/* Top: logo + name */}
                <div className="flex items-center gap-3.5 mb-5">
                  {company.image !== "None" ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border bg-white dark:bg-white/95 shadow-sm">
                      <Image
                        fill
                        sizes="48px"
                        src={company.image as string}
                        alt={company.name}
                        className="object-contain p-1.5"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-muted/60 text-muted-foreground">
                      <Building2 className="h-5 w-5" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="font-semibold text-base truncate leading-tight group-hover:text-primary transition-colors duration-200">
                      {company.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {company._count.problems} questions
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-border/60 mb-4" />

                {/* CTA */}
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors duration-200">
                    Start practising
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        /* ── Empty state ── */
        <div className="flex flex-col items-center justify-center py-28 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-5">
            <Building2 className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">No companies found</h2>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
            We couldn&apos;t find any companies matching{" "}
            <span className="font-mono text-foreground">
              &quot;{searchValue}&quot;
            </span>
            . Try a different keyword.
          </p>
          <form
            className="mt-6"
            action={async () => {
              "use server";
              const getCookies = await cookies();
              getCookies.set("searchValue", "", { maxAge: 1 });
            }}
          >
            <Button type="submit" variant="outline" size="sm" className="rounded-full">
              Clear search
            </Button>
          </form>
        </div>
      )}

      {/* ── Pagination ── */}
      {companies.length > 0 && (
        <div className="mt-12 flex items-center justify-between gap-4">
          {/* Page info */}
          <p className="text-sm text-muted-foreground hidden sm:block">
            Page{" "}
            <span className="font-semibold text-foreground">{currentPage}</span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </p>

          <Pagination className="mx-0 w-auto">
            <PaginationContent className="gap-2">
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl gap-1.5 aria-disabled:pointer-events-none aria-disabled:opacity-40 transition-colors hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                  aria-disabled={currentPage === 1 ? true : undefined}
                  role={currentPage === 1 ? "link" : undefined}
                  asChild
                >
                  <a href={currentPage === 1 ? undefined : `?page=${currentPage - 1}`}>
                    <ChevronLeft size={15} strokeWidth={2} />
                    Previous
                  </a>
                </Button>
              </PaginationItem>

              {/* Page numbers – show a small window */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const offset = Math.max(
                  0,
                  Math.min(currentPage - 3, totalPages - 5)
                );
                const p = i + 1 + offset;
                return (
                  <PaginationItem key={p}>
                    <Button
                      variant={p === currentPage ? "default" : "ghost"}
                      size="sm"
                      className="h-9 w-9 rounded-xl text-sm"
                      asChild
                    >
                      <a href={`?page=${p}`}>{p}</a>
                    </Button>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl gap-1.5 aria-disabled:pointer-events-none aria-disabled:opacity-40 transition-colors hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                  aria-disabled={currentPage === totalPages ? true : undefined}
                  role={currentPage === totalPages ? "link" : undefined}
                  asChild
                >
                  <a
                    href={
                      currentPage === totalPages
                        ? undefined
                        : `?page=${currentPage + 1}`
                    }
                  >
                    Next
                    <ChevronRight size={15} strokeWidth={2} />
                  </a>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;