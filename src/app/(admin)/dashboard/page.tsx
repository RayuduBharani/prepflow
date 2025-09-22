import { Button } from "@/components/ui/button";
import { actions } from "@/lib/utils";
import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import SeedButton from "./SeedButton";

export default function AdminDashboard() {
  return (
    <div className="w-full h-full pt-20 max-md:px-3 px-6">
      <h1 className="text-lg font-bold mb-4 text-primary">Admin Dashboard</h1>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, idx) => (
          <div key={idx} className="min-w-[20rem] flex flex-1 p-4 rounded-lg bg-background border shadow">
            <div className="flex flex-col">
            <h2 className="font-semibold text-foreground">{action.title}</h2>
            <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
              <Link className="ml-auto" href={action.link}>
            <Button asChild className="rounded-xl p-2" size={'icon'} variant={'outline'}>
              <ChevronsRight strokeWidth={1} />
            </Button>
              </Link>
          </div>
        ))}
      </div>
      <SeedButton />
    </div>
  );
}
