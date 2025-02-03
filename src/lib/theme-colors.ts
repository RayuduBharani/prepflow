import { themeColors } from "@/lib/theme-registry";

export default function setGlobalColorTheme(
  themeMode: "light" | "dark" | "system",
  color: ThemeColors
) {
  // Set themeMode to "light" or "dark" if it's "system"
  if (themeMode === "system") {
    // Detect the system theme
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    themeMode = systemTheme;
  }

  const theme = themeColors.find((t) => t.label === color);

  if (!theme) {
    console.warn(`Theme "${color}" not found.`);
    return;
  }

  const cssVars = theme.cssVars[themeMode];

  for (const [key, value] of Object.entries(cssVars)) {
    document.documentElement.style.setProperty(`--${key}`, value);
  }
}
