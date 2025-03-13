"use client";
import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { submitUserProblem } from "@/actions/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Define types
interface UserProgress {
  isCompleted?: boolean;
  userId?: string;
}

interface UserProblemFormProps {
  slug: string;
  userId: string;
  UserProgress: UserProgress;
}

// Utility to determine toast styles
const getToastClassName = (status: string) =>
  status === "Success"
    ? "dark:bg-green-900 bg-green-600"
    : "dark:bg-red-900 bg-red-600";

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
    path,
  });

  // Memoize toast notification logic
  const showToast = useCallback((status: string, message: string) => {
    toast(status, {
      description: message,
      className: getToastClassName(status),
    });
  }, []);

  // Optimize useEffect
  useEffect(() => {
    if (state.status && state.message) {
      showToast(state.status, state.message);
    }
  }, [state.status, state.message, showToast]);

  // Memoize handleSubmit
  const handleSubmit = useCallback(
    async (formData: FormData) => {
      setIsLoading(true);
      try {
        const result = await submitUserProblem(state, formData);
        setState((prev) => ({
          ...prev,
          ...result,
          isCompleted: result.isCompleted ?? false,
        }));
      } catch (error) {
        console.error("Submission error:", error);
        showToast("Error", "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [state, showToast]
  );

  return (
    <form action={handleSubmit} className="grid place-content-center">
      <input type="hidden" name="problemslug" value={slug} />
      <input type="hidden" name="userid" value={userId} />
      <Checkbox
        type="submit"
        aria-label="Progress Checkbox"
        className="mx-2"
        disabled={isLoading}
        checked={state.isCompleted}
        onCheckedChange={(checked) =>
          setState((prev) => ({ ...prev, isCompleted: !!checked }))
        }
        name="isCompleted"
      />
    </form>
  );
};

export default UserProblemForm;