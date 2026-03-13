"use client";
import React, { useActionState } from "react";
import { changeToAdmin } from "@/actions/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import Form from "next/form";

const AdminForm = () => {
  const [changeRoleState, changeRoleAction, isChangeRolePending] =
    useActionState(changeToAdmin, null);

  const inputClassName =
    "h-9 flex-1 bg-background/70 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/35 text-sm";
  const buttonClassName =
    "h-9 shrink-0 text-xs bg-primary/10 hover:bg-border-primary/20 border border-primary/25 text-foreground shadow-none";
  const feedbackBaseClassName =
    "flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 border";

  const errorMessage = changeRoleState?.error;
  const successMessage = changeRoleState?.success;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap items-start gap-2 w-full">
        <Form action={changeRoleAction} className="flex items-center gap-2 flex-1 min-w-60">
          <Input
            name="email"
            className={inputClassName}
            type="email"
            placeholder="Enter user email..."
            required
          />
          <Button
            size="sm"
            className={buttonClassName}
            icon={ShieldCheck}
            iconPlacement="right"
            effect="expandIcon"
            disabled={isChangeRolePending}
            type="submit"
          >
            {isChangeRolePending ? "Processing..." : "Make Admin"}
          </Button>
        </Form>
      </div>

      <div className="flex flex-wrap gap-2 empty:hidden">
        {errorMessage && (
          <div
            className={`${feedbackBaseClassName} text-destructive bg-destructive/10 border-destructive/30`}
          >
            <XCircle size={12} />
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div
            className={`${feedbackBaseClassName} text-primary bg-primary/10 border-primary/30`}
          >
            <CheckCircle2 size={12} />
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminForm;
