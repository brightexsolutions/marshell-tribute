"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  displayName: string;
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
  displayName,
}: PageTabsProps) {
  const [tributeCount, setTributeCount] = useState(initialCount);
  const [activeTab, setActiveTab] = useState("about");
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const tributesTabRef = useRef<TributesTabHandle>(null);

  useEffect(() => {
    const onScroll = () => setScrolledPastHero(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        {/* Sticky tab bar — extends full width by countering parent padding */}
        <div className="sticky top-0 z-20 bg-background -mx-4 sm:-mx-6 px-4 sm:px-6 border-b border-border shadow-sm">
          {/* Compact name bar — fades in once hero scrolls away */}
          <div
            className={`overflow-hidden transition-all duration-200 ${
              scrolledPastHero ? "max-h-12 opacity-100 pt-2.5 pb-1" : "max-h-0 opacity-0"
            }`}
          >
            <p className="text-sm font-serif font-semibold text-foreground leading-none">{displayName}</p>
            <p className="text-[11px] text-muted-foreground font-sans mt-0.5">In Loving Memory</p>
          </div>

          {/* Tab row */}
          <div className="flex items-center justify-between">
            <TabsList className="bg-transparent rounded-none h-auto p-0 justify-start gap-0 border-b-0">
              <TabsTrigger
                value="about"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 sm:px-6 py-3 font-sans text-sm font-medium"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="tributes"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 sm:px-6 py-3 font-sans text-sm font-medium"
              >
                Tributes ({tributeCount})
              </TabsTrigger>
              {contributionEnabled && (
                <TabsTrigger
                  value="support"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 sm:px-6 py-3 font-sans text-sm font-medium"
                >
                  Support
                </TabsTrigger>
              )}
            </TabsList>
            <div className="hidden sm:block pb-1">
              <Button size="sm" onClick={openModal} className="gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                Leave a Tribute
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="about" className="mt-0 focus-visible:outline-none">
          <AboutTab bio={bio} galleryImages={galleryImages} />
        </TabsContent>

        <TabsContent value="tributes" className="mt-0 focus-visible:outline-none">
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
