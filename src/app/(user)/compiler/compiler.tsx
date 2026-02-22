"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import React, { useEffect, useRef } from "react";
import DesktopCodeEditor from "./DesktopCodeEditor";
import { useCompilerStore } from "@/store/compilerStore";
import { codeTemplates } from "@/lib/codeTemplates";
import LiveTerminal, { LiveTerminalRef } from "./LiveTerminal";
import { useShallow } from "zustand/react/shallow";

const CompilerPage: React.FC = () => {
  const {
    language,
    code,
    activeTab,
    setActiveTab,
    setCode,
    isFullscreen,
    setIsFullscreen,
  } = useCompilerStore(
    useShallow((state) => ({
      language: state.language,
      code: state.code,
      activeTab: state.activeTab,
      setActiveTab: state.setActiveTab,
      setCode: state.setCode,
      isFullscreen: state.isFullscreen,
      setIsFullscreen: state.setIsFullscreen,
    }))
  );

  const terminalRef = useRef<LiveTerminalRef>(null);

  useEffect(() => {
    const savedCode = localStorage.getItem(`compiler-code-${language}`);
    setCode(savedCode ?? codeTemplates[language] ?? "");
  }, [language, setCode]);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullscreen, setIsFullscreen]);

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50" : "h-fit"
      } bg-background flex flex-col overflow-hidden`}
    >
      {/* --- Mobile Layout (Tabs) --- */}
      <div className={`lg:hidden flex-1 flex flex-col ${isFullscreen ? "hidden" : ""}`}>
        <div className="flex w-full border-b border-border">
          <TabButton isActive={activeTab === "editor"} onClick={() => setActiveTab("editor")}>
            Code Editor
          </TabButton>
          <TabButton isActive={activeTab === "terminal"} onClick={() => setActiveTab("terminal")}>
            Terminal
          </TabButton>
        </div>

        <div className={`flex-1 ${activeTab === "editor" ? "block" : "hidden"}`}>
          <DesktopCodeEditor terminalRef={terminalRef} />
        </div>
        <div className={`flex-1 ${activeTab === "terminal" ? "block" : "hidden"}`}>
          {/* 3. Removed redundant state; use `language` directly as the key */}
          <LiveTerminal
            key={`mobile-terminal-${language}`}
            ref={terminalRef}
            code={code}
            language={language}
          />
        </div>
      </div>

      {/* --- Desktop Layout (Resizable Panels) --- */}
      <div className={`hidden lg:block overflow-auto ${isFullscreen && "fixed inset-0 z-50 h-full"}`}>
        <ResizablePanelGroup className="h-[calc(100vh-5rem)]!" orientation="horizontal">
          {/* 4. Changed percentage strings to raw numbers */}
          <ResizablePanel defaultSize="68%" minSize="32%" maxSize="90%">
            <DesktopCodeEditor terminalRef={terminalRef} />
          </ResizablePanel>

          <ResizableHandle className="mx-1" withHandle />

          <ResizablePanel defaultSize="32%" minSize="20%" maxSize="68%">
            <LiveTerminal
              key={`desktop-terminal-${language}`}
              ref={terminalRef}
              code={code}
              language={language}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

// Extracted UI Component for cleaner main render function
const TabButton = ({ isActive, onClick, children }: { isActive: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "border-b-2 border-primary bg-background text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

export default CompilerPage;