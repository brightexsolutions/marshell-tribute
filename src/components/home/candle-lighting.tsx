"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Flame, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_VISIBLE = 30;

interface Candle {
  id: string;
  created_at: string;
}

// 12:00 PM EAT = 09:00 UTC on burial date
// Use local date components so "June 5, 2026" resolves to the correct calendar day
// (in EAT/UTC+3, new Date("June 5, 2026") lands on June 4 in UTC — local methods fix this)
function getDeadline(raw: string | null): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0, 0));
}

function MiniCandleSvg({ flickerDelay, floatDelay }: { flickerDelay: number; floatDelay: number }) {
  return (
    <div
      className="animate-candle-float"
      style={{ animationDelay: `${floatDelay}ms`, animationDuration: `${2800 + floatDelay % 800}ms` }}
    >
      <svg width="16" height="38" viewBox="0 0 56 108" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 0 5px rgba(251,191,36,0.55))" }}>
        <g className="animate-flicker" style={{ transformOrigin: "28px 52px", animationDelay: `${flickerDelay}ms` }}>
          <path d="M28 4 C22 14 16 24 17 34 C18 46 38 46 39 34 C40 24 34 14 28 4Z" fill="#f59e0b" />
        </g>
        <g className="animate-flicker-inner" style={{ transformOrigin: "28px 52px", animationDelay: `${flickerDelay + 200}ms` }}>
          <path d="M28 14 C25 21 23 28 24 34 C25 40 31 40 32 34 C33 28 31 21 28 14Z" fill="#fef9c3" opacity="0.9" />
        </g>
        <line x1="28" y1="44" x2="28" y2="53" stroke="#92774a" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="28" cy="53" rx="11" ry="3" fill="#e2d5bb" />
        <rect x="17" y="53" width="22" height="48" rx="2" fill="#cdbfa0" />
        <rect x="21" y="57" width="4" height="40" rx="2" fill="#e8dccb" opacity="0.55" />
      </svg>
    </div>
  );
}

interface CandleLightingProps {
  burialDate: string | null;
  displayName: string;
}

export function CandleLighting({ burialDate, displayName }: CandleLightingProps) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [count, setCount] = useState(0);
  const [newCandleId, setNewCandleId] = useState<string | null>(null);
  const [lighting, setLighting] = useState(false);
  const [lit, setLit] = useState(false);
  const [isPast, setIsPast] = useState(false);
  const newCandleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // useMemo prevents a new Date object on every render, which would loop the useEffect
  const deadline = useMemo(() => getDeadline(burialDate), [burialDate]);

  useEffect(() => {
    if (deadline) setIsPast(Date.now() >= deadline.getTime());
    setLit(!!localStorage.getItem("candle_lit"));

    fetch("/api/candles")
      .then((r) => r.json())
      .then((d) => {
        setCount(d.count ?? 0);
        setCandles((d.recent ?? []).slice(0, MAX_VISIBLE));
      })
      .catch(() => {});
  }, [deadline]);

  const handleLight = useCallback(async () => {
    if (lighting || lit || isPast) return;
    setLighting(true);
    try {
      const res = await fetch("/api/candles", { method: "POST" });
      if (!res.ok) return;
      const data = await res.json();
      setCount(data.count);
      setCandles((prev) => {
        const updated = [data.candle, ...prev].slice(0, MAX_VISIBLE);
        return updated;
      });
      setNewCandleId(data.candle.id);
      localStorage.setItem("candle_lit", "1");
      setLit(true);
      if (newCandleTimer.current) clearTimeout(newCandleTimer.current);
      newCandleTimer.current = setTimeout(() => setNewCandleId(null), 700);
    } finally {
      setLighting(false);
    }
  }, [lighting, lit, isPast]);

  useEffect(() => () => { if (newCandleTimer.current) clearTimeout(newCandleTimer.current); }, []);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#16161a" }}>
      {/* Ambient glow at top */}
      <div
        className="h-24 w-full"
        style={{
          background: "radial-gradient(ellipse at 50% -10%, rgba(251,191,36,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="px-5 pb-8 -mt-8 flex flex-col items-center gap-6">
        {/* Candle field */}
        <div
          className="w-full min-h-[96px] flex flex-wrap justify-center items-end gap-x-3 gap-y-4 px-2"
          aria-label="Candles lit in memory"
        >
          {candles.length === 0 ? (
            <p className="text-xs font-sans py-6" style={{ color: "rgba(255,255,255,0.2)" }}>
              Be the first to light a candle
            </p>
          ) : (
            candles.map((c, i) => {
              const isNew = c.id === newCandleId;
              const flickerDelay = (i * 317) % 1800;
              const floatDelay = (i * 491) % 1200;
              return (
                <div
                  key={c.id}
                  className={isNew ? "animate-candle-pop" : ""}
                  style={isNew ? { opacity: 0 } : {}}
                >
                  <MiniCandleSvg flickerDelay={flickerDelay} floatDelay={floatDelay} />
                </div>
              );
            })
          )}
        </div>

        {/* Counter */}
        <div className="text-center space-y-0.5">
          <p className="text-2xl font-serif font-bold" style={{ color: "rgba(251,191,36,0.9)" }}>
            {count.toLocaleString()}
          </p>
          <p className="text-xs font-sans tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>
            {count === 1 ? "candle lit" : "candles lit"} in memory of {displayName}
          </p>
        </div>

        {/* Divider */}
        <div className="w-24 h-px" style={{ background: "rgba(251,191,36,0.15)" }} />

        {/* CTA */}
        {isPast ? (
          <div className="text-center space-y-1">
            <p className="text-sm font-sans" style={{ color: "rgba(255,255,255,0.45)" }}>
              Candles remain lit in his memory.
            </p>
            <p className="text-xs font-sans" style={{ color: "rgba(255,255,255,0.25)" }}>
              Tribute submissions have closed.
            </p>
          </div>
        ) : lit ? (
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-sans"
              style={{ background: "rgba(251,191,36,0.12)", color: "rgba(251,191,36,0.8)", border: "1px solid rgba(251,191,36,0.2)" }}
            >
              <Check className="w-3.5 h-3.5" />
              Your candle is lit
            </div>
          </div>
        ) : (
          <Button
            onClick={handleLight}
            disabled={lighting}
            className="gap-2 px-6 rounded-full font-sans text-sm"
            style={{
              background: "rgba(251,191,36,0.14)",
              border: "1px solid rgba(251,191,36,0.35)",
              color: "#fbbf24",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(251,191,36,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(251,191,36,0.14)")}
          >
            <Flame className="w-4 h-4" />
            {lighting ? "Lighting…" : "Light a Candle"}
          </Button>
        )}

        {!isPast && !lit && (
          <p className="text-[11px] font-sans text-center -mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>
            Open until 12:00 PM · {burialDate}
          </p>
        )}
      </div>
    </div>
  );
}
