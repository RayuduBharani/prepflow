"use client";
import React, { useActionState } from "react";
import { changeToAdmin } from "@/actions/actions";
import { dropTables, seedData } from "@/actions/seedAction";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CloudUpload, DatabaseZap, CheckCircle2, XCircle } from "lucide-react";
import Form from "next/form";

const AdminForm = () => {
  const [changeRoleState, changeRoleAction, isChangeRolePending] =
    useActionState(changeToAdmin, null);

  const [seedState, seedAction, isSeedPending] = useActionState(seedData, null);

  const [, dropTablesAction, isDropTablesPending] =
    useActionState(dropTables, null);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Change Role + Seed + Drop in one row */}
      <div className="flex flex-wrap items-start gap-2 w-full">
        {/* Change Role Form */}
        <Form action={changeRoleAction} className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Input
            name="email"
            className="h-9 flex-1 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-white/30 text-sm"
            type="email"
            placeholder="Enter user email..."
            required
          />
          <Button
            size="sm"
            className="h-9 shrink-0 text-xs bg-white/15 hover:bg-white/25 border border-white/20 text-primary-foreground shadow-none"
            icon={ShieldCheck}
            iconPlacement="right"
            effect="expandIcon"
            disabled={isChangeRolePending}
            type="submit"
          >
            {isChangeRolePending ? "Processing..." : "Make Admin"}
          </Button>
        </Form>

        {/* Seed Data */}
        <Form action={seedAction}>
          <Button
            size="sm"
            className="h-9 text-xs bg-white/15 hover:bg-white/25 border border-white/20 text-primary-foreground shadow-none"
            type="submit"
            iconPlacement="right"
            effect="expandIcon"
            icon={CloudUpload}
            disabled={isSeedPending}
          >
            {isSeedPending ? "Seeding..." : "Seed Data"}
          </Button>
        </Form>

        {/* Drop Tables */}
        <Form action={dropTablesAction}>
          <Button
            size="sm"
            variant="destructive"
            className="h-9 text-xs opacity-80 hover:opacity-100"
            type="submit"
            icon={DatabaseZap}
            iconPlacement="right"
            effect="expandIcon"
            disabled={isDropTablesPending}
          >
            {isDropTablesPending ? "Dropping..." : "Drop Tables"}
          </Button>
        </Form>
      </div>

      {/* Feedback messages */}
      <div className="flex flex-wrap gap-2 empty:hidden">
        {changeRoleState?.error && (
          <div className="flex items-center gap-1.5 text-xs text-red-300 bg-red-500/15 border border-red-500/25 rounded-lg px-3 py-1.5">
            <XCircle size={12} />
            {changeRoleState.error}
          </div>
        )}
        {changeRoleState?.success && (
          <div className="flex items-center gap-1.5 text-xs text-green-300 bg-green-500/15 border border-green-500/25 rounded-lg px-3 py-1.5">
            <CheckCircle2 size={12} />
            {changeRoleState.success}
          </div>
        )}
        {seedState && (
          <div className="flex items-center gap-1.5 text-xs text-blue-300 bg-blue-500/15 border border-blue-500/25 rounded-lg px-3 py-1.5">
            <CloudUpload size={12} />
            {seedState.message} · {seedState.processed}/{seedState.total}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminForm;
