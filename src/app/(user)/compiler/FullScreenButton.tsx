"use client";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

type FullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
};

export default function FullScreenButton({
  onToggleFullscreen,
}: {
  onToggleFullscreen: () => void;
}) {
  const [isFull, setIsFull] = useState(false);

  // Keep state in sync with actual fullscreen changes
  useEffect(() => {
    const handleChange = () => {
      setIsFull(!!document.fullscreenElement);
      onToggleFullscreen();
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, [onToggleFullscreen]);

  const toggleFullscreen = useCallback(() => {
    const doc = document as FullscreenDocument;
    const el = document.documentElement as FullscreenElement;

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  }, []);

  return (
    <Button variant={'secondary'} onClick={toggleFullscreen} className="w-8 h-8" size="icon">
      {isFull ? (
        <Minimize2 className="w-4 h-4" strokeWidth={1} />
      ) : (
        <Maximize2 className="w-4 h-4" strokeWidth={1} />
      )}
    </Button>
  );
}
