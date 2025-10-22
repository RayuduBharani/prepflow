"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useEffect, useRef } from "react";
import DesktopCodeEditor from "./DesktopCodeEditor";
import { useCompilerStore } from "@/store/compilerStore";
import { codeTemplates } from "@/lib/codeTemplates";
import LiveTerminal, { LiveTerminalRef } from "./LiveTerminal";

const CompilerPage: React.FC = () => {
  const {
    language,
    code,
    activeTab,
    setActiveTab,
    setCode,
    isFullscreen,
    setIsFullscreen,
  } = useCompilerStore();
  const terminalRef = useRef<LiveTerminalRef>(null);

  // Load default or saved code
  useEffect(() => {
    const savedCode = localStorage.getItem(`compiler-code-${language}`);
    setCode(savedCode ?? codeTemplates[language] ?? "");
  }, [language, setCode]);

  // Exit fullscreen on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) =>
      e.key === "Escape" && isFullscreen && setIsFullscreen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullscreen, setIsFullscreen]);

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50" : "h-screen"
      } bg-background flex flex-col overflow-hidden`}
    >
      {/* --- Mobile Layout (Tabs) --- */}
      <div className={`lg:hidden flex-1 flex flex-col ${isFullscreen ? "hidden" : ""}`}>
        <div className="flex w-full border-b border-border">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "editor"
                ? "border-b-2 border-primary bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Code Editor
          </button>
          <button
            onClick={() => setActiveTab("terminal")}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "terminal"
                ? "border-b-2 border-primary bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Terminal
          </button>
        </div>

        <div className={`flex-1 ${activeTab === "editor" ? "block" : "hidden"}`}>
          <DesktopCodeEditor terminalRef={terminalRef} />
        </div>
        <div className={`flex-1 ${activeTab === "terminal" ? "block" : "hidden"}`}>
          <LiveTerminal key="mobile-terminal" ref={terminalRef} code={code} language={language} />
        </div>
      </div>

      {/* --- Desktop Layout (Resizable Panels) --- */}
      <div
        className={`hidden lg:block flex-1 ${
          isFullscreen ? "fixed inset-0 z-50" : ""
        }`}
      >
        <ResizablePanelGroup direction="horizontal" className="flex-1 h-full">
          <ResizablePanel defaultSize={68} minSize={32} maxSize={90}>
            <DesktopCodeEditor terminalRef={terminalRef} />
          </ResizablePanel>

          <ResizableHandle className="mx-1" withHandle />

          <ResizablePanel defaultSize={32} minSize={20} maxSize={68}>
            <LiveTerminal key="desktop-terminal" ref={terminalRef} code={code} language={language} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default CompilerPage;
