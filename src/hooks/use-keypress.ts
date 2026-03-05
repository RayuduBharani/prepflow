import { useEffect, useRef } from "react";

type KeyPressCallback = (event: KeyboardEvent) => void;

export function useKeyPress(key: string, callback: KeyPressCallback) {
  const callbackRef = useRef<KeyPressCallback>(callback);

  // Keep latest callback without reattaching listener
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Use composedPath to pierce through Shadow DOMs and reliably identify the event origin
      const eventPath = e.composedPath ? e.composedPath() : [e.target];

      for (const node of eventPath) {
        // Skip non-DOM elements like window or document
        if (!(node instanceof Element)) continue;

        const tagName = node.tagName?.toLowerCase();

        // 1. Ignore standard inputs (tagName is safer than instanceof across contexts)
        if (tagName === "input" || tagName === "textarea" || tagName === "select") {
          return;
        }

        // 2. Ignore content-editable elements
        if ((node as HTMLElement).isContentEditable) {
          return;
        }

        // 3. Ignore Monaco Editor specifically
        // Monaco types into a hidden textarea with class "inputarea"
        // The overall container has the class "monaco-editor"
        if (
          node.classList?.contains("monaco-editor") ||
          node.classList?.contains("inputarea")
        ) {
          return;
        }
      }

      // Execute shortcut logic if not inside an input/editor
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        e.preventDefault();
        callbackRef.current(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key]);
}