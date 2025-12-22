import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Ellipsis } from "lucide-react";
import EditorControls from "./EditorControls";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";

interface EditorHeaderProps {
  onResetClick: () => void;
  onRunCode: () => void;
  isRunning: boolean;
}

export default function EditorHeader({
  onResetClick,
  onRunCode,
  isRunning,
}: EditorHeaderProps) {
  return (
    <div className="flex items-center dark:bg-linear-to-t dark:from-primary/10 dark:to-background justify-between px-4 py-2 rounded-t-lg">
      {/* Left Section: Window Controls + Language Selector */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
        <LanguageSelector />
      </div>

      {/* Right Section: Editor Controls + Run Button */}
      <div className="flex items-center space-x-2">
        {/* Desktop Controls */}
        <div className="hidden sm:flex space-x-1 items-center">
          <EditorControls
            onResetClick={onResetClick} 
          />
        </div>

        {/* Mobile Controls - Popover */}
        <div className="sm:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" className="w-8 h-8" aria-label="More options">
                <Ellipsis />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-background/20 backdrop-blur-xs">
              <div className="flex space-x-1 flex-wrap gap-2 items-center">
                <EditorControls 
                  onResetClick={onResetClick} 
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Run Button */}
        <RunButton onClick={onRunCode} isRunning={isRunning} />
      </div>
    </div>
  );
}
