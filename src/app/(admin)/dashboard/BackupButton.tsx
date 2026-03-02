"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DatabaseBackup, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createDatabaseBackup } from "@/actions/backupActions";

export default function BackupButton() {
  const [isPending, setIsPending] = useState(false);

  async function handleBackup() {
    setIsPending(true);
    try {
      const result = await createDatabaseBackup();

      if (!result.success) {
        toast.error(result.error ?? "Backup failed");
        return;
      }

      // Trigger browser download without needing a server-side file
      const blob = new Blob([result.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      toast.success(`Backup downloaded: ${result.filename}`);
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred during backup");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={handleBackup}
      className="mt-2"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <DatabaseBackup className="w-4 h-4 mr-2" />
      )}
      {isPending ? "Backing up…" : "Backup Database"}
    </Button>
  );
}
