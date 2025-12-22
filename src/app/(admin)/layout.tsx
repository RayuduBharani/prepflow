import {auth} from '@/auth'
import { getSession } from '@/auth-client';
import prisma from '@/prisma';
import { redirect } from "next/navigation";
import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  const user = await prisma.user.findFirst({where : {id : session?.userId}})
  if (!session || !user || user?.role !== "ADMIN") {
    return redirect("/");
  }
  return (
      <main className="w-full min-h-svh">{children}</main>
  );
};

export default AdminLayout;
