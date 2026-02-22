"use client";

import React, { useState } from "react";
import { CheckIcon, CopyIcon, Mail, Share2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import Whatsapp from "./icons/Whatsapp";
import X from "./icons/X";

const currentUrl = () =>
  typeof window !== "undefined" ? window.location.href : "";

const SHARE_OPTIONS = [
  {
    label: "WhatsApp",
    icon: <Whatsapp size={18} />,
    href: (url: string) =>
      `https://wa.me/?text=${encodeURIComponent(`Check this out!\n${url}`)}`,
  },
  {
    label: "Gmail",
    icon: <Mail className="h-4 w-4" />,
    href: (url: string) =>
      `https://mail.google.com/mail/?view=cm&fs=1&su=Check this out!&body=${encodeURIComponent(url)}`,
  },
  {
    label: "X / Twitter",
    icon: <X className="h-4 w-4" />,
    href: (url: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check this out! ${url}`)}`,
  },
] as const;

export default function Share() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg"
                aria-label="Share"
              >
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>

        <DropdownMenuContent
          align="end"
          className="w-72 p-4 rounded-xl flex flex-col gap-4"
        >
          {/* Header */}
          <div>
            <p className="text-sm font-semibold">Share this page</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send to a friend via your favourite platform
            </p>
          </div>

          {/* Platform buttons */}
          <div className="grid grid-cols-3 gap-2">
            {SHARE_OPTIONS.map(({ label, icon, href }) => (
              <button
                key={label}
                onClick={() => window.open(href(currentUrl()), "_blank")}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-muted/30 py-3 text-[11px] font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Copy URL row */}
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
            <span className="flex-1 truncate text-xs text-muted-foreground font-mono">
              {currentUrl()}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={handleCopy}
                  aria-label={copied ? "Copied!" : "Copy URL"}
                >
                  {copied ? (
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <CopyIcon className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copied ? "Copied!" : "Copy URL"}</TooltipContent>
            </Tooltip>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}