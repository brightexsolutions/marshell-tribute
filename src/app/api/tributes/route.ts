import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ── Rate limiting (in-memory, best-effort per warm instance) ──────────────
const ipLog = new Map<string, number>();
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const last = ipLog.get(ip);
  return !!last && Date.now() - last < RATE_WINDOW_MS;
}

function recordSubmission(ip: string) {
  ipLog.set(ip, Date.now());
  if (ipLog.size > 2000) {
    const cutoff = Date.now() - RATE_WINDOW_MS;
    Array.from(ipLog.entries()).forEach(([k, v]) => { if (v < cutoff) ipLog.delete(k); });
  }
}

// ── Spam / hate-speech detection ──────────────────────────────────────────
const BLOCKED_PATTERNS = [
  // spam patterns
  /\b(buy now|click here|free money|earn cash|make money fast|limited offer|act now|winner|congratulations you (have|won))\b/i,
  // excessive URL-like content
  /https?:\/\/\S+/gi,
  // repeated characters (e.g. "aaaaaaaaaa")
  /(.)\1{9,}/,
  // hate speech — common slurs (kept minimal, covers obvious cases)
  /\b(k[i1]ll (your|him|her|them|all)|hate speech|go die)\b/i,
];

function isSpam(text: string): boolean {
  if (BLOCKED_PATTERNS.some((p) => p.test(text))) return true;
  // All-caps shouting: >80% uppercase letters in a message longer than 30 chars
  const letters = text.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 30 && letters.replace(/[a-z]/g, "").length / letters.length > 0.8)
    return true;
  return false;
}

// ── POST — submit a tribute ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Please wait a moment before submitting another tribute." },
      { status: 429 }
    );
  }

  let body: {
    name?: string | null;
    contact?: string | null;
    message?: string;
    is_anonymous?: boolean;
    relationship?: string | null;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, contact, message, is_anonymous, relationship } = body;

  // Basic validation
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Tribute message is required." }, { status: 400 });
  }
  if (message.trim().length > 2000) {
    return NextResponse.json({ error: "Message must be 2000 characters or less." }, { status: 400 });
  }
  if (!is_anonymous && (!name || !name.trim())) {
    return NextResponse.json({ error: "Name is required unless submitting anonymously." }, { status: 400 });
  }

  // Spam / hate-speech check
  const textToCheck = [message, name, relationship].filter(Boolean).join(" ");
  if (isSpam(textToCheck)) {
    return NextResponse.json(
      {
        error:
          "Your tribute could not be submitted as it appears to contain inappropriate content. Please revise and try again.",
      },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Duplicate message check (same content within last 5 minutes)
  const since = new Date(Date.now() - 5 * 60_000).toISOString();
  const { data: dupes } = await supabase
    .from("tributes")
    .select("id")
    .eq("message", message.trim())
    .gte("created_at", since)
    .limit(1);

  if (dupes && dupes.length > 0) {
    return NextResponse.json(
      { error: "This tribute was already submitted recently." },
      { status: 400 }
    );
  }

  const { data: tribute, error } = await supabase
    .from("tributes")
    .insert({
      name: is_anonymous ? null : (name?.trim() || null),
      contact: is_anonymous ? null : (contact?.trim() || null),
      message: message.trim(),
      is_anonymous: is_anonymous ?? false,
      relationship: relationship ?? null,
    })
    .select()
    .single();

  if (error || !tribute) {
    return NextResponse.json({ error: "Failed to save tribute." }, { status: 500 });
  }

  recordSubmission(ip);
  return NextResponse.json(tribute, { status: 201 });
}
