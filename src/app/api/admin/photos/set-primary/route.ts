import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PATCH — set a photo as primary (pass ?id=uuid)
export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = createAdminClient();

  // Clear existing primary
  await supabase.from("photos").update({ is_primary: false }).eq("is_primary", true);

  // Set new primary
  const { error } = await supabase
    .from("photos")
    .update({ is_primary: true })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
