'use client'
import React, { useActionState, useEffect, useState } from "react";
import Form from "next/form";
import { submitUserProblem } from "@/actions/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";

interface UserProblemFormProps {
  slug: string;
  userId: string;
  UserProgress: {
    isCompleted?: boolean;
    userId?: string;
  };
}

const UserProblemForm : React.FC<UserProblemFormProps> = ({slug, userId, UserProgress}) => {
  const {toast} = useToast()
  const path = usePathname()
  const [state, formAction, isPending] = useActionState(submitUserProblem, {isCompleted : (UserProgress && UserProgress.isCompleted), status : '', message :'', path : path})
  const [message, setMessage] = useState("");

useEffect(() => {
  if (state?.message && state.message !== message) {
    setMessage(state.message);
    toast({
      title : state.status,
      description : state.message,
      variant : state.status === 'Success' ? 'default' : 'destructive',
      className : state.status === 'Success' ? 'dark:bg-green-900 bg-green-600' : ''
    })
  }
}, [state, message]);
  return (
    <Form
      action={formAction} className="grid place-content-center"
    >
      <input hidden name="problemslug" defaultValue={slug} />
      <input hidden name="userid" defaultValue={userId} />
      <Checkbox
        type="submit"
        className="mx-2"
        disabled = {isPending}
        checked={UserProgress ? UserProgress.isCompleted : false}
      />
    </Form>
  );
};

export default UserProblemForm;
