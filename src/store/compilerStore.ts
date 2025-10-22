import { create } from "zustand";
import { persist } from "zustand/middleware";
import { codeTemplates } from "@/lib/codeTemplates";

// -----------------------
// Allowed languages
// -----------------------
type Language = "python" | "c" | "cpp" | "java" | "javascript";

export const ALLOWED_LANGUAGES: Language[] = [
  "python",
  "c",
  "cpp",
  "java",
  "javascript",
];

// Utility for creating clamped number stores
type ClampedNumberState = {
  value: number;
  setValue: (n: number) => void;
};

export const createClampedNumberStore = (
  name: string,
  initialValue: number,
  minVal: number,
  maxVal: number
) => {
  return create<ClampedNumberState>()(
    persist(
      (set) => ({
        value: initialValue,
        setValue: (n: number) => {
          const clamped = Math.min(maxVal, Math.max(minVal, n));
          set({ value: clamped });
        },
      }),
      {
        name,
        onRehydrateStorage: () => (state) => {
          if (state) {
            const parsed = Number(state.value);
            state.value = Math.min(
              maxVal,
              Math.max(minVal, isNaN(parsed) ? initialValue : parsed)
            );
          } else {
            return { value: initialValue };
          }
        },
      }
    )
  );
};

// -----------------------
// Font Store (merged editor and console)
// -----------------------
type FontState = {
  editorFontSize: number;
  setEditorFontSize: (n: number) => void;
  consoleFontSize: number;
  setConsoleFontSize: (n: number) => void;
};

export const useFontStore = create<FontState>()(
  persist(
    (set) => ({
      editorFontSize: 14,
      setEditorFontSize: (n: number) => {
        const x = Math.min(28, Math.max(14, n));
        set({ editorFontSize: x });
      },
      consoleFontSize: 18,
      setConsoleFontSize: (n: number) => {
        const x = Math.min(28, Math.max(14, n));
        set({ consoleFontSize: x });
      },
    }),
    {
      name: "font-settings",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const editorParsed = Number(state.editorFontSize);
          state.editorFontSize = Math.min(
            28,
            Math.max(14, isNaN(editorParsed) ? 14 : editorParsed)
          );

          const consoleParsed = Number(state.consoleFontSize);
          state.consoleFontSize = Math.min(
            28,
            Math.max(14, isNaN(consoleParsed) ? 18 : consoleParsed)
          );
        } else {
          return { editorFontSize: 14, consoleFontSize: 18 };
        }
      },
    }
  )
);

// Legacy compatibility (if needed elsewhere)
export const useFontSizeStore = () => {
  const { editorFontSize: fontSize, setEditorFontSize: setFontSize } =
    useFontStore();
  return { fontSize, setFontSize };
};

export const useConsoleFontSizeStore = () => {
  const { consoleFontSize, setConsoleFontSize } = useFontStore();
  return { consoleFontSize, setConsoleFontSize };
};

// -----------------------
// Editor Features Store
// -----------------------
type EditorFeaturesState = {
  intelliSenseEnabled: boolean;
  snippetsEnabled: boolean;
  toggleIntelliSense: () => void;
  toggleSnippets: () => void;
};

export const useEditorFeaturesStore = create<EditorFeaturesState>()(
  persist(
    (set) => ({
      intelliSenseEnabled: true,
      snippetsEnabled: true,
      toggleIntelliSense: () =>
        set((state) => ({ intelliSenseEnabled: !state.intelliSenseEnabled })),
      toggleSnippets: () =>
        set((state) => ({ snippetsEnabled: !state.snippetsEnabled })),
    }),
    {
      name: "editorFeatures",
    }
  )
);

// -----------------------
// Compiler Store (merged with Language)
// -----------------------
type CompilerState = {
  language: Language;
  code: string;
  activeTab: "editor" | "terminal";
  isDarkMode: boolean;
  isFullscreen: boolean;

  setLanguage: (lang: Language) => void;
  setCode: (code: string) => void;
  setActiveTab: (activeTab: "editor" | "terminal") => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  resetCode: () => void;
};

export const useCompilerStore = create<CompilerState>()(
  persist(
    (set, get) => ({
      language: "python",
      code: "",
      activeTab: "editor",
      isDarkMode: true,
      isFullscreen: false,

      setLanguage: (lang: Language) => {
        if (!ALLOWED_LANGUAGES.includes(lang)) lang = "python";
        set({ language: lang });
      },

      setCode: (code: string) => {
        set({ code });
        localStorage.setItem(`compiler-code-${get().language}`, code);
      },

      setActiveTab: (activeTab: "editor" | "terminal") => set({ activeTab }),

      setIsDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),

      setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),

      resetCode: () => {
        const { language } = get();
        const defaultCode = codeTemplates[language] || "";
        set({ code: defaultCode });
        localStorage.setItem(`compiler-code-${language}`, defaultCode);
      },   }),
    {
      name: "compiler-storage",
      partialize: (state) => ({
        code: state.code,
        activeTab: state.activeTab,
        isDarkMode: state.isDarkMode,
        isFullscreen: state.isFullscreen,
        language: state.language,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!ALLOWED_LANGUAGES.includes(state.language)) {
            state.language = "python";
          }
        } else {
          return { language: "python" };
        }
      },
    }
  )
);

// Legacy compatibility for useLanguageStore
export const useLanguageStore = () => {
  const { language, setLanguage } = useCompilerStore();
  return { language, setLanguage };
};
