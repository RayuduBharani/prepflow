"use client";
import React, { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    isCompleted: UserProgress?.isCompleted ?? false,
    status: "",
    message: "",
    path: path,
  });
  
  useEffect(() => {
    if (state.message && state.status) {
      toast(state.status, {
        description: state.message,
        className:
          state.status === "Success"
            ? `dark:bg-green-900 bg-green-600`
            : `dark:bg-red-900 bg-red-600`,
      });
    }
    else if (state.status == "Error") {
      toast(state.status, {
        description: state.message,
        className:
          state.status === "Error"
            ? `dark:bg-green-900 bg-green-600`
            : `dark:bg-red-900 bg-red-600`,
      });
    }
  }, [state]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await submitUserProblem(state, formData);
      setState({
        ...result,
        isCompleted: result.isCompleted ?? false,
      });
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Something went wrong",
        className: "dark:bg-red-900 bg-red-600",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form action={handleSubmit} className="grid place-content-center">
      <input type="hidden" name="problemslug" defaultValue={slug} />
      <input type="hidden" name="userid" defaultValue={userId} />
      <Checkbox
        type="submit"
        aria-label="Progress Checkbox"
        className="mx-2"
        disabled={isLoading}
        defaultChecked={UserProgress?.isCompleted ?? false}
        name="isCompleted"
      />
    </Form>
  );
};

export default UserProblemForm;