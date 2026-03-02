import { actions } from "@/lib/utils";
import { Briefcase, Map, Building2, FileSpreadsheet, UserCog, ArrowRight } from "lucide-react";
import Link from "next/link";
import BackupButton from "./BackupButton";
import RestoreFromBackupButton from "./RestoreFromBackupButton";
import SeedGfgProblemsButton from "./SeedGfgProblemsButton";
import { getSession } from "@/auth-client";
import { redirect, RedirectType } from "next/navigation";

const getActionIcon = (title: string) => {
  const iconMap: Record<string, any> = {
    "Post Jobs": Briefcase,
    "Post Roadmaps": Map,
    "Companies": Building2,
    "DSA Sheets": FileSpreadsheet,
    "Add Admins": UserCog,
  };
  return iconMap[title] || Briefcase;
};

export default async function AdminDashboard() {
  const user = await getSession()
  if (!user || user.role !== "ADMIN") return redirect('/', RedirectType.push)
  return (
    <div className="w-full min-h-screen pt-20 pb-12 px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your platform content and settings</p>
      </div>

      {/* Actions Grid */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {actions.map((action) => {
            const Icon = getActionIcon(action.title);
            return (
              <Link
                key={action.title}
                href={action.link}
                className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {action.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-xl transition-all duration-300 pointer-events-none" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Database Management Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-foreground mb-4">Database Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Backup */}
          <div className="rounded-xl bg-card border border-border p-5 shadow-sm flex flex-col gap-2">
            <p className="font-semibold text-foreground">Backup</p>
            <p className="text-sm text-muted-foreground">Export a full JSON snapshot of the database.</p>
            <BackupButton />
          </div>

          {/* Restore from backup */}
          <div className="rounded-xl bg-card border border-border p-5 shadow-sm flex flex-col gap-2">
            <p className="font-semibold text-foreground">Restore</p>
            <p className="text-sm text-muted-foreground">Upload a backup JSON and seed the database from it.</p>
            <RestoreFromBackupButton />
          </div>

          {/* Seed GFG Problems */}
          <div className="rounded-xl bg-card border border-border p-5 shadow-sm flex flex-col gap-2">
            <p className="font-semibold text-foreground">Seed GFG Problems</p>
            <p className="text-sm text-muted-foreground">Fetch and import new problems from GeeksForGeeks that are not yet in the database.</p>
            <SeedGfgProblemsButton />
          </div>
        </div>
      </div>
    </div>
  );
}
