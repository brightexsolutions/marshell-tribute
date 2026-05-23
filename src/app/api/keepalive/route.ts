import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Called by Vercel cron every 4 days to keep the Supabase free-tier DB active.
// Supabase pauses free databases after 7 days of inactivity.
export async function GET() {
  try {
    const supabase = createAdminClient();
    await supabase.from("tributes").select("id").limit(1);
    return NextResponse.json({ ok: true, pinged: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
