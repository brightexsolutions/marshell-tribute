"use client";

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { TributeCard } from "./tribute-card";
import { TributesSkeleton } from "./tributes-skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Tribute } from "@/types/database";
import { Heart, Loader2 } from "lucide-react";

const PAGE_SIZE = 10;

export interface TributesTabHandle {
  prependTribute: (tribute: Tribute) => void;
}

interface TributesTabProps {
  onOpenModal: () => void;
  onCountChange: (delta: number) => void;
  onSyncCount: (total: number) => void;
}

export const TributesTab = forwardRef<TributesTabHandle, TributesTabProps>(
  function TributesTab({ onOpenModal, onCountChange, onSyncCount }, ref) {
    const [tributes, setTributes] = useState<Tribute[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [allLoaded, setAllLoaded] = useState(false);
    const offsetRef = useRef(0);
    const knownIds = useRef<Set<string>>(new Set());

    useImperativeHandle(ref, () => ({
      prependTribute(tribute: Tribute) {
        if (knownIds.current.has(tribute.id)) return;
        knownIds.current.add(tribute.id);
        setTributes((prev) => [tribute, ...prev]);
        onCountChange(1);
        offsetRef.current += 1;
      },
    }));

    const fetchTributes = async (offset: number, append = false) => {
      const supabase = createClient();
      const { data, error, count } = await supabase
        .from("tributes")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error || !data) return;
      if (data.length < PAGE_SIZE) setAllLoaded(true);
      data.forEach((t) => knownIds.current.add(t.id));
      setTributes((prev) => (append ? [...prev, ...data] : data));
      offsetRef.current = offset + data.length;

      // Sync the true total on initial load so the tab badge is always accurate
      if (offset === 0 && count !== null) onSyncCount(count);
    };

    useEffect(() => {
      fetchTributes(0).finally(() => setLoading(false));
    }, []);

    // Supabase Realtime — live updates from other visitors
    useEffect(() => {
      const supabase = createClient();
      const channel = supabase
        .channel("tributes-inserts")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "tributes" },
          (payload) => {
            const newTribute = payload.new as Tribute;
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
                  {loadingMore && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {loadingMore ? "Loading…" : "Load more tributes"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);
