import { useEffect, useRef, useState } from "react";
import type { Terminal } from "@xterm/xterm";
import type { FitAddon } from "@xterm/addon-fit";
import {
  TERMINAL_CONFIG,
  displayWelcomeMessage,
  createResizeHandler,
} from "@/lib/terminalUtils";

interface UseTerminalOptions {
  fontSize: number;
  onTerminalReady?: (terminal: Terminal) => void;
}

export function useTerminal({ fontSize, onTerminalReady }: UseTerminalOptions) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const visibilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialFontSizeRef = useRef(fontSize);

  const [isReady, setIsReady] = useState(false);

  // Initialize terminal
  useEffect(() => {
    const container = terminalRef.current;
    if (!container) return;

    let handleResize: (() => void) | null = null;
    let orientationHandler: (() => void) | null = null;
    let visibilityObserver: IntersectionObserver | null = null;

    const initTerminal = async () => {
      const { Terminal } = await import("@xterm/xterm");
      const { FitAddon } = await import("@xterm/addon-fit");
      await import("@xterm/xterm/css/xterm.css");

      // Check if container is still mounted after async imports
      if (!container.isConnected) return;

      const term = new Terminal({
        ...TERMINAL_CONFIG,
        fontSize: initialFontSizeRef.current,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      fitAddonRef.current = fitAddon;

      term.open(container);

      setTimeout(() => {
        try {
          fitAddon.fit();
        } catch (e) {
          console.error("Initial fit error:", e);
        }
      }, 0);

      termRef.current = term;
      displayWelcomeMessage(term);
      setIsReady(true);
      onTerminalReady?.(term);

      // Setup resize handler
      handleResize = createResizeHandler(
        fitAddon,
        container,
        resizeTimeoutRef
      );

      orientationHandler = () => {
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }
        resizeTimeoutRef.current = setTimeout(handleResize!, 200);
      };

      // ResizeObserver
      resizeObserverRef.current = new ResizeObserver(() => {
        handleResize!();
      });

      resizeObserverRef.current.observe(container);

      // Visibility observer for mobile tab switching
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && fitAddonRef.current) {
              if (visibilityTimeoutRef.current) {
                clearTimeout(visibilityTimeoutRef.current);
              }

              visibilityTimeoutRef.current = setTimeout(() => {
                try {
                  const rect = container.getBoundingClientRect();
                  if (rect && rect.width > 0 && rect.height > 0) {
                    fitAddonRef.current?.fit();
                  }
                } catch {
                  // Silently handle errors
                }
              }, 250);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "50px",
        }
      );

      visibilityObserver.observe(container);

      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", orientationHandler);
    };

    initTerminal();

    return () => {
      if (handleResize) window.removeEventListener("resize", handleResize);
      if (orientationHandler)
        window.removeEventListener("orientationchange", orientationHandler);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (visibilityObserver) {
        visibilityObserver.disconnect();
      }
      if (termRef.current) {
        termRef.current.dispose();
      }
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only initialize once

  // Handle font size changes
  useEffect(() => {
    if (termRef.current && fitAddonRef.current && terminalRef.current && isReady) {
      termRef.current.options.fontSize = fontSize;

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        try {
          if (fitAddonRef.current && terminalRef.current) {
            const rect = terminalRef.current.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              fitAddonRef.current.fit();
            }
          }
        } catch (e) {
          console.error("Font size change fit error:", e);
        }
      }, 150);
    }
  }, [fontSize, isReady]);

  return {
    terminalRef,
    termRef,
    isReady,
  };
}
