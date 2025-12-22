import { cn } from "@/lib/utils";
import React from "react";

export default function DotsBackground({ children, className } : {children : React.ReactNode, className? : string}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(var(--primary)_1px,transparent_1px)]",
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_1px,black)]"></div>
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}