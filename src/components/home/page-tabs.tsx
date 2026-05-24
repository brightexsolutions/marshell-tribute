"use client";

import { useState, useCallback, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { AboutTab } from "./about-tab";
import { TributesTab, TributesTabHandle } from "./tributes-tab";
import { SupportTab } from "./support-tab";
import { TributeModal } from "@/components/tribute/tribute-modal";
import { Fab } from "@/components/layout/fab";
import type { Tribute } from "@/types/database";
import type { GalleryImage } from "@/config/images";

interface PageTabsProps {
  initialCount: number;
  bio: string;
  galleryImages: GalleryImage[];
  contributionEnabled: boolean;
  contributionMethod: string;
  contributionPhone: string;
  contributionName: string;
  contributionNote: string;
}

export function PageTabs({
  initialCount,
  bio,
  galleryImages,
  contributionEnabled,
  contributionMethod,
  contributionPhone,
  contributionName,
  contributionNote,
}: PageTabsProps) {
  const [tributeCount, setTributeCount] = useState(initialCount);
  const [activeTab, setActiveTab] = useState("about");
  const [modalOpen, setModalOpen] = useState(false);
  const tributesTabRef = useRef<TributesTabHandle>(null);

  const handleCountChange = useCallback((delta: number) => {
    setTributeCount((c) => c + delta);
  }, []);

  const openModal = useCallback(() => {
    setActiveTab("tributes");
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleTributeSubmitted = useCallback((tribute: Tribute) => {
    setActiveTab("tributes");
    tributesTabRef.current?.prependTribute(tribute);
  }, []);

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-end justify-between border-b border-border">
          <TabsList className="bg-transparent rounded-none h-auto p-0 justify-start gap-0 border-b-0">
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
            {contributionEnabled && (
              <TabsTrigger
                value="support"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 sm:px-6 py-3 font-sans text-sm font-medium"
              >
                Support
              </TabsTrigger>
            )}
          </TabsList>
          <div className="hidden sm:block pb-2">
            <Button size="sm" onClick={openModal} className="gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              Leave a Tribute
            </Button>
          </div>
        </div>

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
            onSyncCount={setTributeCount}
          />
        </TabsContent>

        {contributionEnabled && (
          <TabsContent value="support" className="mt-0 focus-visible:outline-none">
            <SupportTab
              method={contributionMethod}
              phone={contributionPhone}
              recipientName={contributionName}
              note={contributionNote}
            />
          </TabsContent>
        )}
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
