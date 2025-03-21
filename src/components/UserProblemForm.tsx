"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { submitUserProblem } from "@/actions/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Define types
interface UserProgress {
  isCompleted: boolean;
}

interface UserProblemFormProps {
  slug: string;
  userId: string;
  UserProgress?: UserProgress;
}

// Utility function for toast styles
const getToastClassName = (status: "Success" | "Error"): string =>
  status === "Success"
    ? "dark:bg-green-900 bg-green-600"
    : "dark:bg-red-900 bg-red-600";

const UserProblemForm: React.FC<UserProblemFormProps> = ({
  slug,
  userId,
  UserProgress,
}) => {
  const pathRef = useRef(usePathname());
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    UserProgress?.isCompleted ?? false
  );
  const [isDisabled, setIsDisabled] = useState(false);

  // Memoize toast notification
  const showToast = useCallback((status: "Success" | "Error", message: string) => {
    toast(status, {
      description: message,
      className: getToastClassName(status),
    });
  }, []);

  // Memoize form submission logic
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isLoading || isDisabled) return;

      setIsLoading(true);
      setIsDisabled(true);

      try {
        const formData = new FormData();
        formData.append("problemslug", slug);
        formData.append("userid", userId);
        formData.append("isCompleted", String(isCompleted));

        const result = await submitUserProblem(
          { isCompleted, path: pathRef.current },
          formData
        );

        if (result.status === "Success") {
          setIsCompleted(result.isCompleted ?? isCompleted);
          showToast("Success", result.message);
        } else {
          showToast("Error", result.message);
        }
      } catch (error) {
        console.error("Submission error:", error);
        showToast("Error", "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [isCompleted, isLoading, isDisabled, slug, userId, showToast]
  );

  // Cooldown effect
  useEffect(() => {
    if (isDisabled) {
      const timer = setTimeout(() => setIsDisabled(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isDisabled]);

  return (
    <form onSubmit={handleSubmit} className="grid place-content-center">
      <input type="hidden" name="problemslug" value={slug} />
      <input type="hidden" name="userid" value={userId} />
      <Checkbox
        aria-label="Progress Checkbox"
        className="mx-2"
        disabled={isLoading || isDisabled}
        checked={isCompleted}
        onCheckedChange={(checked: boolean) => {
          setIsCompleted(checked);
          // Trigger form submission on change
          const form = document.querySelector(
            `form:has([name="problemslug"][value="${slug}"])`
          ) as HTMLFormElement;
          if (form) form.requestSubmit();
        }}
        name="isCompleted"
      />
    </form>
  );
};

export default React.memo(UserProblemForm);