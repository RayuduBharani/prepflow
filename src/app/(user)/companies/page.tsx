import { getCompanies } from "@/actions/company-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Building2 } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
const CompaniesPage = async ({ searchParams }: SearchParams) => {

	const { page } = await searchParams;
	const currentPage = page ? parseInt(page) : 1;
	const getCookie = await cookies()
	const searchValue = getCookie.get("searchValue")?.value
	const companies = await getCompanies(currentPage , searchValue);
	const totalPages = searchValue ? 1 : 30;
	return (
		<div className="w-full h-full pt-[5rem] max-sm:px-2 sm:px-6 overflow-hidden scrollbar-hide">
			<div className=" w-full flex flex-wrap items-center justify-between gap-4">
				<div className="w-full md:w-auto ">
					<h1 className="text-lg font-bold text-primary">Company Wise Questions</h1>
				</div>
				<form action={async(formData: FormData) => {
					"use server"
					const searchValue = formData.get('search') as string;
					const getCookies = await cookies();
					getCookies.set('searchValue', searchValue, { maxAge: 5 });
				}} className="flex w-full md:w-auto flex-wrap gap-3">
					<Input name="search" className="w-full md:w-[20rem]" placeholder="Search Comapanies..." />
					<Button size={"sm"} className="w-full md:w-auto">Search</Button>
				</form>
			</div>

			<div className="flex flex-wrap gap-4 mt-5">
				{companies.length>0 ? companies.map((company, index) => (
					<div key={index} className="group relative flex-1 min-w-[280px]">
						<div className="relative block overflow-hidden rounded-lg border bg-background p-6 hover:border-primary transition-all duration-200 hover:shadow-lg h-full">
							<div className="flex items-center gap-4">
								{company.image !== "None" ? (
									<img
										src={company.image as string}
										alt={company.name}
										className="h-12 w-12 rounded-lg object-contain border p-1"
									/>
								) : (
									<div className="h-12 w-12 rounded-lg border flex items-center justify-center bg-muted">
										<Building2 className="h-6 w-6 text-muted-foreground" />
									</div>
								)}
								<div className="flex-1 min-w-0">
									<h3 className="font-semibold truncate">{company.name}</h3>
									<p className="text-sm text-muted-foreground mt-1">{company._count.problems} Questions</p>
								</div>
							</div>
							<div className="mt-4 space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Progress</span>
									<span className="font-medium">40%</span>
								</div>
								<Progress value={0} className="h-2" />
							</div>
							<Button asChild
								variant="secondary"
								className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
								<Link href={`/companies/${company.slug}`}>Practice Now</Link>
							</Button>
						</div>
					</div>
				)) : 
				<div className="w-full h-full flex justify-center items-center">
					<h1 className="font-semibold my-auto">No Companies found</h1>
				</div>
				}
			</div>

			<Pagination className="my-8 ">
				<PaginationContent className="w-full justify-between gap-3">
					<PaginationItem>
						<Button
							variant="outline"
							className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
							aria-disabled={currentPage === 1 ? true : undefined}
							role={currentPage === 1 ? "link" : undefined}
							asChild>
							<a href={currentPage === 1 ? undefined : `?page=${currentPage - 1}`}>
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
							asChild>
							<a href={currentPage === totalPages ? undefined : `?page=${currentPage + 1}`}>
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
