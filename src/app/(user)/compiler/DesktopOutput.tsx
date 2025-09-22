"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import DisplayLoader from "./DisplayLoader";

interface DesktopOutputProps {
  error: string;
  fontSize: number;
  output: string;
  isRunning: boolean;
  showInputBox: boolean;
  hasInputCalls: boolean;
}

export default function DesktopOutput({
  error,
  fontSize,
  output,
  isRunning,
  showInputBox,
  hasInputCalls,
}: DesktopOutputProps) {
  return (
    <div className="flex-1 p-4">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        Output
      </div>
      <div className="flex-1 min-h-0">
        {error && (
          <Alert className="mb-4">
            <AlertDescription className="font-mono text-sm whitespace-pre-wrap">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {output && (
          <div
            className={cn(
              `border max-h-[calc(90vh-8rem)] overflow-y-auto border-muted rounded-md bg-background p-4 font-mono whitespace-pre-wrap text-foreground shadow-sm`
            )}
            style={{fontSize : `${fontSize}px`}}
          >
            {output}
            <p className="pt-10 text-muted-foreground text-xs">
              === Code Execution Successful ===
            </p>
          </div>
        )}

        {!output && !error && !isRunning && !showInputBox && (
          <div className="text-muted-foreground text-center py-12 flex flex-col items-center">
            <div className="text-4xl mb-4">▷</div>
            <p className="text-sm">
              Click &rdquo;Run&rdquo; to execute your code
            </p>
            <p className="text-xs mt-2 text-muted-foreground">
              Practice your coding skills with PrepFlow
            </p>
            {hasInputCalls && (
              <p className="text-xs mt-2 text-primary">
                This code requires inputs
              </p>
            )}
          </div>
        )}

        {isRunning && (
          <div className="text-primary text-center py-12 flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-4" />
            <DisplayLoader />
          </div>
        )}
      </div>
    </div>
  );
}
