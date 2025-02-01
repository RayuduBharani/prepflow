"use client"
import React, { useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Duration() {
    const [open, setOpen] = useState(false)
    const searchParam = useSearchParams()
    const router = useRouter()

    const handleSearchParams = (duration: string, isChecked: boolean) => {
        const params = new URLSearchParams(searchParam.toString())
        const currentDuration = params.getAll('duration')

        if (isChecked) {
            params.append('duration', duration)
        }
        else {
            params.delete('duration')
            currentDuration.forEach(dur => {
                if (dur !== duration) {
                    params.append('duration', dur)
                }
            })
        }

        const queryString = params.toString()
        router.push(`/jobs${queryString ? `?${queryString}` : ""}`)
    }

    const isChecked = (duration: string) => {
        const durations = searchParam.getAll('duration')
        return durations.includes(duration)
    }

    return (
        <div className="space-y-4">

            <div className="font-semibold flex items-center justify-between cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <p>Duration</p>
                <motion.div className='cursor-pointer'
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
                            exit={{ height: 0, opacity: 0 }}
                        >
                            {['1-3 months', '3-6 months', '6+ months'].map((duration) => (
                                <div className="flex items-center space-x-2" key={duration}>
                                    <Checkbox 
                                        id={duration}
                                        checked={isChecked(duration)}
                                        onCheckedChange={(isChecked) => handleSearchParams(duration, isChecked as boolean)}
                                    />
                                    <label htmlFor={duration} className="text-sm leading-none">
                                        {duration}
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
