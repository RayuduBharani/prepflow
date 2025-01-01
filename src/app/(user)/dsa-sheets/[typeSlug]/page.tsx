import { prisma } from "@/prisma";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import QuestionCards from "@/components/snippets/QuestionCards";

async function SheetQuestions({
    params,
    searchParams,
}: {
    params: { typeSlug: string };
    searchParams: Promise<{ questions?: string }>
}) {
    const { typeSlug } = await params;
    const page = Number((await searchParams).questions) || 1
    const limit = 15
    const skip = (page - 1) * limit;

    const prismaData = await prisma.problem.findMany({
        where: {
            mainTopics: {
                some: {
                    name: typeSlug,
                },
            },
        },
        include: {
            companyTags: true,
            mainTopics: true,
        },
        skip,
        take: limit,
    });

    const totalItems = await prisma.problem.count({
        where: {
            mainTopics: {
                some: {
                    name: typeSlug,
                },
            },
        },
    });

    const totalPages = Math.ceil(totalItems / limit);

    const renderPagination = () => {
        const visiblePages = 3
        const pages = [];

        if (totalPages <= visiblePages + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href={`?questions=${i}`}
                            className={page === i ? "text-bold text-primary" : ""}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            const startPages = [1];
            const endPages = [totalPages];
            const middlePages = [
                page > 2 ? page - 1 : null,
                page,
                page < totalPages - 1 ? page + 1 : null,
            ].filter(Boolean);

            const allPages = [...startPages, ...middlePages, ...endPages];
            const uniquePages = Array.from(new Set(allPages)) as number[];

            uniquePages.forEach((pageNum, index) => {
                const isEllipsis =
                    index > 0 &&
                    index < uniquePages.length - 1 &&
                    uniquePages[index - 1] + 1 !== pageNum;

                if (isEllipsis) {
                    pages.push(
                        <PaginationEllipsis key={`ellipsis-${index}`} />
                    );
                }

                pages.push(
                    <PaginationItem key={pageNum}>
                        <PaginationLink
                            href={`?questions=${pageNum}`}
                            className={page === pageNum ? "text-bold text-primary" : ""}
                        >
                            {pageNum}
                        </PaginationLink>
                    </PaginationItem>
                );
            });
        }

        return pages;
    };

    return (
        <div className="w-full h-full pt-[4rem] sm:px-10 bg-background text-foreground">
            <div className="w-full h-full overflow-y-auto scrollbar-hide">
                <h1 className="text-lg font-bold mt-7 text-primary sm:px-2 max-sm:px-4">
                    Practice Questions
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 sm:px-2 max-sm:px-4">
                    Challenge Yourself with These Carefully Curated Questions
                </p>
                <Pagination className="mt-3 w-full flex justify-center">
                    <PaginationContent className="max-sm:overflow-hidden">
                        {page > 1 && (
                            <PaginationItem>
                                <PaginationPrevious href={`?questions=${page - 1}`} />
                            </PaginationItem>
                        )}
                        {renderPagination()}
                        {page < totalPages && (
                            <PaginationItem className="w-[10%]">
                                <PaginationNext href={`?questions=${page + 1}`} />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
                {prismaData.length > 0 ? (
                    <QuestionCards prismaData={prismaData} />
                ) : (
                    <div className="w-full h-[85%] flex justify-center items-center">
                        <p className="font-bold text-primary animate-pulse">
                            No data found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SheetQuestions;
