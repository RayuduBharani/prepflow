import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Loading from "../loading";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return redirect("/");
  }
  return (
    <Suspense fallback={<Loading />}>
      <main className="w-full h-svh overflow-hidden">{children}</main>
    </Suspense>
  );
};

export default AdminLayout;
