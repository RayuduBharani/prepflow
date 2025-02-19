import { getLeetcodeTopicQuestions } from '@/actions/company-actions'
import React from 'react'

export default async function CompanyTopicQuestions({params} : {params : {company: string, companyTopic: string}}) {
  const {company , companyTopic} = await params
  const data = await getLeetcodeTopicQuestions(company , companyTopic)
  return (
    <div className="pt-[5rem] max-sm:px-3 px-6">
     
    </div>
  )
}
