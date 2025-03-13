"use client";

import React, { useRef, useState } from "react";
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
import { Input } from "./ui/input";
import Whatsapp from "./icons/Whatsapp";
import X from "./icons/X";

export default function Share() {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const openLink = (url: string) => window.open(url, "_blank");

  const handleWhatsAppShare = () => {
    openLink(`https://wa.me/?text=${encodeURIComponent(`Check this out! ${currentUrl}`)}`);
  };

  const handleGmailShare = () => {
    openLink(`https://mail.google.com/mail/?view=cm&fs=1&su=Check this out!&body=${encodeURIComponent(currentUrl)}`);
  };

  const handleXShare = () => {
    openLink(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check this out! ${currentUrl}`)}`);
  };

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="border">
          <Share2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit flex flex-col gap-3 p-4">
        <h1 className="font-semibold text-sm text-center">Share the URL</h1>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="icon" variant="outline" onClick={handleWhatsAppShare}>
            <Whatsapp size={24} />
          </Button>
          <Button size="icon" variant="outline" onClick={handleGmailShare}>
            <Mail />
          </Button>
          <Button size="icon" variant="outline" onClick={handleXShare}>
            <X />
          </Button>
        </div>
        <div className="flex items-center gap-2 rounded-md">
          <Input ref={inputRef} value={currentUrl} readOnly />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" onClick={handleCopy}>
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copied ? "Copied!" : "Copy URL"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
