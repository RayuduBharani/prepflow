"use client"

import React, { useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from "framer-motion"
import { useRouter, useSearchParams } from 'next/navigation'

export default function SalaryRange() {
    const [open, setOpen] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()

    const isChecked = (range: string) => {
        const salaryRanges = searchParams.getAll('salaryRange')
        return salaryRanges.includes(range)
    }

    const checkHandler = (range: string, isChecked: boolean) => {
        const params = new URLSearchParams(searchParams.toString())
        const currentRanges = params.getAll('salaryRange')

        if (isChecked) {
            params.append('salaryRange', range)
        } else {
            params.delete('salaryRange')
            currentRanges.forEach(currentRange => {
                if (currentRange !== range) {
                    params.append('salaryRange', currentRange)
                }
            })
        }

        const queryString = params.toString()
        console.log(queryString)
        router.push(`/jobs${queryString ? `?${queryString}` : ""}`)
    }

    return (
        <>
            <div className="flex justify-between items-center cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <p className="font-semibold">Salary Range</p>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={15} />
                </motion.div>
            </div>

            <AnimatePresence>
                {
                    open &&
                    <motion.div className="space-y-3 overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        {[
                            "0-3 LPA",
                            "3-6 LPA",
                            "6-10 LPA",
                            "10-15 LPA",
                            "15-25 LPA",
                            "25 LPA+"
                        ].map((range) => (
                            <div className="flex items-center space-x-2" key={range}>
                                <Checkbox 
                                    id={range} 
                                    checked={isChecked(range)} 
                                    onCheckedChange={(checked) => checkHandler(range, checked as boolean)}
                                />
                                <label htmlFor={range} className="text-sm leading-none">
                                    {range}
                                </label>
                            </div>
                        ))}
                    </motion.div>
                }
            </AnimatePresence>
        </>
    )
}