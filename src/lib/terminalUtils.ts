import type { Terminal } from "@xterm/xterm";

/**
 * Terminal configuration and theme
 */
export const TERMINAL_CONFIG = {
  cursorBlink: true,
  cursorStyle: "block" as const,
  fontFamily: 'Montserrat, monospace',
  lineHeight: 1,
  theme: {
    background: "#0c0c0c",
    foreground: "#cccccc",
    cursor: "#ffffff",
    cursorAccent: "#000000",
    black: "#0c0c0c",
    red: "#c50f1f",
    green: "#13a10e",
    yellow: "#c19c00",
    blue: "#0037da",
    magenta: "#881798",
    cyan: "#3a96dd",
    white: "#cccccc",
    brightBlack: "#767676",
    brightRed: "#e74856",
    brightGreen: "#16c60c",
    brightYellow: "#f9f1a5",
    brightBlue: "#3b78ff",
    brightMagenta: "#b4009e",
    brightCyan: "#61d6d6",
    brightWhite: "#f2f2f2",
  },
  scrollback: 1000,
  allowTransparency: false,
  windowsMode: false,
};

/**
 * Display welcome message in terminal
 */
export function displayWelcomeMessage(terminal: Terminal) {
  terminal.writeln(
    "\x1b[1;36m$\x1b[0m Ready to execute code. Press Run to start."
  );
  terminal.writeln("");
}

/**
 * Handle terminal input data
 */
export function createInputHandler(
  terminal: Terminal,
  inputBuffer: { current: string },
  sendInput: (input: string) => void
) {
  return (data: string) => {
    // Backspace
    if (data === "\x7f" || data === "\b") {
      const buf = inputBuffer.current;
      if (buf.length > 0) {
        inputBuffer.current = buf.slice(0, -1);
        terminal.write("\b \b");
      }
      return;
    }

    // Enter
    if (data === "\r" || data === "\n") {
      const line = inputBuffer.current;
      terminal.write("\r\n");
      inputBuffer.current = "";
      sendInput(line);
      return;
    }

    // Ignore arrow keys and escape sequences
    if (data.startsWith("\x1b")) return;

    // Otherwise, echo and buffer
    terminal.write(data);
    inputBuffer.current += data;
  };
}

/**
 * Handle terminal keyboard events (e.g., Ctrl+C)
 */
export function createKeyHandler(
  terminal: Terminal,
  sendInput: (input: string) => void
) {
  return ({ domEvent }: { key: string; domEvent: KeyboardEvent }) => {
     
    const hasSelection = (terminal as any)?.hasSelection?.() ?? false;

    if (
      domEvent.ctrlKey &&
      (domEvent.key === "c" || domEvent.key === "C") &&
      !hasSelection
    ) {
      domEvent.preventDefault();
      terminal.write("^C\r\n");
      sendInput("\x03");
    }
  };
}

/**
 * Display execution stopped message
 */
export function displayStoppedMessage(terminal: Terminal) {
  terminal.writeln("");
  terminal.writeln("\x1b[1;33m⚠\x1b[0m Execution stopped by user");
  terminal.write("\x1b[1;36m$\x1b[0m ");
}

/**
 * Debounced resize handler
 */
export function createResizeHandler(
  fitAddon: { fit: () => void },
  containerRef: HTMLDivElement | null,
  timeoutRef: { current: NodeJS.Timeout | null },
  delay = 150
) {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (fitAddon && containerRef) {
        try {
          const rect = containerRef.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            fitAddon.fit();
          }
        } catch (e) {
          console.error("Fit error:", e);
        }
      }
    }, delay);
  };
}
