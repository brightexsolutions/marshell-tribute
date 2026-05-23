"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { TributeCard } from "./tribute-card";
import { TributesSkeleton } from "./tributes-skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Tribute } from "@/types/database";
import { Heart, Loader2 } from "lucide-react";

const PAGE_SIZE = 10;

interface TributesTabProps {
  onOpenModal: () => void;
  onCountChange: (delta: number) => void;
}

export function TributesTab({ onOpenModal, onCountChange }: TributesTabProps) {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const offsetRef = useRef(0);
  // Track IDs we already have to deduplicate Realtime inserts
  const knownIds = useRef<Set<string>>(new Set());

  const fetchTributes = async (offset: number, append = false) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tributes")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error || !data) return;

    if (data.length < PAGE_SIZE) setAllLoaded(true);

    data.forEach((t) => knownIds.current.add(t.id));

    setTributes((prev) => (append ? [...prev, ...data] : data));
    offsetRef.current = offset + data.length;
  };

  // Initial fetch
  useEffect(() => {
    fetchTributes(0).finally(() => setLoading(false));
  }, []);

  // Supabase Realtime — subscribe to new inserts from any user
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("tributes-inserts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tributes" },
        (payload) => {
          const newTribute = payload.new as Tribute;
          // Deduplicate: skip if we already have this ID in the list
          if (knownIds.current.has(newTribute.id)) return;
          knownIds.current.add(newTribute.id);
          setTributes((prev) => [newTribute, ...prev]);
          onCountChange(1);
          offsetRef.current += 1;
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onCountChange]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await fetchTributes(offsetRef.current, true);
    setLoadingMore(false);
  };

  if (loading) return <TributesSkeleton />;

  return (
    <div className="py-4 space-y-4">
      {/* Leave tribute button — desktop only (FAB handles mobile) */}
      <div className="hidden sm:flex justify-end">
        <Button onClick={onOpenModal} className="gap-2">
          <Heart className="w-4 h-4" />
          Leave a Tribute
        </Button>
      </div>

      {tributes.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground space-y-2">
          <Heart className="w-8 h-8 mx-auto opacity-40" />
          <p className="font-sans text-sm">
            Be the first to leave a tribute for Marshell.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenModal}
            className="mt-2"
          >
            Leave a Tribute
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {tributes.map((t) => (
              <TributeCard key={t.id} tribute={t} />
            ))}
          </div>

          {!allLoaded && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="gap-2"
              >
                {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                {loadingMore ? "Loading…" : "Load more tributes"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
