import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return redirect("/");
  }
  return (
      <main className="w-full h-svh overflow-hidden">{children}</main>
  );
};

export default AdminLayout;
