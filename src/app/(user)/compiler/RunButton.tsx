import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { CirclePlay } from "lucide-react";

interface RunButtonProps {
  onClick: () => void;
  isRunning: boolean;
}

export default function RunButton({ onClick, isRunning }: RunButtonProps) {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          disabled={isRunning}
          size="sm"
          className="h-8 px-3 text-xs gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Run code"
        >
          {isRunning ? (
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <CirclePlay className="h-4 w-4" strokeWidth={1.5} />
          )}
          {isRunning ? "Running…" : "Run"}
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        align="center" 
        className="bg-background border border-secondary text-[0.7rem] rounded-md px-3 py-2 shadow-md"
      >
        <KbdGroup>
          <Kbd>Alt</Kbd> / <Kbd>⌥</Kbd>+<Kbd>Enter</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
}
