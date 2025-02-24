import React from "react";
import { Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";
import createLinearGradient from "@/lib/createGradient";
const SheetIcon = () => {
  return (
    <div
      className={cn(
        "p-4 rounded-lg",
        createLinearGradient("to-r", { transitions: true })
      )}
    >
      <Waypoints />
    </div>
  );
};

export default SheetIcon;
