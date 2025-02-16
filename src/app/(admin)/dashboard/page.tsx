import { Button } from "@/components/ui/button";
import { actions } from "@/lib/utils";
import { ChevronsRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="w-full h-full pt-[5rem] max-md:px-3 px-6">
      <h1 className="text-lg font-bold mb-4 text-primary">Admin Dashboard</h1>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, idx) => (
          <div key={idx} className="min-w-[20rem] flex flex-1 p-4 rounded-lg bg-background border shadow">
            <div className="flex flex-col">
            <h2 className="font-semibold text-foreground">{action.title}</h2>
            <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
            <Button asChild className="ml-auto rounded-xl" size={'icon'} icon={ChevronsRight} effect={'shineHover'} iconPlacement="right" variant={'outline'}>
              <Link href={action.link}></Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
