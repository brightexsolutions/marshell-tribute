"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TributesTable } from "./tributes-table";
import { PhotosTab } from "./photos-tab";
import { PdfExportButton } from "./pdf-export-button";
import type { Tribute } from "@/types/database";

interface AdminTabsProps {
  tributes: Tribute[];
}

export function AdminTabs({ tributes }: AdminTabsProps) {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">
            Marshell Memorial — Admin
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-sans">
            Manage tributes, upload photos, and edit the bio.
          </p>
        </div>
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
        </TabsList>

        <TabsContent
          value="tributes"
          className="mt-0 pt-6 focus-visible:outline-none"
        >
          <div className="flex justify-end mb-4">
            <PdfExportButton tributes={tributes} />
          </div>
          <TributesTable tributes={tributes} />
        </TabsContent>

        <TabsContent
          value="photos"
          className="mt-0 pt-6 focus-visible:outline-none"
        >
          <PhotosTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
