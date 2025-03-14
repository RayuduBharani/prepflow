'use client'

import { allSeed } from "@/actions/allSeed"
import { Button } from "@/components/ui/button"
import { CloudUpload } from "lucide-react"
import Form from "next/form"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

const SeedButton = () => {
  const [state, formAction, isPending] = useActionState(allSeed, { message: '' })

  useEffect(() => {
    if (state.message) {
      toast(state.message)
    }
  }, [state])

  return (
    <Form action={formAction} className="mt-2">
      <Button
        variant="outline"
        disabled={isPending}
        type="submit"
        icon={CloudUpload}
        iconPlacement="left"
        effect={'shineHover'}
      >
        Seed
      </Button>
    </Form>
  )
}

export default SeedButton