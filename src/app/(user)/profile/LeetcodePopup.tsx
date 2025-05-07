// components/LeetCodePopup.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define the user type
interface User {
  user: {
    leetcode_username?: string | null;
  };
}

// Form schema with Zod
const formSchema = z.object({
  leetcode_username: z.string().min(1, "LeetCode username is required"),
});

// Infer form data type from schema
type FormData = z.infer<typeof formSchema>;

interface LeetCodePopupProps {
  user: User | null;
  onClose?: () => void;
}

export default function LeetCodePopup({ user, onClose }: LeetCodePopupProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Initialize form with react-hook-form and TypeScript
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { leetcode_username: "" },
  });

  useEffect(() => {
    if (!user?.user?.leetcode_username) {
      setIsOpen(true);
    }
  }, [user]);

  const handleSubmit = async (data: FormData) => {
    // Call server action to save username
    const result = await saveLeetCodeUsername(data);
    if (result.success) {
      setIsOpen(false);
      if (onClose) onClose();
    } else {
      form.setError("leetcode_username", { message: result.error });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Add LeetCode Username</DialogTitle>
          <DialogDescription>
            Please provide your LeetCode username to link your profile.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="leetcode_username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LeetCode Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter LeetCode username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}