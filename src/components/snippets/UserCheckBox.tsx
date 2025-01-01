"use client"
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox'
import type { Session } from "next-auth";
import { toast } from '@/hooks/use-toast';
import { createUserProgress } from '@/app/actions/actions';
export default function UserCheckBox({ session, question, info }:
    {
        session: Session | null,
        question: {
            id: number,
            title: string,
            difficulty: string,
            acceptanceRate: number,
            mainTopics: {
                name: string
            }[],
            companyTags: {
                name: string
            }[],
            url: string
        },
        info: {
            id: number,
            userId: string,
            problemId: number,
            isCompleted: boolean,
            completedAt: Date | null,
            updatedAt: Date
        }[]
    }) {
    const [checked, setChecked] = useState(info.some((item) => item.problemId === question.id && item.isCompleted));
    const handleCheck = async () => {
        setChecked((prev) => !prev)
        if (session?.user?.id) {
            const data = await createUserProgress(session.user.id, question.id, !checked);
            if (data?.isCompleted) {
                toast({
                    title: "Success",
                    description: `Progress for ${question.title} has been updated. 👌`,
                    variant: "default",
                    duration: 3000
                })
            }
            else {
                toast({
                    title: "Removed",
                    description: "Progress has been removed. 🗑️" ,
                    variant: "destructive",
                    duration: 3000
                })
            }
        }
        else {
            console.log("User not logged in");
        }
    }
    return (
        <Checkbox checked={checked} onCheckedChange={() => handleCheck()} />
    )
}
