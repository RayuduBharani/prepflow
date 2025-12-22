import React from "react";
import prisma from "@/prisma";
import AdminForm from "./AdminForm";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

async function Admin() {
  const usersData = await prisma.user.findMany({
    orderBy: [{ role: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-[5rem] px-2 sm:px-6 bg-background">
      <AdminForm />

      <h1 className="text-2xl font-bold mt-4 mb-2 text-center text-foreground">
        Users Data
      </h1>

      {/* Responsive Users Grid */}
      <div className="w-full max-w-4xl flex flex-wrap gap-2">
        {usersData.map((user) => (
          <div
            key={user.id}
            className="flex flex-col min-w-xs flex-1 justify-between rounded-xl bg-card p-4 shadow transition-shadow border border-border hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              {user.image && (
                <div className="shrink-0">
                  <Image
                    src={user.image.replace("s96-c", "s256-c")}
                    height={56}
                    width={56}
                    alt={user.name || ""}
                    className="rounded-full border border-border object-cover"
                    sizes="(max-width: 600px) 48px, 56px"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <h1 className="text-base font-semibold">{user.name}</h1>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs flex gap-2 text-muted-foreground">
                  <span>{formatDate(user.createdAt)}</span>
                </p>
                {user.lastLogin && (
                    <p className="rounded-full text-xs text-nowrap">Last Login {formatDate(user.lastLogin)}</p>
                  )}
              </div>
            </div>
            {user.role === "ADMIN" && (
              <span className="mt-auto text-xs font-semibold px-2 py-1 rounded-full w-fit bg-primary text-white">
                {user.role}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
