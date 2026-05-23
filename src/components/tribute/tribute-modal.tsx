"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TributeForm } from "./tribute-form";

interface TributeModalProps {
  open: boolean;
  onClose: () => void;
}

export function TributeModal({ open, onClose }: TributeModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Leave a Tribute
          </DialogTitle>
          <DialogDescription className="font-sans text-sm">
            Share a memory, a word of comfort, or a prayer for Marshell and his
            family.
          </DialogDescription>
        </DialogHeader>
        <TributeForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
