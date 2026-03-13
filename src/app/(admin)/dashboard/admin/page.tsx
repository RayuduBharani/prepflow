import prisma from "@/prisma";
import AdminForm from "./AdminForm";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Users, ShieldCheck, User } from "lucide-react";

async function Admin() {
  const usersData = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      lastLogin: true,
    },
    orderBy: [{ role: "desc" }, { createdAt: "desc" }],
  });

  const { adminCount, userCount } = usersData.reduce(
    (counts, user) => {
      counts.userCount += 1;
      if (user.role === "ADMIN") counts.adminCount += 1;
      return counts;
    },
    { adminCount: 0, userCount: 0 }
  );

  const baseCardClass =
    "group relative flex flex-col rounded-2xl p-4 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden";
  const adminCardClass =
    "bg-primary/10 border-primary/25 hover:border-primary/40";
  const userCardClass = "bg-card border-border hover:border-border/80";

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-20 px-3 sm:px-6 bg-background">
      {/* Page Header */}
      <div className="w-full max-w-4xl mb-6">
        <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 bg-card border border-border shadow-sm">

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage users · Seed data · Control access
              </p>
            </div>

            {/* Stats pills */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-muted/70 border border-border rounded-full px-3 py-1.5 text-foreground text-xs font-medium">
                <Users size={13} />
                <span>{userCount} Users</span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/70 border border-border rounded-full px-3 py-1.5 text-foreground text-xs font-medium">
                <ShieldCheck size={13} />
                <span>{adminCount} Admins</span>
              </div>
            </div>
          </div>

          {/* Admin actions strip */}
          <div className="relative z-10 mt-5 pt-5 border-t border-border/60">
            <AdminForm />
          </div>
        </div>
      </div>

      {/* Section label */}
      <div className="w-full max-w-4xl flex items-center gap-3 mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          All Users
        </h2>
        <div className="flex-1 h-px bg-linear-to-r from-border to-transparent" />
      </div>

      {/* Users Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-10">
        {usersData.map((user) => {
          const isAdmin = user.role === "ADMIN";
          return (
            <div
              key={user.id}
              className={`${baseCardClass} ${isAdmin ? adminCardClass : userCardClass}`}
            >
              {/* Subtle gradient shine on hover for admin cards */}
              {isAdmin && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent_60%)] transition-opacity duration-300 pointer-events-none rounded-2xl" />
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
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-muted to-muted/60 flex items-center justify-center ring-2 ring-border">
                      <User size={20} className="text-muted-foreground" />
                    </div>
                  )}
                  {/* Online-style role indicator */}
                  {isAdmin && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-linear-to-br from-primary to-primary/70 ring-2 ring-card flex items-center justify-center">
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
              <div className="my-3 h-px bg-linear-to-r from-border via-border/50 to-transparent" />

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
                  <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-linear-to-r from-primary to-primary/80 text-primary-foreground shadow-sm shadow-primary/20 tracking-wide">
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
