import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { MAX_PHOTOS } from "@/config/constants";

const BUCKET = "marshell-gallery";

// GET — list all photos
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — upload a new photo
export async function POST(req: NextRequest) {
  const supabase = createAdminClient();

  // Check current count
  const { count } = await supabase
    .from("photos")
    .select("*", { count: "exact", head: true });

  if ((count ?? 0) >= MAX_PHOTOS) {
    return NextResponse.json(
      { error: `Maximum of ${MAX_PHOTOS} photos reached.` },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const storagePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  const { data: photo, error: dbError } = await supabase
    .from("photos")
    .insert({ url: urlData.publicUrl, storage_path: storagePath, is_primary: false })
    .select()
    .single();

  if (dbError) {
    // rollback storage upload
    await supabase.storage.from(BUCKET).remove([storagePath]);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(photo, { status: 201 });
}

// DELETE — remove a photo by id (pass ?id=uuid)
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = createAdminClient();
  const { data: photo } = await supabase
    .from("photos")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await supabase.storage.from(BUCKET).remove([photo.storage_path]);
  await supabase.from("photos").delete().eq("id", id);

  return NextResponse.json({ ok: true });
}
