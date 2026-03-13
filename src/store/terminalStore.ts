import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Centralized WebSocket and output buffer
let socket: WebSocket | null = null;

export interface TerminalOutput {
  type: 'output' | 'error' | 'info';
  data: string;
}

interface TerminalState {
  status: 'idle' | 'running' | 'error';
  setStatus: (status: 'idle' | 'running' | 'error') => void;
  terminalFontSize: number;
  setTerminalFontSize: (n: number) => void;
  // WebSocket output buffer and controls
  outputBuffer: TerminalOutput[];
  setOutputBuffer: (output: TerminalOutput[]) => void;
  addOutput: (output: TerminalOutput) => void;
  clearOutputBuffer: () => void;
  startWebSocket: (code: string, language: string) => void;
  stopWebSocket: () => void;
  sendInput: (input: string) => void;
}

export const useTerminalStore = create<TerminalState>()(
  persist(
    (set) => ({
      status: 'idle',
      setStatus: (status) => set({ status }),
      terminalFontSize: 14,
      setTerminalFontSize: (n: number) => {
        // Clamp the font size between 14 and 24
        const clampedSize = Math.max(14, Math.min(24, n));
        set({ terminalFontSize: clampedSize });
      },
      outputBuffer: [],
      setOutputBuffer: (output) => set({ outputBuffer: output }),
      addOutput: (output) => set((state) => ({ outputBuffer: [...state.outputBuffer, output] })),
      clearOutputBuffer: () => set({ outputBuffer: [] }),
      startWebSocket: (code, language) => {
        const url =
        process.env.NEXT_PUBLIC_COMPILER_WS_URL ||
        "ws://localhost:8000/ws/execute";
        if (socket) return;
        set({ status: 'running' });
        socket = new WebSocket(url);
        socket.onopen = () => {
          socket?.send(JSON.stringify({ code, language }));
          set((state) => ({
            outputBuffer: [
              ...state.outputBuffer,
              { type: 'info', data: `\x1b[1;32m✓\x1b[0m Executing ${language} code...\r\n\r\n\x1b[2m─────── Output ───────\x1b[0m\r\n\x1b[2m(Press Ctrl+C to stop)\x1b[0m\r\n` }
            ]
          }));
        };
        socket.onmessage = async (event) => {
          let data: string;
          if (typeof event.data === "string") {
            data = event.data;
          } else if (event.data instanceof Blob) {
            data = new TextDecoder().decode(await event.data.arrayBuffer());
          } else if (event.data instanceof ArrayBuffer) {
            data = new TextDecoder().decode(event.data);
          } else {
            data = String(event.data);
          }
          data = data.replace(/\n/g, "\r\n");
          set((state) => ({
            outputBuffer: [...state.outputBuffer, { type: 'output', data }]
          }));
        };
        socket.onclose = () => {
          set((state) => ({
            outputBuffer: [...state.outputBuffer, { type: 'info', data: "\r\n\x1b[2m──────────────────────\x1b[0m\r\n\x1b[1;32m✓\x1b[0m Execution completed\r\n\x1b[1;36m$\x1b[0m " }],
            status: 'idle'
          }));
          socket = null;
        };
        socket.onerror = (err) => {
          // Prevent onclose from also firing "Execution completed" after an error
          if (socket) socket.onclose = null;
          set((state) => ({
            outputBuffer: [...state.outputBuffer, { type: 'error', data: `\r\n\x1b[1;31m✗\x1b[0m Connection error: ${err.type}\r\n\x1b[1;36m$\x1b[0m ` }],
            status: 'idle'
          }));
          socket = null;
        };
      },
      stopWebSocket: () => {
        if (socket) {
          // Null out handlers before closing so onclose doesn't show
          // "Execution completed" after a manual stop
          socket.onclose = null;
          socket.onerror = null;
          socket.close();
          socket = null;
        }
        set({ status: 'idle' });
      },
      sendInput: (input) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(input);
        }
      },
    }),
    {
      name: 'terminal-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist terminalFontSize, not the status
      partialize: (state) => ({ terminalFontSize: state.terminalFontSize }),
    }
  )
);
