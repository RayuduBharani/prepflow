"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Editor } from "@monaco-editor/react";
import { Minus, Plus, CirclePlay, RotateCcw, Lightbulb, FileCode2 } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FullScreenButton from "./FullScreenButton";
import { ALLOWED_LANGUAGES, useFontSizeStore, useLanguageStore, useEditorFeaturesStore } from "@/store/compilerStore";
import LanguageSelector from "./LanguageSelector";
import type * as Monaco from "monaco-editor";
import { setupEditor, registerCompletionProviders } from "./editorConfig";

interface DesktopCodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  handleRunCode: () => void;
  isRunning: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  resetCode: () => void;
}

export default function DesktopCodeEditor({
  code,
  setCode,
  handleRunCode,
  isRunning,
  isFullscreen,
  onToggleFullscreen,
  resetCode,
}: DesktopCodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const {fontSize, setFontSize} = useFontSizeStore()
  const language = useLanguageStore((state) =>
  ALLOWED_LANGUAGES.includes(state.language) ? state.language : "python"
);
  const { intelliSenseEnabled, snippetsEnabled, toggleIntelliSense, toggleSnippets } = useEditorFeaturesStore();
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Setup editor with custom completion providers
  const handleEditorDidMount = (editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setupEditor(editor, monaco, intelliSenseEnabled, snippetsEnabled);
  };

  const handleResetClick = () => {
    setShowResetDialog(true);
  };

  const handleConfirmReset = () => {
    resetCode();
    setShowResetDialog(false);
  };

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

  // Re-register providers when IntelliSense, Snippets, or Language changes
  useEffect(() => {
    if (monacoRef.current) {
      registerCompletionProviders(monacoRef.current, intelliSenseEnabled, snippetsEnabled);
    }
  }, [intelliSenseEnabled, snippetsEnabled, language]);

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
             <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleIntelliSense}
                  variant={intelliSenseEnabled ? "default" : "outline"}
                  size="icon"
                  className="w-8 h-8 sm:w-9 sm:h-9 transition-all duration-200 hover:scale-105"
                  aria-label="Toggle IntelliSense"
                >
                  <Lightbulb className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${intelliSenseEnabled ? '' : 'opacity-70'}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="center"
                className="bg-popover text-popover-foreground rounded-md px-3 py-2 shadow-md"
              >
                <p className="text-xs font-medium">IntelliSense: {intelliSenseEnabled ? "ON" : "OFF"}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleSnippets}
                  variant={snippetsEnabled ? "default" : "outline"}
                  size="icon"
                  className="w-8 h-8 sm:w-9 sm:h-9 transition-all duration-200 hover:scale-105"
                  aria-label="Toggle Snippets"
                >
                  <FileCode2 className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${snippetsEnabled ? '' : 'opacity-70'}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="center"
                className="bg-popover text-popover-foreground rounded-md px-3 py-2 shadow-md"
              >
                <p className="text-xs font-medium">Snippets: {snippetsEnabled ? "ON" : "OFF"}</p>
              </TooltipContent>
            </Tooltip>
            <div className="h-6 w-px bg-border mx-1" /> {/* Separator */}
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
                  onClick={handleResetClick}
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  aria-label="Reset code"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="center"
                className="bg-popover text-popover-foreground rounded-md px-3 py-2 shadow-md"
              >
                <p className="text-xs">Reset to default code</p>
              </TooltipContent>
            </Tooltip>
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
              onMount={handleEditorDidMount}
              options={{
                fontSize: fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                tabSize: 4,
                insertSpaces: true,
                parameterHints: {
                  enabled: intelliSenseEnabled,
                  cycle: true,
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
                quickSuggestionsDelay: intelliSenseEnabled ? 10 : 100,
                quickSuggestions: intelliSenseEnabled ? {
                  other: true,
                  comments: true,
                  strings: true,
                } : false,
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
                suggestOnTriggerCharacters: intelliSenseEnabled,
                suggestSelection: intelliSenseEnabled ? "first" : "recentlyUsed",
                acceptSuggestionOnEnter: intelliSenseEnabled ? "on" : "off",
                suggestFontSize: fontSize,
                snippetSuggestions: snippetsEnabled ? "inline" : "none",
                tabCompletion: snippetsEnabled ? "on" : "off",
                wordBasedSuggestions: intelliSenseEnabled ? "currentDocument" : "off",
                suggest: {
                  showKeywords: intelliSenseEnabled,
                  showSnippets: snippetsEnabled,
                  showWords: false, // Disable word-based suggestions to prevent cross-language pollution
                  showMethods: intelliSenseEnabled,
                  showFunctions: intelliSenseEnabled,
                  showConstructors: intelliSenseEnabled,
                  showFields: intelliSenseEnabled,
                  showVariables: intelliSenseEnabled,
                  showClasses: intelliSenseEnabled,
                  showStructs: intelliSenseEnabled,
                  showInterfaces: intelliSenseEnabled,
                  showModules: intelliSenseEnabled,
                  showProperties: intelliSenseEnabled,
                  showEvents: intelliSenseEnabled,
                  showOperators: intelliSenseEnabled,
                  showUnits: intelliSenseEnabled,
                  showValues: intelliSenseEnabled,
                  showConstants: intelliSenseEnabled,
                  showEnums: intelliSenseEnabled,
                  showEnumMembers: intelliSenseEnabled,
                  showColors: intelliSenseEnabled,
                  showFiles: false,
                  showReferences: false,
                  showFolders: false,
                  showTypeParameters: intelliSenseEnabled,
                  filterGraceful: true,
                  snippetsPreventQuickSuggestions: false,
                },
              }}
              onChange={(value) => setCode(value || "")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reset Code Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-orange-500" />
              Reset Code?
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Are you sure you want to reset the code to default? This action will discard all your current changes and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowResetDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
