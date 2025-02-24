"use client";
import setGlobalColorTheme from "@/lib/theme-colors";
import { useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes";

import React, { createContext, useContext, useEffect, useState } from "react";


const ThemeContext = createContext<ThemeColorStateParams>(
  {} as ThemeColorStateParams
);

export default function ThemeDataProvider({ children }: ThemeProviderProps) {
  const getSavedThemeColor = (): ThemeColors => {
    if (typeof window !== "undefined") {
      try {
        return (localStorage.getItem("themeColor") as ThemeColors) || "Green";
      } catch (error) {
        console.error(error);
      }
    }
    return "Green" as ThemeColors; // Default theme if localStorage is not available
  };

  const [themeColor, setThemeColor] = useState<ThemeColors>(getSavedThemeColor());
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    localStorage.setItem("themeColor", themeColor);
    setGlobalColorTheme(theme as "light" | "dark", themeColor);

    if (!isMounted) {
      setIsMounted(true);
    }
  }, [themeColor, theme, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}