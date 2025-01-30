"use client"

import React, {useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from "framer-motion"
import { useRouter, useSearchParams } from 'next/navigation'
export default function Jobtype() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const isChecked = (type : string) => {
        const jobTypes = searchParams.getAll('jobType')
        return jobTypes.includes(type)
    }

    const handleCheck = (isChecked : boolean , type : string ) => {
        const params = new URLSearchParams(searchParams.toString())
        const currentJobTypes = params.getAll('jobType')

        if(isChecked){
            params.append('jobType', type)
        }
        else{
            params.delete('jobType')
            currentJobTypes.forEach(jobType => {
                if(jobType !== type){
                    params.append('jobType', jobType)
                }
            })
        }

        const queryString = params.toString()
        console.log(queryString)
        router.push(`/jobs${queryString ? `?${queryString}` : ""}`)
    }

    return (
        <div className='space-y-5'>
            <motion.div className='w-full flex justify-between items-center cursor-pointer'
                onClick={() => setOpen(!open)}
            >
                <p className="font-semibold">Job Type</p>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={15} />
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {
                    open && (
                        <motion.div className="space-y-4 overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="space-y-3 pt-2">
                                {['Full-time', 'Part-time', 'Contract', 'Freelance'].map((type) => (
                                    <div className="flex items-center space-x-2" key={type}>
                                        <Checkbox 
                                            id={type} 
                                            checked={isChecked(type)}
                                            onCheckedChange={(isChecked)=> handleCheck(isChecked as boolean , type)}
                                        />
                                        <label htmlFor={type} className="text-sm leading-none">
                                            {type}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    )
}
