'use client'
import React, { useActionState, useEffect, useState } from "react";
import Form from "next/form";
import { submitUserProblem } from "@/app/actions/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface UserProblemFormProps {
  slug: string;
  userId: string;
  UserProgress: {
    isCompleted?: boolean;
    userId?: string;
  };
}

const UserProblemForm : React.FC<UserProblemFormProps> = ({slug, userId, UserProgress}) => {
  const [state, formAction, isPending] = useActionState(submitUserProblem, {isCompleted : (UserProgress && UserProgress.isCompleted), status : '', message :''})
  const [message, setMessage] = useState("");

useEffect(() => {
  if (state?.message && state.message !== message) {
    setMessage(state.message);
    toast(state.status, { description: state.message });
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
