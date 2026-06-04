"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import type { Tribute } from "@/types/database";

interface TributesTableProps {
  tributes: Tribute[];
  onDelete: (id: string) => void;
}

export function TributesTable({ tributes, onDelete }: TributesTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tribute? This cannot be undone.")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/tributes?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      onDelete(id);
      toast.success("Tribute deleted.");
    } else {
      toast.error("Failed to delete tribute.");
    }
    setDeletingId(null);
  };

  if (tributes.length === 0) {
    return (
      <div className="rounded-lg border border-border py-12 text-center text-sm text-muted-foreground font-sans">
        No tributes submitted yet.
      </div>
    );
  }

  return (
    <>
      {/* ── Mobile: card layout ─────────────────────────────────────────── */}
      <div className="sm:hidden space-y-3">
        {tributes.map((tribute) => (
          <div key={tribute.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {tribute.is_anonymous || !tribute.name ? (
                    <Badge variant="secondary" className="font-normal text-xs">Anonymous</Badge>
                  ) : (
                    <span className="font-medium text-sm">{tribute.name}</span>
                  )}
                  {tribute.relationship && (
                    <span className="text-xs text-muted-foreground">· {tribute.relationship}</span>
                  )}
                </div>
                {tribute.contact && (
                  <p className="text-xs text-muted-foreground mt-0.5">{tribute.contact}</p>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                disabled={deletingId === tribute.id}
                onClick={() => handleDelete(tribute.id)}
              >
                {deletingId === tribute.id
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Trash2 className="w-3.5 h-3.5" />}
              </Button>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">{tribute.message}</p>
            <p className="text-xs text-muted-foreground mt-2">{formatDateTime(tribute.created_at)}</p>
          </div>
        ))}
      </div>

      {/* ── Desktop: table layout ────────────────────────────────────────── */}
      <div className="hidden sm:block rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="table-fixed w-full">
            <colgroup>
              <col className="w-10" />
              <col className="w-36" />
              <col className="w-36" />
              <col className="w-40" />
              <col />
              <col className="w-40" />
              <col className="w-12" />
            </colgroup>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-sans font-semibold text-foreground">#</TableHead>
                <TableHead className="font-sans font-semibold text-foreground">Name</TableHead>
                <TableHead className="font-sans font-semibold text-foreground">Relationship</TableHead>
                <TableHead className="font-sans font-semibold text-foreground">Contact</TableHead>
                <TableHead className="font-sans font-semibold text-foreground">Message</TableHead>
                <TableHead className="font-sans font-semibold text-foreground whitespace-nowrap">Date Submitted</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tributes.map((tribute, index) => (
                <TableRow key={tribute.id} className={`align-top border-t border-border ${index % 2 === 0 ? "bg-background" : "bg-muted/30"}`}>
                  <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                  <TableCell className="font-sans text-sm font-medium">
                    <div className="break-words">
                      {tribute.is_anonymous || !tribute.name ? (
                        <Badge variant="secondary" className="font-normal">Anonymous</Badge>
                      ) : tribute.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="break-words">
                      {tribute.relationship ?? <span className="text-border">—</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="break-words">
                      {tribute.contact ?? <span className="text-border">—</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground/80">
                    <p className="leading-relaxed break-words whitespace-pre-wrap">{tribute.message}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDateTime(tribute.created_at)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      disabled={deletingId === tribute.id}
                      onClick={() => handleDelete(tribute.id)}
                    >
                      {deletingId === tribute.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
