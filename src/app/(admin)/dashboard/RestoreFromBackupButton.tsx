"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen, RotateCcw, X, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { restoreFromBackup } from "@/actions/backupActions";

// ── types ─────────────────────────────────────────────────────────────────────

type BackupPreview = {
  filename: string;
  timestamp: string;
  version: string;
  tables: Record<string, number>;
  file: File;
};

const REQUIRED_KEYS = [
  "problems",
  "problemTopics",
  "problemCompanies",
  "problemMainTopics",
  "similarProblems",
  "sheets",
  "jobs",
  "internships",
  "roadmaps",
  "nodes",
  "edges",
  "users",
  "userProgress",
  "accounts",
  "verifications",
] as const;

// ── component ─────────────────────────────────────────────────────────────────

export default function RestoreFromBackupButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── file selection + client-side validation ──────────────────────────────────

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // reset so the same file can be re-picked
    e.target.value = "";

    setPreview(null);
    setValidationError(null);

    if (!file) return;

    if (!file.name.endsWith(".json")) {
      setValidationError("Please select a .json backup file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target?.result as string) as Record<string, unknown>;

        // Check metadata
        if (!raw.metadata || typeof (raw.metadata as Record<string, unknown>).version !== "string") {
          setValidationError("Invalid backup: missing or malformed metadata.");
          return;
        }

        // Check required array keys
        const missing = REQUIRED_KEYS.filter((k) => !Array.isArray(raw[k]));
        if (missing.length > 0) {
          setValidationError(`Invalid backup — missing fields: ${missing.join(", ")}.`);
          return;
        }

        const meta = raw.metadata as { version: string; timestamp: string; tables: Record<string, number> };
        setPreview({
          filename: file.name,
          version: meta.version,
          timestamp: meta.timestamp,
          tables: meta.tables,
          file,
        });
      } catch {
        setValidationError("Failed to parse the file — make sure it is a valid JSON backup.");
      }
    };
    reader.readAsText(file);
  }

  // ── restore ──────────────────────────────────────────────────────────────────

  function handleRestore() {
    if (!preview) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.append("file", preview.file);

      const result = await restoreFromBackup(fd);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const summary = Object.entries(result.stats)
        .map(([table, count]) => `${table}: ${count.toLocaleString()}`)
        .join("  ·  ");

      toast.success(`Restore complete — ${summary}`, { duration: 8000 });
      setPreview(null);
    });
  }

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-3 mt-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
        disabled={isPending}
      />

      {/* Trigger button */}
      <Button
        variant="outline"
        disabled={isPending}
        onClick={() => {
          setPreview(null);
          setValidationError(null);
          fileInputRef.current?.click();
        }}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <FolderOpen className="w-4 h-4 mr-2" />
        )}
        {isPending ? "Restoring…" : "Restore from Backup"}
      </Button>

      {/* Validation error */}
      {validationError && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Preview card */}
      {preview && (
        <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
              <p className="font-semibold text-foreground truncate">{preview.filename}</p>
            </div>
            <button
              onClick={() => setPreview(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Meta */}
          <p className="text-xs text-muted-foreground">
            Version {preview.version} &nbsp;·&nbsp;{" "}
            {new Date(preview.timestamp).toLocaleString()}
          </p>

          {/* Table counts */}
          <div className="grid grid-cols-2 gap-1">
            {Object.entries(preview.tables).map(([table, count]) => (
              <div
                key={table}
                className="flex items-center justify-between rounded bg-card border border-border px-2 py-1"
              >
                <span className="text-xs text-muted-foreground capitalize">{table}</span>
                <span className="text-xs font-mono font-semibold">{count.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Warning */}
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Existing rows will be skipped (no overwrites). New rows will be inserted.
          </p>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              disabled={isPending}
              onClick={handleRestore}
            >
              {isPending ? (
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="w-3 h-3 mr-2" />
              )}
              {isPending ? "Restoring…" : "Confirm Restore"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => setPreview(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
