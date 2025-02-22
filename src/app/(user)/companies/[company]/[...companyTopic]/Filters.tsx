"use client"

import React, { FormEvent, useEffect } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from 'next/navigation'

export default function Filters() {
    const router = useRouter()
    const handleChange = (value : string) => {
        // console.log(value)
        router.push(`?difficulty=${value}`)
    }
    return (
        <RadioGroup
            onValueChange={handleChange}
            defaultValue="All" 
            className='flex flex-wrap gap-6'>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="All" id="All" />
                <Label htmlFor="All">All</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="EASY" id="Easy" />
                <Label htmlFor="Easy" className='text-green-500'>Easy</Label>
            </div>

            <div className="flex items-center space-x-2">
                <RadioGroupItem value="MEDIUM" id="Medium" />
                <Label htmlFor="Medium" className='text-orange-400'>Medium</Label>
            </div>

            <div className="flex items-center space-x-2">
                <RadioGroupItem value="HARD" id="Hard" />
                <Label htmlFor="Hard" className='text-red-500'>Hard</Label>
            </div>
        </RadioGroup>
    )
}
