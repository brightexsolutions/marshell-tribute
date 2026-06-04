export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createAdminClient();
  const [countResult, recentResult] = await Promise.all([
    supabase.from("candles").select("*", { count: "exact", head: true }),
    supabase.from("candles").select("id, created_at").order("created_at", { ascending: false }).limit(30),
  ]);
  return NextResponse.json({
    count: countResult.count ?? 0,
    recent: recentResult.data ?? [],
  });
}

export async function POST() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("candles").insert({}).select("id, created_at").single();
  if (error) return NextResponse.json({ error: "Failed to light candle." }, { status: 500 });
  const { count } = await supabase.from("candles").select("*", { count: "exact", head: true });
  return NextResponse.json({ count: count ?? 0, candle: data });
}
