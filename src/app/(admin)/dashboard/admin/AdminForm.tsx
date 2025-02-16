"use client";
import React, { useActionState } from "react";
import { changeToAdmin } from "@/actions/actions";
import { dropTables, seedData } from "@/actions/seedAction";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CloudUpload, DatabaseZap } from "lucide-react";
import Form from "next/form";

const AdminForm = () => {
  // State and action for changing user role
  const [changeRoleState, changeRoleAction, isChangeRolePending] =
    useActionState(changeToAdmin, null);

  // State and action for seeding data
  const [seedState, seedAction, isSeedPending] = useActionState(seedData, null);

  // State and action for dropping tables
  const [dropTablesState, dropTablesAction, isDropTablesPending] =
    useActionState(dropTables, null);

  return (
    <div className="flex py-2 w-full max-sm:flex-col gap-2">
      {/* Form to Change Role */}
      <Form action={changeRoleAction} className="flex max-sm:w-full mr-auto gap-3">
        <Input
          name="email"
          className="h-10 md:w-[20rem] bg-muted"
          type="email"
          placeholder="Enter user email"
          required
        />
        <Button
          size="sm"
          className="text-xs"
          icon={ShieldCheck}
          iconPlacement="right"
          effect="expandIcon"
          disabled={isChangeRolePending}
          type="submit"
        >
          {isChangeRolePending ? "Processing..." : "Change Role"}
        </Button>
      </Form>
      {changeRoleState?.error && <p className="text-xs text-red-500">{changeRoleState.error}</p>}
      {changeRoleState?.success && <p className="text-xs text-green-500">{changeRoleState.success}</p>}

      {/* Form to Seed Data */}
      <Form action={seedAction} className="flex flex-col gap-3">
        <Button
          size="sm"
          className="text-xs"
          type="submit"
          iconPlacement="right"
          effect="expandIcon"
          icon={CloudUpload}
          disabled={isSeedPending}
        >
          {isSeedPending ? "Seeding..." : "Seed Data"}
        </Button>
        {seedState && (
        <div className="text-xs mt-2">
          <p className="text-blue-500">{seedState.message}</p>
          <p className="text-gray-700">
            Processed: {seedState.processed} / {seedState.total}
          </p>
        </div>
      )}
      </Form>


      {/* Form to Drop Tables */}
      <Form action={dropTablesAction} className="flex flex-col gap-3">
        <Button
          size="sm"
          variant="destructive"
          className="text-xs"
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
  );
};

export default AdminForm;
