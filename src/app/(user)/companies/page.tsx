import { getCompanies } from "@/actions/company-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2 } from "lucide-react";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PrepFlow - Company Wise Questions",
};

const CompaniesPage = async ({ searchParams }: SearchParams) => {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const getCookie = await cookies();
  const searchValue = getCookie.get("searchValue")?.value;
  const companies = await getCompanies(currentPage, searchValue);
  const totalPages = searchValue ? 1 : 16;
  return (
    <div className="w-full min-h-full pt-[5rem] max-sm:px-2 sm:px-6 ">
      <div className=" w-full flex flex-wrap items-center justify-between gap-4">
        <div className="w-full md:w-auto ">
          <h1 className="text-lg font-bold text-primary">
            Company Wise Questions
          </h1>
        </div>
        <div className="*:not-first:mt-2 w-full md:w-[25rem]">
          <form className="relative"
            action={async (formData: FormData) => {
              "use server";
              const searchValue = formData.get("search") as string;
              console.log(searchValue)
              const getCookies = await cookies();
              getCookies.set("searchValue", searchValue, { maxAge: 5 });
            }}>
            <Input name="search" className="peer ps-9 pe-9" placeholder="Search..." type="search" />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <Button
              variant={"link"}
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Submit search"
            >
              <ArrowRightIcon size={16} aria-hidden="true" />
            </Button>
          </form>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-5">
        {companies.length > 0 ? (
          companies.map((company, index) => (
            <div
              key={index}
              className="group relative flex-1 min-w-[280px] intersect:motion-preset-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative block overflow-hidden rounded-lg border bg-background p-6 hover:border-primary transition-all duration-200 hover:shadow-lg h-full">
                <div className="flex items-center gap-4">
                  {company.image !== "None" ? (
                    <Image
                      height={76}
                      width={76}
                      src={company.image as string}
                      alt={company.name}
                      className="h-12 w-12 bg-background dark:bg-white rounded-sm object-contain border p-1"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg border flex items-center justify-center bg-muted">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{company.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {company._count.problems} Questions
                    </p>
                  </div>
                </div>
                <Button
                  size={"sm"}
                  asChild
                  variant="secondary"
                  className="w-full text-xs mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  <Link href={`/companies/${company.slug}`} passHref>Practice Now</Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <h1 className="font-semibold my-auto">No Companies found</h1>
          </div>
        )}
      </div>


      <Pagination className="my-8 ">
        <PaginationContent className="w-full justify-between gap-3">
          <PaginationItem>
            <Button
              variant="outline"
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled={currentPage === 1 ? true : undefined}
              role={currentPage === 1 ? "link" : undefined}
              asChild
            >
              <a
                href={
                  currentPage === 1 ? undefined : `?page=${currentPage - 1}`
                }
              >
                <ChevronLeft
                  className="-ms-1 me-2 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Previous
              </a>
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
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
                <ChevronRight
                  className="-me-1 ms-2 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </a>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CompaniesPage;
