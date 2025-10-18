import { create } from "zustand";
import { persist } from "zustand/middleware";

// -----------------------
// Allowed languages
// -----------------------
type Language = "python" | "c" | "cpp" | "java" | "javascript";

export const ALLOWED_LANGUAGES: Language[] = ["python", "c", "cpp", "java", "javascript"];

// -----------------------
// Language Store
// -----------------------
type LanguageState = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "python",
      setLanguage: (lang: Language) => {
        if (!ALLOWED_LANGUAGES.includes(lang)) lang = "python";
        set({ language: lang });
      },
    }),
    {
      name: "defaultLanguage",
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


// -----------------------
// Font Size Store
// -----------------------
type FontState = {
  fontSize: number;
  setFontSize: (n: number) => void;
};

export const useFontSizeStore = create<FontState>()(
  persist(
    (set) => ({
      fontSize: 14, // default
      setFontSize: (n: number) => {
        const x = Math.min(28, Math.max(14, n));
        set({ fontSize: x });
      },
    }),
    {
      name: "fontSize",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const parsed = Number(state.fontSize);
          // fallback to 14 if null/undefined/NaN
          state.fontSize = Math.min(28, Math.max(14, isNaN(parsed) ? 14 : parsed));
        } else {
          // state can be null if nothing in Local Storage
          return { fontSize: 14 };
        }
      },
    }
  )
);

// -----------------------
// Console Font Size Store
// -----------------------
type ConsoleFontState = {
  consoleFontSize: number;
  setConsoleFontSize: (n: number) => void;
};

export const useConsoleFontSizeStore = create<ConsoleFontState>()(
  persist(
    (set) => ({
      consoleFontSize: 18,
      setConsoleFontSize: (n: number) => {
        const x = Math.min(28, Math.max(14, n));
        set({ consoleFontSize: x });
      },
    }),
    {
      name: "consoleFontSize",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const parsed = Number(state.consoleFontSize);
          state.consoleFontSize = Math.min(
            28,
            Math.max(14, isNaN(parsed) ? 18 : parsed)
          );
        } else {
          return { consoleFontSize: 18 };
        }
      },
    }
  )
);

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
      toggleIntelliSense: () => set((state) => ({ intelliSenseEnabled: !state.intelliSenseEnabled })),
      toggleSnippets: () => set((state) => ({ snippetsEnabled: !state.snippetsEnabled })),
    }),
    {
      name: "editorFeatures",
    }
  )
);

