"use client";

import { Heart } from "lucide-react";

interface FabProps {
  onClick: () => void;
}

export function Fab({ onClick }: FabProps) {
  return (
    <button
      onClick={onClick}
      className="sm:hidden fixed bottom-6 right-5 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all font-sans text-sm font-medium"
      aria-label="Leave a tribute"
    >
      <Heart className="w-4 h-4" />
      Leave a Tribute
    </button>
  );
}
