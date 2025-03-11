"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(currentUrl)}`;
    window.open(whatsappUrl, "_blank");
    setIsOpen(false);
  };

  const handleGmailShare = () => {
    const subject = encodeURIComponent("Check this out!");
    const body = encodeURIComponent(
      `Hey, I found this interesting: ${currentUrl}`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
    setIsOpen(false);
  };

  const handleXShare = () => {
    const text = encodeURIComponent("Check this out!");
    const twitterUrl = `https://twitter.com/messages/compose?recipient_id=${text}&url=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(twitterUrl, "_blank");
    setIsOpen(false);
  };

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={"sm"}
            className="border"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Share2 />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit flex flex-col gap-3 p-4">
          <h1 className="font-semibold text-sm text-center">Share the URL</h1>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="icon"
              variant="outline"
              onClick={handleWhatsAppShare}
            >
              <Whatsapp size={24} />
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={handleGmailShare}
            >
              <Mail />
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={handleXShare}
            >
              <X />
            </Button>
          </div>
          <div className="flex items-center gap-2 rounded-md">
            <Input ref={inputRef} value={currentUrl} readOnly className="" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline" onClick={handleCopy}>
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? "Copied!" : "Copy URL"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
