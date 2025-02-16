import { themeColors } from "@/lib/theme-registry";

// Define the type for theme colors
type ThemeColors = {
  label: string;
  cssVars: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
};

// Module-level variables to manage media query listeners
let mediaQueryList: MediaQueryList | null = null;
let mediaQueryListener: ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null = null;

/**
 * Applies the theme by setting CSS variables on the document root.
 * @param color - The color theme to apply.
 * @param themeMode - The theme mode ("light" or "dark").
 */
function applyTheme(color: ThemeColors["label"], themeMode: "light" | "dark") {
  // Find the theme object based on the color label
  const theme = themeColors.find((t) => t.label === color);

  if (!theme) {
    console.warn(`Theme "${color}" not found.`);
    return;
  }

  // Safeguard: Ensure cssVars exists for the specified themeMode
  const cssVars = theme.cssVars[themeMode];
  if (!cssVars) {
    console.warn(`CSS variables for theme mode "${themeMode}" not found in theme "${color}".`);
    return;
  }

  // Apply each CSS variable to the document root
  for (const [key, value] of Object.entries(cssVars)) {
    document.documentElement.style.setProperty(`--${key}`, value);
  }
}

/**
 * Sets the global color theme based on the specified mode and color.
 * @param themeMode - The theme mode ("light", "dark", or "system").
 * @param color - The color theme to apply.
 */
export default function setGlobalColorTheme(
  themeMode: "light" | "dark" | "system",
  color: ThemeColors["label"]
) {
  // Clean up existing media query listeners to avoid memory leaks
  if (mediaQueryListener && mediaQueryList) {
    mediaQueryList.removeListener(mediaQueryListener);
    mediaQueryList = null;
    mediaQueryListener = null;
  }

  let currentThemeMode: "light" | "dark" = themeMode === "system" ? "light" : themeMode;

  // Handle system theme mode
  if (themeMode === "system") {
    // Check the system preference for dark mode
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    currentThemeMode = systemDark.matches ? "dark" : "light";

    // Add a listener for system theme changes
    mediaQueryList = systemDark;
    mediaQueryListener = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      applyTheme(color, newTheme);
    };
    mediaQueryList.addListener(mediaQueryListener);
  }

  // Apply the theme
  applyTheme(color, currentThemeMode);
}

/**
 * Cleanup function to remove media query listeners when no longer needed.
 */
export function cleanupGlobalColorTheme() {
  if (mediaQueryListener && mediaQueryList) {
    mediaQueryList.removeListener(mediaQueryListener);
    mediaQueryList = null;
    mediaQueryListener = null;
  }
}