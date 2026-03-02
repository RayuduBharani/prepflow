"use client";

import { useState, useEffect } from "react";
import { Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";
import createLinearGradient from "@/lib/createGradient";

const SheetIcon = () => {
  const [gradientClass, setGradientClass] = useState<string>("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGradientClass(createLinearGradient("to-r", { transitions: true }));
  }, []);

  return (
    <div className={cn("p-4 rounded-lg", gradientClass)}>
      <Waypoints />
    </div>
  );
};

export default SheetIcon;
