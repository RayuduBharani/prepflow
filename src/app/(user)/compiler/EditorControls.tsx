import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Minus, Plus, RotateCcw, Lightbulb, FileCode2 } from "lucide-react";
import FullScreenButton from "./FullScreenButton";
import { useFontSizeStore, useEditorFeaturesStore } from "@/store/compilerStore";
import { Separator } from "@/components/ui/separator";

export default function EditorControls({
  onResetClick,
}: {
  onResetClick: () => void;
}) {
  const { fontSize, setFontSize } = useFontSizeStore();
  const {
    intelliSenseEnabled,
    snippetsEnabled,
    toggleIntelliSense,
    toggleSnippets,
  } = useEditorFeaturesStore();

  return (
    <>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleIntelliSense}
            variant={intelliSenseEnabled ? "secondary" : "outline"}
            size="icon"
            className="w-8 h-8"
            aria-label="Toggle IntelliSense"
          >
            <Lightbulb className={`h-4 w-4 ${intelliSenseEnabled ? "" : "opacity-70"}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className="bg-popover text-popover-foreground rounded-md px-3 py-2 shadow-md">
          <p className="text-xs font-medium">IntelliSense: {intelliSenseEnabled ? "ON" : "OFF"}</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleSnippets}
            variant={snippetsEnabled ? "secondary" : "outline"}
            size="icon"
            className="w-8 h-8"
            aria-label="Toggle Snippets"
          >
            <FileCode2 className={`h-4 w-4 ${snippetsEnabled ? "" : "opacity-70"}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className="bg-popover text-popover-foreground rounded-md px-3 py-2 shadow-md">
          <p className="text-xs font-medium">Snippets: {snippetsEnabled ? "ON" : "OFF"}</p>
        </TooltipContent>
      </Tooltip>
      <Separator className="mx-1" orientation="vertical" />
      <FullScreenButton />
      <div className="flex items-center space-x-1">
        <Button variant="secondary" size="icon" className="w-8 h-8" onClick={() => setFontSize(Math.max(14, fontSize - 1))}>
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-sm px-1">{fontSize}</span>
        <Button variant="secondary" size="icon" className="w-8 h-8" onClick={() => setFontSize(Math.min(28, fontSize + 1))}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <Separator orientation="vertical" />
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            onClick={onResetClick}
            variant="secondary"
            size="icon"
            className="w-8 h-8"
            aria-label="Reset code"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className="bg-popover text-popover-foreground rounded-md px-3 py-2 shadow-md">
          <p className="text-xs">Reset to default code</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}
