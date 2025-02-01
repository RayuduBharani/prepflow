"use client"

import React, { useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'

export default function WorkType() {
    const [open, setOpen] = useState(false)
    const searchParam = useSearchParams()
    const router = useRouter()

    const handleSearchParams = (workType: string, isChecked: boolean) => {
        const params = new URLSearchParams(searchParam.toString())
        const currentWorkTypes = params.getAll('workType')

        if (isChecked) {
            params.append('workType', workType)
        }
        else {
            params.delete('workType')
            currentWorkTypes.forEach(type => {
                if (type !== workType) {
                    params.append('workType', type)
                }
            })
        }

        const queryString = params.toString()
        router.push(`/jobs${queryString ? `?${queryString}` : ""}`)
    }

    const isChecked = (workType: string) => {
        const workTypes = searchParam.getAll('workType')
        return workTypes.includes(workType)
    }

    return (
        <div className="space-y-4">
            <div className="font-semibold cursor-pointer flex items-center justify-between"
                onClick={() => setOpen(!open)}
            >
                <p>WorkType</p>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={15} />
                </motion.div>
            </div>
            <AnimatePresence>
                {
                    open && (
                        <motion.div className="space-y-3"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            exit={{ height: 0, opacity: 0 }}>
                            {['Remote', 'Hybrid', 'On-site'].map((type) => (
                                <div className="flex items-center space-x-2" key={type}>
                                    <Checkbox 
                                        id={type}
                                        checked={isChecked(type)}
                                        onCheckedChange={(isChecked) => handleSearchParams(type, isChecked as boolean)}
                                    />
                                    <label htmlFor={type} className="text-sm leading-none">
                                        {type}
                                    </label>
                                </div>
                            ))}
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    )
}
