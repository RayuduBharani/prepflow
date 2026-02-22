"use client";
import { forwardRef, useImperativeHandle } from "react";
import { useTerminalStore } from "@/store/terminalStore";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useCompilerStore } from "@/store/compilerStore";
import { useTerminal } from "@/hooks/use-terminal";
import { useTerminalIO } from "@/hooks/use-terminal-io";
import useMedia from "@/hooks/use-media";

export interface LiveTerminalRef {
  run: () => void;
  stop: () => void;
}

interface LiveTerminalProps {
  code: string;
  language: string;
  onClose?: () => void;
}

const LiveTerminal = forwardRef<LiveTerminalRef, LiveTerminalProps>(
  ({ code, language }, ref) => {
    const { terminalFontSize, setTerminalFontSize } = useTerminalStore();
    const { setActiveTab } = useCompilerStore();
    const isDesktop = useMedia("(min-width: 1024px)");

    // Initialize terminal
    const { terminalRef, termRef, isReady } = useTerminal({
      fontSize: terminalFontSize,
    });

    // Setup input/output handling
    const { run, stop } = useTerminalIO({
      terminal: termRef.current,
      getTerminal: () => termRef.current,
    });

    // Handle run button click
    const handleRun = () => {
      // Only switch tabs on mobile, on desktop both panels are visible
      if (!isDesktop) {
        setActiveTab("terminal");
      }
      console.log('[LiveTerminal] handleRun called, termRef.current:', termRef.current, 'isReady:', isReady);
      run(code, language);
    };

    // Handle stop button click
    const handleStop = () => {
      stop();
    };

    // Expose run/stop methods via ref
    useImperativeHandle(ref, () => ({
      run: handleRun,
      stop: handleStop,
    }));

    // Handle font size changes
    const handleFontSize = (increment: boolean) => {
      if (increment) {
        setTerminalFontSize(terminalFontSize + 1);
      } else {
        setTerminalFontSize(terminalFontSize - 1);
      }
    };

    return (
      <div className="w-full h-full flex flex-col">
        <div className="terminal-header bg-primary/10 px-3 sm:px-4 py-2 flex items-center gap-2 rounded-t-lg shrink-0">
          <div className="flex gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs sm:text-sm ml-2">Bash</span>
          <div className="flex text-xs items-center gap-2 ml-auto">
            <Button
              onClick={() => handleFontSize(false)}
              size="icon"
              variant="secondary"
              className="h-8 w-8"
            >
              <Minus />
            </Button>
            <span>{terminalFontSize}</span>
            <Button
              onClick={() => handleFontSize(true)}
              size="icon"
              className="h-8 w-8"
              variant="secondary"
            >
              <Plus />
            </Button>
          </div>
        </div>
        <div
          ref={terminalRef}
          className="w-full flex-1 border border-secondary rounded-b-lg overflow-hidden min-h-75 sm:min-h-100 lg:min-h-125"
        />
      </div>
    );
  }
);

LiveTerminal.displayName = "LiveTerminal";

export default LiveTerminal;
