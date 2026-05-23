"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { formatRelative } from "@/lib/utils";
import type { Tribute } from "@/types/database";

interface TributeCardProps {
  tribute: Tribute;
}

export function TributeCard({ tribute }: TributeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const displayName = tribute.is_anonymous || !tribute.name
    ? "Anonymous"
    : tribute.name;
  const initial = displayName === "Anonymous" ? null : displayName[0].toUpperCase();
  const isLong = tribute.message.length > 280;

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5 space-y-3">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-none w-10 h-10 rounded-full bg-primary/10 border border-border flex items-center justify-center">
          {initial ? (
            <span className="text-primary font-serif font-semibold text-base leading-none">
              {initial}
            </span>
          ) : (
            <Heart className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        {/* Name + time */}
        <div className="flex-1 min-w-0">
          <p className="font-sans font-semibold text-foreground text-sm leading-snug">
            {displayName}
          </p>
          <p className="text-muted-foreground text-xs mt-0.5">
            {formatRelative(tribute.created_at)}
          </p>
        </div>
      </div>

      {/* Message */}
      <p className="font-sans text-foreground/80 text-sm leading-relaxed">
        {isLong && !expanded
          ? tribute.message.slice(0, 280) + "…"
          : tribute.message}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
