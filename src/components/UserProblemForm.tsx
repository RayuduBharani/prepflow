"use client";
import React, { useActionState, useState } from "react";
import Form from "next/form";
import { submitUserProblem } from "@/actions/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface UserProgress {
  isCompleted?: boolean;
  userId?: string;
}

interface UserProblemFormProps {
  slug: string;
  userId: string;
  UserProgress: UserProgress;
}

const UserProblemForm: React.FC<UserProblemFormProps> = ({
  slug,
  userId,
  UserProgress,
}) => {
  const path = usePathname();
  const [state, formAction, isPending] = useActionState(submitUserProblem, {
    isCompleted: UserProgress?.isCompleted ?? false,
    status: "",
    message: "",
    path: path,
  });
  const [message, setMessage] = useState("");

  // Handle toast notification when state changes
  if (state?.message && state.message !== message) {
    setMessage(state.message);
    toast(state.status, {
      description: state.message,
      className:
        state.status === "Success"
          ? `dark:bg-green-900 bg-green-600`
          : undefined,
    });
  }

  return (
    <Form action={formAction} className="grid place-content-center">
      <input type="hidden" name="problemslug" defaultValue={slug} />
      <input type="hidden" name="userid" defaultValue={userId} />
      <Checkbox
        type="submit"
        aria-label="Progress Checkbox"
        className="mx-2"
        disabled={isPending}
        defaultChecked={UserProgress?.isCompleted ?? false}
        name="isCompleted"
      />
    </Form>
  );
};

export default UserProblemForm;