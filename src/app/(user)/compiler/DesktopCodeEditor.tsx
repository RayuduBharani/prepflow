"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type * as Monaco from "monaco-editor";
import { Editor } from "@monaco-editor/react";

// Store imports
import {
  useFontSizeStore,
  useEditorFeaturesStore,
  useCompilerStore,
} from "@/store/compilerStore";
import { useTerminalStore } from "@/store/terminalStore";

// Component imports
import { Card, CardContent } from "@/components/ui/card";

// Local imports
import { LiveTerminalRef } from "./LiveTerminal";
import EditorHeader from "./EditorHeader";
import ResetCodeDialog from "./ResetCodeDialog";
import { setupEditor, registerCompletionProviders } from "./editorConfig";

// Helper function to get editor file path extension
const getFileExtension = (language: string): string => {
  const extensionMap: Record<string, string> = {
    cpp: "cpp",
    javascript: "js",
    python: "py",
    java: "java",
    c: "c",
  };
  return extensionMap[language] || language;
};

// Helper function to generate editor options
const getEditorOptions = (
  fontSize: number,
  intelliSenseEnabled: boolean,
  snippetsEnabled: boolean
) => ({
  fontSize,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: "on" as const,
  tabSize: 4,
  insertSpaces: true,
  parameterHints: { enabled: intelliSenseEnabled, cycle: true },
  autoIndent: "full" as const,
  renderWhitespace: "boundary" as const,
  renderControlCharacters: true,
  folding: true,
  foldingStrategy: "auto" as const,
  cursorStyle: "line" as const,
  cursorBlinking: "smooth" as const,
  overviewRulerLanes: 3,
  overviewRulerBorder: false,
  quickSuggestionsDelay: intelliSenseEnabled ? 10 : 100,
  quickSuggestions: intelliSenseEnabled
    ? { other: true, comments: true, strings: false }
    : false,
  autoClosingBrackets: "languageDefined" as const,
  autoClosingQuotes: "languageDefined" as const,
  autoClosingOvertype: "auto" as const,
  autoSurround: "languageDefined" as const,
  lineNumbers: "on" as const,
  automaticLayout: true,
  padding: { top: 16, bottom: 16 },
  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
  renderLineHighlight: "gutter" as const,
  selectionHighlight: true,
  lineNumbersMinChars: 3,
  contextmenu: true,
  copyWithSyntaxHighlighting: true,
  formatOnPaste: true,
  formatOnType: true,
  suggestOnTriggerCharacters: intelliSenseEnabled,
  suggestSelection: intelliSenseEnabled
    ? ("first" as const)
    : ("recentlyUsed" as const),
  acceptSuggestionOnEnter: intelliSenseEnabled
    ? ("on" as const)
    : ("off" as const),
  suggestFontSize: fontSize,
  snippetSuggestions: snippetsEnabled ? ("inline" as const) : ("none" as const),
  tabCompletion: snippetsEnabled ? ("on" as const) : ("off" as const),
  wordBasedSuggestions: intelliSenseEnabled
    ? ("currentDocument" as const)
    : ("off" as const),
  suggest: {
    showKeywords: intelliSenseEnabled,
    showSnippets: snippetsEnabled,
    showWords: false,
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
});

interface DesktopCodeEditorProps {
  terminalRef: React.RefObject<LiveTerminalRef | null>;
}

export default function DesktopCodeEditor({ terminalRef }: DesktopCodeEditorProps) {
  // Theme and UI state
  const { resolvedTheme } = useTheme();
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Store hooks
  const { fontSize } = useFontSizeStore();
  const { intelliSenseEnabled, snippetsEnabled } = useEditorFeaturesStore();
  const {
    code,
    setCode,
    isFullscreen,
    resetCode,
    language,
  } = useCompilerStore();
  const { status } = useTerminalStore();

  // Editor refs
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);

  // Editor setup and initialization
  const handleEditorDidMount = (
    editor: Monaco.editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Ensure model language is set correctly before registering providers
    const model = editor.getModel();
    if (model) {
      const currentLang = model.getLanguageId();
      console.log(
        "[Editor Mount] Current model language:",
        currentLang,
        "Target language:",
        language
      );
      if (currentLang !== language) {
        console.log("[Editor Mount] Force setting language to:", language);
        monaco.editor.setModelLanguage(model, language);
      }
    }

    // Register providers after ensuring language is correct
    setupEditor(editor, monaco, intelliSenseEnabled, snippetsEnabled);
  };

  // Event handlers
  const handleRunCode = () => {
    console.log('[DesktopCodeEditor] handleRunCode called, terminalRef:', terminalRef, 'terminalRef.current:', terminalRef.current);
    if (terminalRef.current) {
      terminalRef.current.run();
    } else {
      console.error('[DesktopCodeEditor] terminalRef.current is null - terminal not mounted yet. Waiting...');
      // Retry after a short delay to allow terminal to mount
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.run();
        } else {
          console.error('[DesktopCodeEditor] Terminal still not available after retry');
        }
      }, 100);
    }
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
        if (status !== "running" && terminalRef.current) {
          terminalRef.current.run();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [terminalRef, status]);

  // Re-register providers when IntelliSense, Snippets, or Language changes
  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      // Force update the model's language to ensure it matches the current language
      const model = editorRef.current.getModel();
      if (model) {
        const currentLang = model.getLanguageId();
        if (currentLang !== language) {
          console.log(
            "[Language Sync] Updating model language from",
            currentLang,
            "to",
            language
          );
          monacoRef.current.editor.setModelLanguage(model, language);
        }
      }
      registerCompletionProviders(
        monacoRef.current,
        intelliSenseEnabled,
        snippetsEnabled
      );
    }
  }, [intelliSenseEnabled, snippetsEnabled, language]);

  return (
    <div className={`h-full ${isFullscreen ?? "py-0"}`}>
      <Card
        className={`h-full bg-background ${isFullscreen ? "shadow-none rounded-none" : "shadow-sm rounded-lg"
          }`}
      >
        {/* Editor Header */}
        <EditorHeader
          onResetClick={handleResetClick}
          onRunCode={handleRunCode}
          isRunning={status === "running"}
        />

        {/* Code Editor Area */}
        <CardContent className="flex-1 p-0 h-[calc(100%-60px)]">
          <div className="h-full">
            <Editor
              height="90vh"
              defaultLanguage={language}
              language={language}
              path={`main.${getFileExtension(language)}`}
              value={code}
              theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
              onMount={handleEditorDidMount}
              options={getEditorOptions(
                fontSize,
                intelliSenseEnabled,
                snippetsEnabled
              )}
              onChange={(value) => setCode(value || "")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reset Code Confirmation Dialog */}
      <ResetCodeDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}
