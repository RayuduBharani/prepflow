"use client";
import { useTheme } from "next-themes";
import { useThemeContext } from "./theme-data-provider";
import { themeColors } from "@/lib/theme-registry";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "./ui/button";
import { Palette } from "lucide-react";

export function ThemeColorToggle() {
  const {setThemeColor} = useThemeContext();
  const { theme } = useTheme();
  const createDropItems = () => {
    return themeColors.map((tc) => (
      <DropdownMenuItem onClick={() => setThemeColor(tc.label as ThemeColors)} className="flex gap-1 py-2" key={tc.name}>
        <div
          className="w-4 h-4 rounded-full"
          style={{
            backgroundColor:
              theme === "light"
                ? `hsl(${tc.activeColor.light})`
                : `hsl(${tc.activeColor.dark})`,
          }}
        ></div>
        <p className="text-sm">{tc.label}</p>
      </DropdownMenuItem>
    ));
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <Palette className="text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-48 overflow-y-auto scrollbar-hide">
        <DropdownMenuLabel className="text-xs font-normal">
          Choose Color Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {createDropItems()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
