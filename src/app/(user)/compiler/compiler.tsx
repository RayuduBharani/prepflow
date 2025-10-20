"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MobileHeader from "./mobileHeader";
import MobileContent from "./mobileContent";
import DesktopCodeEditor from "./DesktopCodeEditor";
import { Play } from "lucide-react";
import DesktopConsole from "./DesktopConsole";
import { useLanguageStore } from "@/store/compilerStore";
import { codeTemplates } from "@/lib/codeTemplates";

const PythonCompiler: React.FC = () => {
  const [inputs, setInputs] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<"code" | "console">("code");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { language } = useLanguageStore();
  const [code, setCode] = useState("");
  useEffect(() => {
    const savedCode = localStorage.getItem(`compiler-code-${language}`);
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(codeTemplates[language] || "");
    }
  }, [language]);

  // Save code to localStorage whenever it changes
  useEffect(() => {
    if (code) {
      localStorage.setItem(`compiler-code-${language}`, code);
    }
  }, [code, language]);

  const hasInputCalls = useMemo(() => {
    // Detect input calls based on language
    switch (language) {
      case "python":
        return /input\s*\(/g.test(code);
      case "c":
        return /scanf\s*\(/g.test(code);
      case "cpp":
        return /(cin\s*>>|getline\s*\()/g.test(code);
      case "java":
        return /(\.nextLine\s*\(|\.nextInt\s*\(|\.nextDouble\s*\(|\.next\s*\(|Scanner\s+)/g.test(code);
      case "javascript":
        return /(readline\s*\(|prompt\s*\()/g.test(code);
      default:
        return false;
    }
  }, [code, language]);

  const getInputPrompts = useMemo(() => {
    const prompts: string[] = [];
    
    switch (language) {
      case "python": {
        const inputRegex = /input\s*\(\s*["']([^"']*)["']\s*\)/g;
        let match;
        while ((match = inputRegex.exec(code)) !== null) {
          prompts.push(match[1]);
        }
        break;
      }
      case "c": {
        const scanfMatches = code.match(/scanf\s*\(/g);
        if (scanfMatches) {
          scanfMatches.forEach(() => prompts.push("Input required"));
        }
        break;
      }
      case "cpp": {
        const cinMatches = code.match(/(cin\s*>>|getline\s*\()/g);
        if (cinMatches) {
          cinMatches.forEach(() => prompts.push("Input required"));
        }
        break;
      }
      case "java": {
        const scannerMatches = code.match(/(\.nextLine\s*\(|\.nextInt\s*\(|\.nextDouble\s*\(|\.next\s*\()/g);
        if (scannerMatches) {
          scannerMatches.forEach(() => prompts.push("Input required"));
        }
        break;
      }
      case "javascript": {
        const readlineMatches = code.match(/(readline\s*\(|prompt\s*\()/g);
        if (readlineMatches) {
          readlineMatches.forEach(() => prompts.push("Input required"));
        }
        break;
      }
    }
    
    return prompts;
  }, [code, language]);

  const inputCallsCount = useMemo(() => {
    let matches: RegExpMatchArray | null = null;
    
    switch (language) {
      case "python":
        matches = code.match(/input\s*\(/g);
        break;
      case "c":
        matches = code.match(/scanf\s*\(/g);
        break;
      case "cpp":
        matches = code.match(/(cin\s*>>|getline\s*\()/g);
        break;
      case "java":
        matches = code.match(/(\.nextLine\s*\(|\.nextInt\s*\(|\.nextDouble\s*\(|\.next\s*\()/g);
        break;
      case "javascript":
        matches = code.match(/(readline\s*\(|prompt\s*\()/g);
        break;
    }
    
    return matches ? matches.length : 0;
  }, [code, language]);

  const validateInputs = () => {
    if (!hasInputCalls) return true;
    const inputLines = inputs
      .trim()
      .split("\n")
      .filter((line) => line.trim() !== "");
    return inputLines.length >= inputCallsCount;
  };

  const handleRunCode = async () => {
    setOutput("");
    setError("");
    if (hasInputCalls) {
      setShowInputBox(true);
      setActiveTab("console");
    } else {
      await sendCodeAndInputs();
    }
  };

  const sendCodeAndInputs = async () => {
    if (hasInputCalls && !validateInputs()) {
      setError(
        `Input Error: Expected ${inputCallsCount} inputs, but only ${
          inputs
            .trim()
            .split("\n")
            .filter((line) => line.trim() !== "").length
        } provided.`
      );
      return;
    }

    setIsRunning(true);
    setOutput("");
    setError("");
    setActiveTab("console");

    try {
      const url = process.env.NEXT_PUBLIC_COMPILER_URL;
      console.log(url);
      if (!url) {
        const err = "COMPILER_URL is not defined in environment variables.";
        console.error(err);
        setError(err);
        return;
      }

      const res = await fetch(`${url}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code,
          stdin: inputs,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(
          errorData.detail || `Server Error: ${res.status} ${res.statusText}`
        );
        return;
      }

      const data = await res.json();

      // Handle backend response
      if (data.success) {
        setOutput(data.output || "Code executed successfully (no output).");
      } else {
        setError(
          data.error ||
            data.compile_error ||
            "Execution failed. Please check your code."
        );
        setOutput(data.output || "");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error executing code:", error);
      setError(`Execution Error: ${error.message ?? error}`);
    } finally {
      setIsRunning(false);
      setShowInputBox(false);
    }
  };

  const clearOutput = () => {
    setOutput("");
    setError("");
    setShowInputBox(false);
    setInputs("");
  };

  const resetCode = () => {
    const defaultCode = codeTemplates[language] || "";
    setCode(defaultCode);
    localStorage.setItem(`compiler-code-${language}`, defaultCode);
    clearOutput();
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isFullscreen]);

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50" : "h-screen"
      } bg-background flex flex-col overflow-hidden`}
    >
      <div
        className={`lg:hidden flex-1 flex flex-col ${
          isFullscreen ? "hidden" : ""
        }`}
      >
        <MobileHeader
          hasInputCalls={hasInputCalls}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          activeTab={activeTab}
          setShowInputBox={setShowInputBox}
          showInputBox={showInputBox}
          output={output}
          error={error}
          setActiveTab={setActiveTab}
          resetCode={resetCode}
        />

        <div className="bg-background border-b p-2">
          <Button
            onClick={handleRunCode}
            disabled={isRunning}
            className="w-full"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? "Running..." : "Run Code"}
          </Button>
        </div>

        <MobileContent
          activeTab={activeTab}
          code={code}
          setCode={setCode}
          showInputBox={showInputBox}
          setShowInputBox={setShowInputBox}
          hasInputCalls={hasInputCalls}
          inputCallsCount={inputCallsCount}
          getInputPrompts={getInputPrompts}
          inputs={inputs}
          setInputs={setInputs}
          isRunning={isRunning}
          sendCodeAndInputs={sendCodeAndInputs}
          validateInputs={validateInputs}
          clearOutput={clearOutput}
          error={error}
          output={output}
        />
      </div>

      <div
        className={`hidden lg:block flex-1 ${
          isFullscreen ? "fixed inset-0 z-50" : ""
        }`}
      >
        <ResizablePanelGroup direction="horizontal" className="flex-1 h-full">
          <ResizablePanel defaultSize={68} minSize={32} maxSize={90}>
            <DesktopCodeEditor
              code={code}
              setCode={setCode}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              handleRunCode={handleRunCode}
              isRunning={isRunning}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
              resetCode={resetCode}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={32} minSize={20} maxSize={68}>
            <DesktopConsole
              showInputBox={showInputBox}
              hasInputCalls={hasInputCalls}
              inputCallsCount={inputCallsCount}
              getInputPrompts={getInputPrompts}
              inputs={inputs}
              setInputs={setInputs}
              isRunning={isRunning}
              sendCodeAndInputs={sendCodeAndInputs}
              validateInputs={validateInputs}
              setShowInputBox={setShowInputBox}
              clearOutput={clearOutput}
              error={error}
              output={output}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default PythonCompiler;
