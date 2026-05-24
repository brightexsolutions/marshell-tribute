"use client";

import { useEffect, useState } from "react";

export function LoadingOverlay({ name }: { name: string }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out" | "gone">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 300);
    const t2 = setTimeout(() => setPhase("out"), 3500);
    const t3 = setTimeout(() => setPhase("gone"), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
        phase === "out" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ backgroundColor: "#16161a" }}
    >
      {/* Content block fades in after a beat */}
      <div
        className={`flex flex-col items-center gap-7 transition-opacity duration-500 ${
          phase === "in" ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Candle */}
        <div className="relative flex flex-col items-center">

          {/* Soft glow halo behind the flame */}
          <div
            className="absolute animate-glow-pulse rounded-full"
            style={{
              width: 72, height: 72,
              top: -10,
              background: "radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />

          <svg width="56" height="108" viewBox="0 0 56 108" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* ── Outer flame ── */}
            <g className="animate-flicker" style={{ transformOrigin: "28px 52px" }}>
              <path
                d="M28 4 C22 14 16 24 17 34 C18 46 38 46 39 34 C40 24 34 14 28 4Z"
                fill="#f59e0b"
              />
            </g>

            {/* ── Inner flame highlight ── */}
            <g className="animate-flicker-inner" style={{ transformOrigin: "28px 52px" }}>
              <path
                d="M28 14 C25 21 23 28 24 34 C25 40 31 40 32 34 C33 28 31 21 28 14Z"
                fill="#fef9c3"
                opacity="0.9"
              />
            </g>

            {/* ── Wick ── */}
            <line x1="28" y1="44" x2="28" y2="53" stroke="#92774a" strokeWidth="1.5" strokeLinecap="round" />

            {/* ── Wax pool (top of candle) ── */}
            <ellipse cx="28" cy="53" rx="11" ry="3" fill="#e2d5bb" />

            {/* ── Candle body ── */}
            <g className="animate-drip">
              <rect x="17" y="53" width="22" height="48" rx="2" fill="#cdbfa0" />
              {/* Highlight stripe */}
              <rect x="21" y="57" width="4" height="40" rx="2" fill="#e8dccb" opacity="0.55" />
            </g>

            {/* ── Tiny wax drip on left side ── */}
            <path
              d="M17 68 Q14 74 16 80 Q17 84 17 84 L17 68Z"
              fill="#c4b090"
              opacity="0.7"
            />
          </svg>
        </div>

        {/* Text — staggered fade-up */}
        <div className="text-center space-y-2.5">
          <p
            className="text-[11px] tracking-[0.4em] uppercase font-sans font-light animate-fade-up"
            style={{ color: "rgba(255,255,255,0.38)", animationDelay: "0.1s", opacity: 0 }}
          >
            In Loving Memory
          </p>
          <p
            className="text-2xl sm:text-3xl font-serif font-semibold animate-fade-up"
            style={{ color: "rgba(240,235,224,0.88)", animationDelay: "0.35s", opacity: 0 }}
          >
            {name}
          </p>
          <p
            className="text-[11px] tracking-[0.2em] font-sans font-light animate-fade-up"
            style={{ color: "rgba(255,255,255,0.2)", animationDelay: "0.6s", opacity: 0 }}
          >
            · · ·
          </p>
        </div>
      </div>
    </div>
  );
}
