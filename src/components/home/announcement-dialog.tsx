"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Heart, BookOpen, HandHeart, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
}

function parseBurialDate(raw: string): Date | null {
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    past: false,
  };
}

function formatBurialDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold font-serif tabular-nums"
        style={{
          background: "rgba(251,191,36,0.12)",
          color: "#fbbf24",
          border: "1px solid rgba(251,191,36,0.2)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[10px] uppercase tracking-widest font-sans" style={{ color: "rgba(255,255,255,0.35)" }}>
        {label}
      </span>
    </div>
  );
}

interface AnnouncementDialogProps {
  burialDate: string | null;
  personName: string;
  contributionEnabled: boolean;
  onLeaveTribute: () => void;
  onReadTributes: () => void;
  onSupport: () => void;
}

export function AnnouncementDialog({
  burialDate,
  personName,
  contributionEnabled,
  onLeaveTribute,
  onReadTributes,
  onSupport,
}: AnnouncementDialogProps) {
  const targetDate = useMemo(() => (burialDate ? parseBurialDate(burialDate) : null), [burialDate]);
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [showClosedMsg, setShowClosedMsg] = useState(false);

  // Determine if we're within the 2-day show window
  const inWindow = useMemo(() => {
    if (!targetDate) return false;
    return Date.now() >= targetDate.getTime() - TWO_DAYS_MS;
  }, [targetDate]);

  // Show after loading overlay clears (~3.4s), no session gating — every visit
  useEffect(() => {
    if (!inWindow || !targetDate) return;
    setTimeLeft(getTimeLeft(targetDate));
    const showTimer = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(showTimer);
  }, [inWindow, targetDate]);

  // Live countdown tick
  useEffect(() => {
    if (!visible || !targetDate || timeLeft?.past) return;
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [visible, targetDate, timeLeft?.past]);

  const dismiss = useCallback(() => setVisible(false), []);

  const notifyClosed = useCallback(() => {
    setShowClosedMsg(true);
    setTimeout(() => setShowClosedMsg(false), 3500);
  }, []);

  const handleLeaveTribute = useCallback(() => {
    if (timeLeft?.past) { notifyClosed(); return; }
    dismiss(); onLeaveTribute();
  }, [timeLeft?.past, dismiss, onLeaveTribute, notifyClosed]);

  const handleReadTributes = useCallback(() => { dismiss(); onReadTributes(); }, [dismiss, onReadTributes]);

  const handleSupport = useCallback(() => {
    if (timeLeft?.past) { notifyClosed(); return; }
    dismiss(); onSupport();
  }, [timeLeft?.past, dismiss, onSupport, notifyClosed]);

  if (!visible || !targetDate || !timeLeft) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#16161a", border: "1px solid rgba(251,191,36,0.18)" }}
      >
        {/* Amber top accent bar */}
        <div
          className="h-[3px] w-full"
          style={{ background: "linear-gradient(90deg, transparent, #fbbf24 40%, #fbbf24 60%, transparent)" }}
        />

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 rounded-full p-1.5"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-6 pt-8 pb-7 flex flex-col items-center text-center gap-5">
          {/* Candle */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute rounded-full animate-glow-pulse"
              style={{
                width: 52,
                height: 52,
                background: "radial-gradient(circle, rgba(251,191,36,0.28) 0%, transparent 70%)",
                filter: "blur(6px)",
              }}
            />
            <svg width="30" height="58" viewBox="0 0 56 108" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g className="animate-flicker" style={{ transformOrigin: "28px 52px" }}>
                <path d="M28 4 C22 14 16 24 17 34 C18 46 38 46 39 34 C40 24 34 14 28 4Z" fill="#f59e0b" />
              </g>
              <g className="animate-flicker-inner" style={{ transformOrigin: "28px 52px" }}>
                <path d="M28 14 C25 21 23 28 24 34 C25 40 31 40 32 34 C33 28 31 21 28 14Z" fill="#fef9c3" opacity="0.9" />
              </g>
              <line x1="28" y1="44" x2="28" y2="53" stroke="#92774a" strokeWidth="1.5" strokeLinecap="round" />
              <ellipse cx="28" cy="53" rx="11" ry="3" fill="#e2d5bb" />
              <rect x="17" y="53" width="22" height="48" rx="2" fill="#cdbfa0" />
              <rect x="21" y="57" width="4" height="40" rx="2" fill="#e8dccb" opacity="0.55" />
            </svg>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <p
              className="text-[10px] tracking-[0.35em] uppercase font-sans font-light"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Burial Service
            </p>
            <p className="text-lg font-serif font-semibold leading-snug" style={{ color: "rgba(240,235,224,0.92)" }}>
              {formatBurialDate(targetDate)}
            </p>
          </div>

          {/* Countdown or thank you note */}
          {timeLeft.past ? (
            <div className="text-center space-y-2 px-1">
              <p className="text-base font-serif font-semibold" style={{ color: "rgba(240,235,224,0.88)" }}>
                {personName} is at rest.
              </p>
              <p className="text-sm font-sans leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Thank you to everyone who shared a memory, a kind word, or offered support. Your love means everything to his family.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2.5">
              {timeLeft.days > 0 && <Segment value={timeLeft.days} label="Days" />}
              <Segment value={timeLeft.hours} label="Hours" />
              <Segment value={timeLeft.minutes} label="Mins" />
              <Segment value={timeLeft.seconds} label="Secs" />
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.08)" }} />

          {/* Actions */}
          <div className="w-full space-y-2.5">
            {!timeLeft.past && (
              <p className="text-xs font-sans" style={{ color: "rgba(255,255,255,0.4)" }}>
                Share your memories before the day
              </p>
            )}

            {/* Primary — Leave a Tribute */}
            <Button
              onClick={handleLeaveTribute}
              className={`w-full gap-2 font-sans text-sm transition-colors ${timeLeft.past ? "opacity-40 cursor-not-allowed" : ""}`}
              style={{
                background: "rgba(251,191,36,0.14)",
                border: "1px solid rgba(251,191,36,0.35)",
                color: "#fbbf24",
              }}
              onMouseEnter={(e) => { if (!timeLeft.past) e.currentTarget.style.background = "rgba(251,191,36,0.25)"; }}
              onMouseLeave={(e) => { if (!timeLeft.past) e.currentTarget.style.background = "rgba(251,191,36,0.14)"; }}
            >
              <Heart className="w-3.5 h-3.5" />
              Leave a Tribute
            </Button>

            {/* Secondary row */}
            <div className="flex gap-2">
              {/* Read Tributes — always active */}
              <Button
                onClick={handleReadTributes}
                className="flex-1 gap-1.5 font-sans text-sm"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Read Tributes
              </Button>

              {contributionEnabled && (
                <Button
                  onClick={handleSupport}
                  className={`flex-1 gap-1.5 font-sans text-sm ${timeLeft.past ? "opacity-40 cursor-not-allowed" : ""}`}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                  onMouseEnter={(e) => { if (!timeLeft.past) e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                  onMouseLeave={(e) => { if (!timeLeft.past) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                >
                  <HandHeart className="w-3.5 h-3.5" />
                  Support
                </Button>
              )}
            </div>

            {/* Closed notice — shown briefly after clicking a locked button */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: showClosedMsg ? "40px" : "0px", opacity: showClosedMsg ? 1 : 0 }}
            >
              <p className="text-xs font-sans text-center py-1" style={{ color: "rgba(251,191,36,0.7)" }}>
                Submissions are now closed. Thank you for your support.
              </p>
            </div>

            <button
              onClick={dismiss}
              className="text-xs font-sans w-full py-0.5 transition-colors"
              style={{ color: "rgba(255,255,255,0.28)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
