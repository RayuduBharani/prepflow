import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";
import { getProblemsByCompany } from "@/app/actions/actions";
import { getDifficultyColor } from "@/lib/utils";
import Link from "next/link";


export default async function QuestionPage({ params }: { params: { id: string } }) {
    const results = await getProblemsByCompany(params.id)
    const problems = results?.problems
    return (
        <div className="w-full h-full pt-[4rem] sm:px-10 overflow-hidden">
            <p className="text-xl font-bold mt-7 text-primary sm:px-2 max-sm:px-4 max-sm:text-center">
                Apple
            </p>
            <div className="w-full h-[90%] mt-5 mb-2 overflow-x-auto scrollbar-hide">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[70px]"> </TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="text-right">Submission</TableHead>
                            <TableHead className="text-right">Difficulty</TableHead>
                            <TableHead className="text-right">Submissions</TableHead>
                            <TableHead className="text-right">Acceptance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            problems && problems.map((problem, index) => {
                                return (
                                    <TableRow key={index} className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:rounded-lg">
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="truncate max-w-[150px] sm:max-w-[200px]">
                                            <Link
                                                href={problem.url}
                                                target="_blank"
                                                className="truncate block">
                                                {problem.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="default" variant="link">
                                                <FileCheck />
                                            </Button>
                                        </TableCell>
                                        <TableCell
                                            className={`text-right ${getDifficultyColor(problem.difficulty)}`}
                                        >
                                            {problem.difficulty}
                                        </TableCell>
                                        <TableCell className="text-right">{problem.acceptanceRate}</TableCell>
                                        <TableCell className="text-right">{problem.submissions}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
