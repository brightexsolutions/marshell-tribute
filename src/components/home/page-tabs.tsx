"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AboutTab } from "./about-tab";
import { TributesTab } from "./tributes-tab";
import { TributeModal } from "@/components/tribute/tribute-modal";
import { Fab } from "@/components/layout/fab";

interface PageTabsProps {
  initialCount: number;
}

export function PageTabs({ initialCount }: PageTabsProps) {
  const [tributeCount, setTributeCount] = useState(initialCount);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCountChange = useCallback((delta: number) => {
    setTributeCount((c) => c + delta);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="w-full border-b border-border bg-transparent rounded-none h-auto p-0 justify-start gap-0">
          <TabsTrigger
            value="about"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 sm:px-6 py-3 font-sans text-sm font-medium"
          >
            About Marshell
          </TabsTrigger>
          <TabsTrigger
            value="tributes"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 sm:px-6 py-3 font-sans text-sm font-medium gap-2"
          >
            Tributes
            {tributeCount > 0 && (
              <Badge
                variant="secondary"
                className="text-xs px-1.5 py-0 h-4 min-w-4 font-sans"
              >
                {tributeCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-0 focus-visible:outline-none">
          <AboutTab />
        </TabsContent>

        <TabsContent
          value="tributes"
          className="mt-0 focus-visible:outline-none"
        >
          <TributesTab
            onOpenModal={openModal}
            onCountChange={handleCountChange}
          />
        </TabsContent>
      </Tabs>

      <TributeModal open={modalOpen} onClose={closeModal} />
      <Fab onClick={openModal} />
    </>
  );
}
