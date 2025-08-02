"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette } from "lucide-react";
import { baseColorsV4 } from "@/lib/colors-registry";
import { useTheme } from "next-themes";
import setGlobalColorTheme from "@/lib/theme-colors";
import { useThemeContext } from "./theme-data-provider";

export function ThemeChanger() {
  const { theme } = useTheme();
  const { setThemeColor } = useThemeContext();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className="hover:text-primary text-muted-foreground hover:border hover:bg-transparent">
          <Palette color="currentColor" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[10rem] w-fit">
        <DropdownMenuLabel className="text-xs">Choose your theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {baseColorsV4.map((tc) => (
          <DropdownMenuItem
            key={tc.name}
            onSelect={() => {
              setGlobalColorTheme(theme as ThemeMode, tc.label);
              setThemeColor(tc.label as ThemeColors)
            }}
          >
            <div
              style={{
                backgroundColor:
                  theme === "dark" ? tc.dark.primary : tc.light.primary,
              }}
              className={`w-4 h-4 rounded-full`}
            ></div>
            {tc.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
