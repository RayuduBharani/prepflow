'use client'

import { allSeed } from "@/actions/allSeed"
import { Button } from "@/components/ui/button"
import { CloudUpload } from "lucide-react"
import Form from "next/form"
import { useActionState } from "react"
import { toast } from "sonner"

const SeedButton = () => {
  const [state, formAction, isPending] = useActionState(allSeed, {message : ''})
  toast(state.message)
  return (
    <Form className="mt-2" action={formAction}>
      <Button variant={'outline'} disabled = {isPending} icon={CloudUpload} iconPlacement="left" effect={'expandIcon'} type="submit">Seed</Button>
    </Form>
  )
}

export default SeedButton