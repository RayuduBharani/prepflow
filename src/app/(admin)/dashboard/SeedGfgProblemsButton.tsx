"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { DatabaseZap, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type LogLevel = "info" | "progress" | "success" | "error";

interface LogLine {
  level: LogLevel;
  message: string;
  time: string;
}

type Status = "idle" | "running" | "done" | "error";

const levelStyles: Record<LogLevel, string> = {
  info:     "text-muted-foreground",
  progress: "text-blue-400",
  success:  "text-green-400",
  error:    "text-red-400",
};

const levelPrefix: Record<LogLevel, string> = {
  info:     "[INFO]    ",
  progress: "[PROGRESS]",
  success:  "[SUCCESS] ",
  error:    "[ERROR]   ",
};

export default function SeedGfgProblemsButton() {
  const [status, setStatus] = useState<Status>("idle");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const esRef = useRef<EventSource | null>(null);

  // Auto-scroll only when already near the bottom
  useEffect(() => {
    const container = logContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;
    if (isNearBottom) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Cleanup on unmount
  useEffect(() => () => esRef.current?.close(), []);

  function addLog(level: LogLevel, message: string) {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLogs((prev) => [...prev, { level, message, time }]);
  }

  function startSeeding() {
    if (status === "running") return;
    setLogs([]);
    setStatus("running");

    const es = new EventSource("/api/seed-gfg");
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data) as {
          type: LogLevel | "done";
          message?: string;
          count?: number;
        };

        if (payload.type === "done") {
          es.close();
          setStatus("done");
          const count = payload.count ?? 0;
          if (count > 0) {
            toast.success(`Seeded ${count} new GFG problem${count === 1 ? "" : "s"}`);
          } else {
            toast("No new GFG problems found");
          }
          return;
        }

        if (payload.message) addLog(payload.type as LogLevel, payload.message);
        if (payload.type === "error") setStatus("error");
      } catch {
        /* ignore malformed events */
      }
    };

    es.onerror = () => {
      addLog("error", "Connection to server lost.");
      setStatus("error");
      toast.error("Seeding failed — check server logs");
      es.close();
    };
  }

  const isRunning = status === "running";

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        disabled={isRunning}
        onClick={startSeeding}
        className="self-start"
      >
        {isRunning ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : status === "done" || status === "error" ? (
          <RotateCcw className="w-4 h-4 mr-2" />
        ) : (
          <DatabaseZap className="w-4 h-4 mr-2" />
        )}
        {isRunning
          ? "Seeding…"
          : status === "done"
            ? "Run Again"
            : status === "error"
              ? "Retry"
              : "Seed GFG Problems"}
      </Button>

      {logs.length > 0 && (
        <div className="rounded-lg border border-border bg-black/80 font-mono text-xs leading-relaxed overflow-hidden">
          {/* macOS-style title bar */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-muted/10 select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="ml-2 text-muted-foreground/60 text-[10px]">seed-gfg — console</span>
            {isRunning && (
              <span className="ml-auto flex items-center gap-1 text-[10px] text-blue-400 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                running
              </span>
            )}
          </div>

          {/* log body */}
          <div ref={logContainerRef} className="max-h-64 overflow-y-auto p-3 space-y-0.5">
            {logs.map((line, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-muted-foreground/40 shrink-0">{line.time}</span>
                <span className={cn("shrink-0 select-none", levelStyles[line.level])}>
                  {levelPrefix[line.level]}
                </span>
                <span className={cn(levelStyles[line.level])}>{line.message}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}
