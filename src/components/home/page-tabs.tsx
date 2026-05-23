"use client";

import { useState, useCallback, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AboutTab } from "./about-tab";
import { TributesTab, TributesTabHandle } from "./tributes-tab";
import { TributeModal } from "@/components/tribute/tribute-modal";
import { Fab } from "@/components/layout/fab";
import type { Tribute } from "@/types/database";
import type { GalleryImage } from "@/config/images";

interface PageTabsProps {
  initialCount: number;
  bio: string;
  galleryImages: GalleryImage[];
}

export function PageTabs({ initialCount, bio, galleryImages }: PageTabsProps) {
  const [tributeCount, setTributeCount] = useState(initialCount);
  const [modalOpen, setModalOpen] = useState(false);
  const tributesTabRef = useRef<TributesTabHandle>(null);

  const handleCountChange = useCallback((delta: number) => {
    setTributeCount((c) => c + delta);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleTributeSubmitted = useCallback((tribute: Tribute) => {
    tributesTabRef.current?.prependTribute(tribute);
  }, []);

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
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 sm:px-6 py-3 font-sans text-sm font-medium"
          >
            Tributes ({tributeCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-0 focus-visible:outline-none">
          <AboutTab bio={bio} galleryImages={galleryImages} />
        </TabsContent>

        <TabsContent
          value="tributes"
          className="mt-0 focus-visible:outline-none"
        >
          <TributesTab
            ref={tributesTabRef}
            onOpenModal={openModal}
            onCountChange={handleCountChange}
          />
        </TabsContent>
      </Tabs>

      <TributeModal
        open={modalOpen}
        onClose={closeModal}
        onTributeSubmitted={handleTributeSubmitted}
      />
      <Fab onClick={openModal} />
    </>
  );
}
