"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { TributesTable } from "./tributes-table";
import { PhotosTab } from "./photos-tab";
import { ContributionsTab } from "./contributions-tab";
import { PdfExportButton } from "./pdf-export-button";
import { toast } from "sonner";
import type { Tribute } from "@/types/database";

interface AdminTabsProps {
  tributes: Tribute[];
}

export function AdminTabs({ tributes: initial }: AdminTabsProps) {
  const router = useRouter();
  const [tributes, setTributes] = useState<Tribute[]>(initial);
  const [refreshing, setRefreshing] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.replace("/admin-login");
  };

  const refresh = useCallback(async (): Promise<Tribute[]> => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/tributes", { cache: "no-store" });
      if (res.ok) {
        const fresh: Tribute[] = await res.json();
        setTributes(fresh);
        return fresh;
      } else {
        toast.error("Failed to refresh tributes.");
        return tributes;
      }
    } finally {
      setRefreshing(false);
    }
  }, [tributes]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">
            Marshell Memorial — Admin
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-sans">
            Manage tributes, upload photos, and edit the bio.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-muted-foreground">
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </Button>
      </div>

      <Tabs defaultValue="tributes" className="w-full">
        <TabsList className="w-full border-b border-border bg-transparent rounded-none h-auto p-0 justify-start gap-0">
          <TabsTrigger
            value="tributes"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 sm:px-6 py-3 font-sans text-sm font-medium"
          >
            Tributes ({tributes.length})
          </TabsTrigger>
          <TabsTrigger
            value="photos"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 sm:px-6 py-3 font-sans text-sm font-medium"
          >
            Marshell&apos;s Photos & Bio
          </TabsTrigger>
          <TabsTrigger
            value="contributions"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 sm:px-6 py-3 font-sans text-sm font-medium"
          >
            Contributions
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="tributes"
          className="mt-0 pt-6 focus-visible:outline-none"
        >
          <div className="flex items-center justify-end gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing…" : "Refresh"}
            </Button>
            <PdfExportButton tributes={tributes} onBeforeDownload={refresh} />
          </div>
          <TributesTable
            tributes={tributes}
            onDelete={(id) => setTributes((prev) => prev.filter((t) => t.id !== id))}
          />
        </TabsContent>

        <TabsContent
          value="photos"
          className="mt-0 pt-6 focus-visible:outline-none"
        >
          <PhotosTab />
        </TabsContent>

        <TabsContent
          value="contributions"
          className="mt-0 pt-6 focus-visible:outline-none"
        >
          <ContributionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
