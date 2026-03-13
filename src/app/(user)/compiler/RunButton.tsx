import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { CirclePlay, Square } from "lucide-react";

interface RunButtonProps {
  onClick: () => void;
  onStop: () => void;
  isRunning: boolean;
}

export default function RunButton({ onClick, onStop, isRunning }: RunButtonProps) {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button
          onClick={isRunning ? onStop : onClick}
          size="sm"
          className={`h-8 px-3 text-xs gap-2 transition-all ${
            isRunning
              ? "bg-destructive/90 hover:bg-destructive text-destructive-foreground"
              : ""
          }`}
          aria-label={isRunning ? "Stop execution" : "Run code"}
        >
          {isRunning ? (
            <Square className="h-3.5 w-3.5 fill-current" />
          ) : (
            <CirclePlay className="h-4 w-4" strokeWidth={1.5} />
          )}
          {isRunning ? "Stop" : "Run"}
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
