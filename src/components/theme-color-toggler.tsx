"use client";

import { useTheme } from "next-themes";
import { useThemeContext } from "./theme-data-provider"; // Ensure this exists
import { themeColors } from "@/lib/theme-registry";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; // Adjusted path
import { Palette } from "lucide-react";

interface ThemeColor {
  name: string;
  label: ThemeColors;
  activeColor: {
    light: string; // e.g., "200, 50%, 50%"
    dark: string;  // e.g., "200, 70%, 40%"
  };
}

// Type the themeColors array (ensure this matches your theme-registry)
const typedThemeColors: ThemeColor[] = themeColors as ThemeColor[];

export function ThemeColorToggle() {
  const { setThemeColor } = useThemeContext(); // Ensure this returns { setThemeColor: (color: ThemeColors) => void }
  const { theme } = useTheme(); // "light" | "dark" | "system"

  const createDropItems = () => {
    return typedThemeColors.map((tc) => (
      <DropdownMenuItem
        key={tc.name} // Ensure tc.name is unique
        onClick={() => setThemeColor(tc.label as ThemeColors)}
        className="flex items-center gap-2 py-2 cursor-pointer"
      >
        <div
          className="w-4 h-4 rounded-full"
          style={{
            backgroundColor:
              theme === "light"
                ? `hsl(${tc.activeColor.light})`
                : `hsl(${tc.activeColor.dark})`,
          }}
        />
        <span className="text-sm text-muted-foreground">
          {tc.label}
        </span>
      </DropdownMenuItem>
    ));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Change color variant"
          variant="outline"
          size="icon"
        >
          <Palette className="h-5 w-5 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-48 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Choose Color Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        {createDropItems()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}