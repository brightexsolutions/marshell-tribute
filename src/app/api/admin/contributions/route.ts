import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET — list all contributions
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// PATCH — toggle confirmed / update amount (?id=uuid)
export async function PATCH(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const body = await req.json();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contributions")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — remove a contribution (?id=uuid)
export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("contributions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// POST — admin manually adds a past contribution
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { contributor, payment_method = "mpesa", mpesa_ref, amount, note, confirmed, is_anonymous } = body;

  if (!contributor?.trim()) return NextResponse.json({ error: "Name required." }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contributions")
    .insert({
      contributor: contributor.trim(),
      payment_method,
      mpesa_ref: payment_method === "mpesa" ? (mpesa_ref?.trim().toUpperCase() || null) : null,
      amount: amount ?? null,
      note: note?.trim() || null,
      is_anonymous: is_anonymous ?? false,
      confirmed: confirmed ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
