"use client";
import { Button } from "@/components/ui/button";
import { useCompilerStore } from "@/store/compilerStore";
import { Maximize2, Minimize2 } from "lucide-react";
import { useCallback, useEffect } from "react";

export default function FullScreenButton() {
  const { isFullscreen, setIsFullscreen } = useCompilerStore();

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [setIsFullscreen]);

  return (
    <Button 
      variant="secondary" 
      onClick={toggleFullscreen} 
      className="w-8 h-8" 
      size="icon"
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <Minimize2 className="w-4 h-4" strokeWidth={1} />
      ) : (
        <Maximize2 className="w-4 h-4" strokeWidth={1} />
      )}
    </Button>
  );
}
