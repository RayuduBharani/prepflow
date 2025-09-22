import { create } from "zustand";
import { persist } from "zustand/middleware";

type LanguageState = {
  language: string;
  setLanguage: (lang: string) => void;
};

type FontState = {
  fontSize: number;
  setFontSize: (n: number) => void;
};

type ConsoleFontState = {
  consoleFontSize: number;
  setConsoleFontSize: (n: number) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "python",
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "defaultLanguage",
    }
  )
);

export const useFontSizeStore = create<FontState>((set) => ({
  fontSize: 14,
  setFontSize: (n) => set({ fontSize: n }),
}));

export const useConsoleFontSizeStore = create<ConsoleFontState>((set) => ({
  consoleFontSize: 18,
  setConsoleFontSize: (n) => set({ consoleFontSize: n }),
}));
