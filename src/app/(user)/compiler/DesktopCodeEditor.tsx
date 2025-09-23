"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Editor } from "@monaco-editor/react";
import { Minus, Plus, CirclePlay } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FullScreenButton from "./FullScreenButton";
import { ALLOWED_LANGUAGES, useFontSizeStore, useLanguageStore } from "@/store/compilerStore";
import LanguageSelector from "./LanguageSelector";

interface DesktopCodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  handleRunCode: () => void;
  isRunning: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function DesktopCodeEditor({
  code,
  setCode,
  handleRunCode,
  isRunning,
  isFullscreen,
  onToggleFullscreen,
}: DesktopCodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const {fontSize, setFontSize} = useFontSizeStore()
  const language = useLanguageStore((state) =>
  ALLOWED_LANGUAGES.includes(state.language) ? state.language : "python"
);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "Enter") {
        e.preventDefault();
        if (!isRunning) {
          handleRunCode();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleRunCode, isRunning]);
  const handleFontSize = (increment: boolean) => {
    let x: number;
    if (increment) {
      x = Math.min(28, fontSize + 1);
      setFontSize(x);
    } else {
      x = Math.max(14, fontSize - 1);
      setFontSize(x);
    }
  };

  return (
    <div className={`h-full ${isFullscreen ? "py-0" : "py-4"}`}>
      <Card
        className={`h-full bg-background ${
          isFullscreen ? "shadow-none rounded-none" : "shadow-sm rounded-lg"
        }`}
      >
        {/* Desktop File Tab */}
        <div className="flex items-center justify-between px-4 py-2 bg-background rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <LanguageSelector />
          </div>
          <div className="flex items-center space-x-2 overflow-hidden">
            <FullScreenButton onToggleFullscreen={onToggleFullscreen} />
            <div className="flex items-center space-x-1">
              <Button
                variant="secondary"
                size="icon"
                className="w-8 h-8"
                onClick={() => handleFontSize(false)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm px-2">{fontSize}</span>
              <Button
                variant="secondary"
                size="icon"
                className="w-8 h-8"
                onClick={() => handleFontSize(true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  size="sm"
                  className="h-8 px-3 text-xs gap-2 transition-all 
                 disabled:opacity-60 disabled:cursor-not-allowed"
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
                className="bg-popover text-popover-foreground rounded-md px-3 py-2 shadow-md"
              >
                <p className="text-[0.7rem] flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded-sm bg-muted text-foreground font-mono">
                    Alt
                  </span>
                  /
                  <span className="px-1.5 py-0.5 rounded-sm bg-muted text-foreground font-mono">
                    ⌥
                  </span>
                  +
                  <span className="px-1.5 py-0.5 rounded-sm bg-muted text-foreground font-mono">
                    Enter
                  </span>
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        {/* Code Editor Area - Desktop */}
        <CardContent className="flex-1 p-0 h-[calc(100%-60px)]">
          <div className="h-full">
            <Editor
              height="90vh"
              defaultLanguage="python"
              language={language}
              value={code}
              theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
              options={{
                fontSize: fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                tabSize: 4,
                insertSpaces: true,
                parameterHints: {
                  enabled: true,
                },
                autoIndent: "full",
                renderWhitespace: "boundary",
                renderControlCharacters: true,
                folding: true,
                foldingStrategy: "auto",
                cursorStyle: "line",
                cursorBlinking: "smooth",
                overviewRulerLanes: 3,
                overviewRulerBorder: false,
                quickSuggestionsDelay: 100,
                quickSuggestions: {
                  other: true,
                  comments: true,
                  strings: true,
                },
                autoClosingBrackets: "languageDefined",
                autoClosingQuotes: "languageDefined",
                autoClosingOvertype: "auto",
                autoSurround: "languageDefined",
                lineNumbers: "on",
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                renderLineHighlight: "gutter",
                selectionHighlight: true,
                lineNumbersMinChars : 3,
                contextmenu: true,
                copyWithSyntaxHighlighting: true,
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                suggestSelection: "first",
                acceptSuggestionOnEnter: "on",
                suggestFontSize: fontSize,
              }}
              onChange={(value) => setCode(value || "")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
