import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// POST — public contribution submission
export async function POST(req: NextRequest) {
  let body: {
    contributor?: string;
    payment_method?: string;
    mpesa_ref?: string;
    amount?: number;
    note?: string;
    is_anonymous?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { contributor, payment_method = "mpesa", mpesa_ref, amount, note, is_anonymous } = body;

  if (!is_anonymous && !contributor?.trim()) {
    return NextResponse.json({ error: "Your name is required." }, { status: 400 });
  }
  if (payment_method === "mpesa" && !mpesa_ref?.trim()) {
    return NextResponse.json({ error: "M-Pesa reference is required." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contributions")
    .insert({
      contributor: is_anonymous ? "Anonymous" : contributor!.trim(),
      payment_method,
      mpesa_ref: payment_method === "mpesa" ? mpesa_ref!.trim().toUpperCase() : null,
      amount: amount ?? null,
      note: note?.trim() || null,
      is_anonymous: is_anonymous ?? false,
      confirmed: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
