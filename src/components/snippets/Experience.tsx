"use client"
import React, { useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

export default function Experience() {
    const searchParam = useSearchParams()
    const router = useRouter()

    const handleSearchParams = (level: string, isChecked: boolean) => {
        const params = new URLSearchParams(searchParam.toString())
        const currentExp = params.getAll('experience')

        if (isChecked) {
            params.append('experience', level)
        }
        else {
            params.delete('experience')
            currentExp.forEach(exp => {
                if (exp !== level) {
                    console.log("exp" , exp)
                    params.append('experience', exp)
                }
            })
        }

        const queryString = params.toString()
        router.push(`/jobs${queryString ? `?${queryString}` : ""}`)
    }

    const isChecked = (level: string) => {
        const experiences = searchParam.getAll('experience')
        console.log(experiences)
        return experiences.includes(level)
    }

    const [open, setOpen] = useState(false)

    return (
        <div className="space-y-4">
            <motion.div
                className="font-semibold flex justify-between items-center cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <p>Experience Level</p>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={15} />
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-3 pt-2">
                            {['Fresher', '1years', '2years', '3years', "5years"].map((level) => (
                                <div className="flex items-center space-x-2" key={level}>
                                    <Checkbox
                                        id={level}
                                        checked={isChecked(level)}
                                        onCheckedChange={(isChecked) => handleSearchParams(level, isChecked as boolean)}
                                    />
                                    <label htmlFor={level} className="text-sm leading-none">
                                        {level}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
