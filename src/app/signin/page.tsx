import { Button } from "@/components/ui/button";
import React from "react";
import Form from "next/form";
import Sonner from "@/components/Sonner";
import Google from "@/components/icons/Google";
import Github from "@/components/icons/Github";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { getSession, signIn } from "@/auth-client";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const { callbackUrl } = await searchParams;
  // Sanitise: only allow same-origin relative paths
  const safeCallback =
    callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/";

  if (await getSession()) return redirect(safeCallback);
  return (
    <>
      <div className="w-full h-full flex items-center justify-center">
        <div className="border flex flex-col rounded-md shadow-xl gap-2 p-4">
          <h1 className="text-xl font-bold">
            PrepFlow <span className="text-primary text-xs">Login</span>
          </h1>
          <Separator className="mb-4" />
          <div className="flex gap-2 w-full justify-between">
            <Form action={async () => {
              'use server'
              await signIn('google', safeCallback)
            }}>
              <Button
                className="text-xs"
                size={"sm"}
                effect={"expandIcon"}
                iconPlacement="right"
                icon={Google}
                variant={"secondary"}
                type="submit"
              >
                Signin with Google
              </Button>
            </Form>
            <Form action={async () => {
              'use server'
              await signIn('github', safeCallback)
            }}>
              <Button
                className="text-xs"
                size={"sm"}
                variant={"default"}
                effect={"expandIcon"}
                iconPlacement="right"
                icon={Github}
                type="submit"
              >
                Signin with Github
              </Button>
            </Form>
          </div>
        </div>
      </div>
      <Sonner />
    </>
  );
};

export default page;
