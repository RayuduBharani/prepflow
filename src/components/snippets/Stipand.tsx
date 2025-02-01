"use client"

import React, { useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Stipand() {
    const [open, setOpen] = useState(false)
    const searchParam = useSearchParams()
    const router = useRouter()

    const handleSearchParams = (stipend: string, isChecked: boolean) => {
        const params = new URLSearchParams(searchParam.toString())
        const currentStipend = params.getAll('stipend')

        if (isChecked) {
            params.append('stipend', stipend)
        }
        else {
            params.delete('stipend')
            currentStipend.forEach(stip => {
                if (stip !== stipend) {
                    params.append('stipend', stip)
                }
            })
        }

        const queryString = params.toString()
        router.push(`/jobs${queryString ? `?${queryString}` : ""}`)
    }

    const isChecked = (stipend: string) => {
        const stipends = searchParam.getAll('stipend')
        return stipends.includes(stipend)
    }

    return (
        <div className="space-y-4">
            <div className="font-semibold cursor-pointer flex items-center justify-between"
                onClick={() => setOpen(!open)}>
                <p>Stipend</p>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}>
                    <ChevronDown size={15} />
                </motion.div>
            </div>
            <AnimatePresence>
                {open && (<motion.div className="space-y-3"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    exit={{ height: 0, opacity: 0 }}>
                    {[
                        'Unpaid',
                        'Less than 2k/-',
                        '2k-5k/-',
                        '5k-10k/-',
                        'More than 10k/-'
                    ].map((range) => (
                        <div className="flex items-center space-x-2" key={range}>
                            <Checkbox 
                                id={range}
                                checked={isChecked(range)}
                                onCheckedChange={(isChecked) => handleSearchParams(range, isChecked as boolean)}
                            />
                            <label htmlFor={range} className="text-sm leading-none">
                                {range}
                            </label>
                        </div>
                    ))}
                </motion.div>)}
            </AnimatePresence>
        </div>
    )
}
