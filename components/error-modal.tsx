"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  details?: string;
}

export function ErrorModal({
  isOpen,
  onClose,
  title = "Authentication Error",
  message,
  details,
}: ErrorModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="border-border/50 bg-card/95 backdrop-blur-sm sm:max-w-md">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="bg-destructive/20 border-destructive/30 flex h-10 w-10 items-center
                justify-center rounded-full border"
            >
              <AlertTriangle className="text-destructive h-5 w-5" />
            </div>
            <DialogTitle className="text-foreground text-lg font-semibold">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-left">
            {message}
          </DialogDescription>
          {details && (
            <div className="bg-muted/50 border-border/50 rounded-lg border p-3">
              <p className="text-muted-foreground font-mono text-sm">
                {details}
              </p>
            </div>
          )}
        </DialogHeader>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Try Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
