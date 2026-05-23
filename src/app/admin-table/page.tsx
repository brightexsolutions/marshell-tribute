import { AdminTabs } from "@/components/admin/admin-tabs";
import { createAdminClient } from "@/lib/supabase/server";
import type { Tribute } from "@/types/database";

async function getAllTributes(): Promise<Tribute[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("tributes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch tributes:", error);
    return [];
  }
  return data ?? [];
}

export const dynamic = "force-dynamic";

export default async function AdminTablePage() {
  const tributes = await getAllTributes();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AdminTabs tributes={tributes} />
      </div>
    </div>
  );
}
