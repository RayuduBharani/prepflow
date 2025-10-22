import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RotateCcw } from "lucide-react";

interface ResetCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function ResetCodeDialog({
  open,
  onOpenChange,
  onConfirm,
}: ResetCodeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-orange-500" />
            Reset Code?
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Are you sure you want to reset the code to default? This action will
            discard all your current changes and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
