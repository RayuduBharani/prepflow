'use client'
import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button'
import {toast} from 'sonner'

export default function FormButton({ formtype } : {formtype : string}) {
    const status = useFormStatus()
    const handleSubmit = () => {
        if (status.pending == false) {
            toast.success('Success! 👍')
        }
    }
    return (
        <Button type="submit" size={"lg"} onClick={handleSubmit} disabled={status.pending}>{status.pending ? 'posting...' : `Post ${formtype}`}</Button>
    )
}