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
import { getDifficultyColor } from "@/lib/utils";
import Link from "next/link";
const questions = [
    {
        "Title": "Two Sum",
        "Submission": "https://leetcode.com/problems/two-sum",
        "Difficulty": "Easy",
        "Submissions": "12.3M",
        "Acceptance": "45.2%"
    },
    {
        "Title": "Add Two Numbers",
        "Submission": "https://leetcode.com/problems/add-two-numbers",
        "Difficulty": "Medium",
        "Submissions": "8.9M",
        "Acceptance": "37.1%"
    },
    {
        "Title": "Longest Substring Without Repeating Characters",
        "Submission": "https://leetcode.com/problems/longest-substring-without-repeating-characters",
        "Difficulty": "Medium",
        "Submissions": "7.4M",
        "Acceptance": "30.2%"
    },
    {
        "Title": "Median of Two Sorted Arrays",
        "Submission": "https://leetcode.com/problems/median-of-two-sorted-arrays",
        "Difficulty": "Hard",
        "Submissions": "3.2M",
        "Acceptance": "29.5%"
    },
    {
        "Title": "Longest Palindromic Substring",
        "Submission": "https://leetcode.com/problems/longest-palindromic-substring",
        "Difficulty": "Medium",
        "Submissions": "6.5M",
        "Acceptance": "31.8%"
    },
    {
        "Title": "Container With Most Water",
        "Submission": "https://leetcode.com/problems/container-with-most-water",
        "Difficulty": "Medium",
        "Submissions": "4.1M",
        "Acceptance": "56.7%"
    },
    {
        "Title": "Valid Parentheses",
        "Submission": "https://leetcode.com/problems/valid-parentheses",
        "Difficulty": "Easy",
        "Submissions": "11.8M",
        "Acceptance": "39.3%"
    },
    {
        "Title": "Merge Two Sorted Lists",
        "Submission": "https://leetcode.com/problems/merge-two-sorted-lists",
        "Difficulty": "Easy",
        "Submissions": "9.3M",
        "Acceptance": "49.0%"
    },
    {
        "Title": "Search in Rotated Sorted Array",
        "Submission": "https://leetcode.com/problems/search-in-rotated-sorted-array",
        "Difficulty": "Medium",
        "Submissions": "5.7M",
        "Acceptance": "34.1%"
    },
    {
        "Title": "Climbing Stairs",
        "Submission": "https://leetcode.com/problems/climbing-stairs",
        "Difficulty": "Easy",
        "Submissions": "7.6M",
        "Acceptance": "47.9%"
    }
]


export default function QuestionPage({ params }: { params: { id: string } }) {
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
                            questions.map((question, index) => {
                                return (
                                    <TableRow key={index} className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:rounded-lg">
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="truncate max-w-[150px] sm:max-w-[200px]">
                                            <Link
                                                href={question.Submission}
                                                target="_blank"
                                                className="truncate block">
                                                {question.Title}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="default" variant="link">
                                                <FileCheck />
                                            </Button>
                                        </TableCell>
                                        <TableCell
                                            className={`text-right ${getDifficultyColor(question.Difficulty)}`}
                                        >
                                            {question.Difficulty}
                                        </TableCell>
                                        <TableCell className="text-right">{question.Acceptance}</TableCell>
                                        <TableCell className="text-right">{question.Submissions}</TableCell>
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
