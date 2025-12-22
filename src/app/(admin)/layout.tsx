import {auth} from '@/auth'
import { getSession } from '@/auth-client';
import { redirect } from "next/navigation";
import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  if (session?.userId !== "ADMIN") {
    return redirect("/");
  }
  return (
      <main className="w-full min-h-svh">{children}</main>
  );
};

export default AdminLayout;
