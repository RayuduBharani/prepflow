'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MobileHeader from "./mobileHeader";
import MobileContent from "./mobileContent";
import DesktopCodeEditor from "./DesktopCodeEditor";
import { Play } from "lucide-react";
import DesktopConsole from "./DesktopConsole";

const PythonCompiler: React.FC = () => {
  const [code, setCode] = useState(`# Write your Python code here\n`);
  const [inputs, setInputs] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [activeTab, setActiveTab] = useState<'code' | 'console'>('code');
  const [fontSize, setFontSize] = useState<number>(14);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load fontSize from localStorage on client-side only
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }
  }, []);

  const hasInputCalls = useMemo(() => {
    const inputRegex = /input\s*\(/g;
    return inputRegex.test(code);
  }, [code]);

  const getInputPrompts = useMemo(() => {
    const prompts: string[] = [];
    const inputRegex = /input\s*\(\s*["']([^"']*)["']\s*\)/g;
    let match;
    while ((match = inputRegex.exec(code)) !== null) {
      prompts.push(match[1]);
    }
    return prompts;
  }, [code]);

  const inputCallsCount = useMemo(() => {
    const matches = code.match(/input\s*\(/g);
    return matches ? matches.length : 0;
  }, [code]);

  const validateInputs = () => {
    if (!hasInputCalls) return true;
    const inputLines = inputs.trim().split('\n').filter(line => line.trim() !== '');
    return inputLines.length >= inputCallsCount;
  };

  const handleRunCode = () => {
    setOutput('');
    setError('');
    if (hasInputCalls) {
      setShowInputBox(true);
      setActiveTab('console'); 
    } else {
      sendCodeAndInputs();
    }
  };

  const sendCodeAndInputs = async () => {
    if (hasInputCalls && !validateInputs()) {
      setError(`Input Error: Expected ${inputCallsCount} inputs, but only ${inputs.trim().split('\n').filter(line => line.trim() !== '').length} provided.`);
      return;
    }

    setIsRunning(true);
    setOutput('');
    setError('');
    setActiveTab('console');

    
    console.log(code, inputs);
    try {
      const response = await fetch('https://aws-compiler.onrender.com/run-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer cygnuxxsrayudu",
        },
        body: JSON.stringify({ code : code, inputs: inputs }),
      });
      
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        setOutput(data.output);
      } catch {
        setError(text);
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setError(`Execution Error: ${error}`);
    } finally {
      setIsRunning(false);
      setShowInputBox(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
    setError('');
    setShowInputBox(false);
    setInputs('');
  };

  const testBackendConnection = async () => {
    try {
      const response = await fetch('https://aws-compiler.onrender.com/');
      if (response.ok) {
        setBackendStatus('connected');
        setError('');
      } else {
        setBackendStatus('disconnected');
        setError('Backend server is not responding properly');
      }
    } catch (error) {
      console.log(error);
      setBackendStatus('disconnected');
      setError('Cannot connect to backend server. Please ensure it is running.');
    }
  };

  React.useEffect(() => {
    testBackendConnection();
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isFullscreen]);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} bg-background flex flex-col overflow-hidden`}>
      <div className={`lg:hidden flex-1 flex flex-col ${isFullscreen ? 'hidden' : ''}`}>
        <MobileHeader
          hasInputCalls={hasInputCalls}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          activeTab={activeTab}
          setShowInputBox={setShowInputBox}
          showInputBox={showInputBox}
          fontSize={fontSize}
          setFontSize={setFontSize}
          output={output}
          error={error}
          setActiveTab={setActiveTab}
        />

        <div className="bg-background border-b p-2">
          <Button onClick={handleRunCode} disabled={isRunning} className="w-full" size="sm">
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </div>

        <MobileContent
          activeTab={activeTab}
          code={code}
          setCode={setCode}
          fontSize={fontSize}
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

      <div className={`hidden lg:block flex-1 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        <ResizablePanelGroup direction="horizontal" className="flex-1 h-full">
          <ResizablePanel defaultSize={68} minSize={32} maxSize={90}>
            <DesktopCodeEditor
              code={code}
              setCode={setCode}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              fontSize={fontSize}
              setFontSize={setFontSize}
              handleRunCode={handleRunCode}
              isRunning={isRunning}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
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
}

export default PythonCompiler;
