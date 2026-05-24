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
    <Tabs defaultValue="tributes" className="flex flex-col min-h-screen">
      {/* Sticky full-width header */}
      <div className="sticky top-0 z-20 bg-background border-b border-border shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Title row */}
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="text-lg sm:text-xl font-serif font-semibold text-foreground leading-tight">
                Marshell Memorial — Admin
              </h1>
              <p className="text-xs text-muted-foreground font-sans hidden sm:block">
                Manage tributes, photos, bio and contributions.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-muted-foreground shrink-0">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>

          {/* Tab bar */}
          <TabsList className="w-full bg-transparent rounded-none h-auto p-0 justify-start gap-0 border-b-0 -mb-px overflow-x-auto">
            <TabsTrigger
              value="tributes"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 sm:px-6 py-2.5 font-sans text-sm font-medium whitespace-nowrap"
            >
              Tributes ({tributes.length})
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 sm:px-6 py-2.5 font-sans text-sm font-medium whitespace-nowrap"
            >
              Photos & Bio
            </TabsTrigger>
            <TabsTrigger
              value="contributions"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 sm:px-6 py-2.5 font-sans text-sm font-medium whitespace-nowrap"
            >
              Contributions
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
        <TabsContent value="tributes" className="mt-0 focus-visible:outline-none">
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

        <TabsContent value="photos" className="mt-0 focus-visible:outline-none">
          <PhotosTab />
        </TabsContent>

        <TabsContent value="contributions" className="mt-0 focus-visible:outline-none">
          <ContributionsTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}
