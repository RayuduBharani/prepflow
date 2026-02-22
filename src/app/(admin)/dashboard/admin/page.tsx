import React from "react";
import prisma from "@/prisma";
import AdminForm from "./AdminForm";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Users, ShieldCheck, User } from "lucide-react";

async function Admin() {
  const usersData = await prisma.user.findMany({
    orderBy: [{ role: "desc" }, { createdAt: "desc" }],
  });

  const adminCount = usersData.filter((u) => u.role === "ADMIN").length;
  const userCount = usersData.length;

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-[5rem] px-3 sm:px-6 bg-background">
      {/* Page Header */}
      <div className="w-full max-w-4xl mb-6">
        <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 bg-primary/5 shadow-xl">

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-primary-foreground/60 text-sm mt-1">
                Manage users · Seed data · Control access
              </p>
            </div>

            {/* Stats pills */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-primary-foreground text-xs font-medium">
                <Users size={13} />
                <span>{userCount} Users</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-primary-foreground text-xs font-medium">
                <ShieldCheck size={13} />
                <span>{adminCount} Admins</span>
              </div>
            </div>
          </div>

          {/* Admin actions strip */}
          <div className="relative z-10 mt-5 pt-5 border-t border-white/15">
            <AdminForm />
          </div>
        </div>
      </div>

      {/* Section label */}
      <div className="w-full max-w-4xl flex items-center gap-3 mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          All Users
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
      </div>

      {/* Users Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-10">
        {usersData.map((user) => {
          const isAdmin = user.role === "ADMIN";
          return (
            <div
              key={user.id}
              className={`group relative flex flex-col rounded-2xl p-4 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden ${isAdmin
                ? "bg-gradient-to-br from-primary/8 to-primary/3 border-primary/20 hover:border-primary/40 hover:shadow-primary/10"
                : "bg-card border-border hover:border-border/80"
                }`}
            >
              {/* Subtle gradient shine on hover for admin cards */}
              {isAdmin && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/5 to-transparent transition-opacity duration-300 pointer-events-none rounded-2xl" />
              )}

              <div className="relative flex items-center gap-3">
                {/* Avatar */}
                <div className="shrink-0 relative">
                  {user.image ? (
                    <Image
                      src={user.image.replace("s96-c", "s256-c")}
                      height={48}
                      width={48}
                      alt={user.name || ""}
                      className="rounded-full object-cover ring-2 ring-border group-hover:ring-primary/30 transition-all duration-300"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center ring-2 ring-border">
                      <User size={20} className="text-muted-foreground" />
                    </div>
                  )}
                  {/* Online-style role indicator */}
                  {isAdmin && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-primary to-primary/70 ring-2 ring-card flex items-center justify-center">
                      <ShieldCheck size={7} className="text-primary-foreground" />
                    </span>
                  )}
                </div>

                {/* User info */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h3 className="text-sm font-semibold truncate leading-tight">
                    {user.name || "Unnamed User"}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-3 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />

              {/* Footer */}
              <div className="flex items-end justify-between gap-2 mt-auto">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[10px] text-muted-foreground/70">
                    Joined {formatDate(user.createdAt)}
                  </p>
                  {user.lastLogin && (
                    <p className="text-[10px] text-muted-foreground/70">
                      Last Login {formatDate(user.lastLogin)}
                    </p>
                  )}
                </div>

                {isAdmin ? (
                  <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm shadow-primary/20 tracking-wide">
                    ADMIN
                  </span>
                ) : (
                  <span className="shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground tracking-wide">
                    USER
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Admin;
