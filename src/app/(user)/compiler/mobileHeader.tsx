'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Minus,
  Plus,
  Terminal,
  Code,
  RotateCcw,
  Lightbulb,
  FileCode2,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LanguageSelector from './LanguageSelector';
import { useFontSizeStore, useEditorFeaturesStore } from '@/store/compilerStore';

export default function MobileHeader({
    hasInputCalls,
    activeTab,
    setActiveTab,
    output,
    error,
    showInputBox,
    resetCode
}: { 
    hasInputCalls: boolean,
    isDarkMode: boolean,
    setIsDarkMode: (value: boolean) => void,
    activeTab: 'code' | 'console',
    setActiveTab: (tab: 'code' | 'console') => void,
    output?: string,
    error?: string,
    showInputBox?: boolean,
    setShowInputBox?: (value: boolean) => void,
    setOutput?: (value: string) => void,
    setError?: (value: string) => void,
    setShowConsole?: (value: boolean) => void,
    resetCode?: () => void,
}) {

  const {fontSize, setFontSize} = useFontSizeStore()
  const { intelliSenseEnabled, snippetsEnabled, toggleIntelliSense, toggleSnippets } = useEditorFeaturesStore();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleResetClick = () => {
    setShowResetDialog(true);
  };

  const handleConfirmReset = () => {
    if (resetCode) {
      resetCode();
    }
    setShowResetDialog(false);
  };
  
  return (
    <>
    <div className="bg-background border-b p-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              {hasInputCalls && (
                <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Needs Input
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={toggleIntelliSense}
                    variant={intelliSenseEnabled ? "default" : "outline"}
                    size="sm"
                    className="h-7 w-7 p-0"
                    aria-label="Toggle IntelliSense"
                  >
                    <Lightbulb className={`h-3 w-3 ${intelliSenseEnabled ? '' : 'opacity-70'}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="bg-popover text-popover-foreground rounded-md px-2 py-1 shadow-md"
                >
                  <p className="text-xs font-medium">IntelliSense: {intelliSenseEnabled ? "ON" : "OFF"}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={toggleSnippets}
                    variant={snippetsEnabled ? "default" : "outline"}
                    size="sm"
                    className="h-7 w-7 p-0"
                    aria-label="Toggle Snippets"
                  >
                    <FileCode2 className={`h-3 w-3 ${snippetsEnabled ? '' : 'opacity-70'}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="bg-popover text-popover-foreground rounded-md px-2 py-1 shadow-md"
                >
                  <p className="text-xs font-medium">Snippets: {snippetsEnabled ? "ON" : "OFF"}</p>
                </TooltipContent>
              </Tooltip>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetClick}
                className="h-7 w-7 p-0"
                aria-label="Reset code"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              <div className="flex items-center space-x-1 border rounded">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                  className="h-7 w-7 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-xs px-1 min-w-[20px] text-center">{fontSize}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'code' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('code')}
              className="flex-1"
            >
              <Code className="h-4 w-4 mr-1" />
              Code
            </Button>
            <Button
              variant={activeTab === 'console' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('console')}
              className="flex-1"
            >
              <Terminal className="h-4 w-4 mr-1" />
              Console
              {(output || error || showInputBox) && (
                <div className="w-2 h-2 bg-green-500 rounded-full ml-1" />
              )}
            </Button>
          </div>
        </div>

      {/* Reset Code Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-orange-500" />
              Reset Code?
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Are you sure you want to reset the code to default? This action will discard all your current changes and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowResetDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
