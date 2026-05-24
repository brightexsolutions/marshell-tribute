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

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-10 font-sans font-semibold text-foreground">#</TableHead>
              <TableHead className="font-sans font-semibold text-foreground">Name</TableHead>
              <TableHead className="font-sans font-semibold text-foreground whitespace-nowrap">Relationship</TableHead>
              <TableHead className="font-sans font-semibold text-foreground">Contact</TableHead>
              <TableHead className="font-sans font-semibold text-foreground">Message</TableHead>
              <TableHead className="font-sans font-semibold text-foreground whitespace-nowrap">Date Submitted</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tributes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground font-sans text-sm">
                  No tributes submitted yet.
                </TableCell>
              </TableRow>
            ) : (
              tributes.map((tribute, index) => (
                <TableRow key={tribute.id} className="align-top">
                  <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                  <TableCell className="font-sans text-sm font-medium whitespace-nowrap">
                    {tribute.is_anonymous || !tribute.name ? (
                      <Badge variant="secondary" className="font-normal">Anonymous</Badge>
                    ) : tribute.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {tribute.relationship ?? <span className="text-border">—</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {tribute.contact ?? <span className="text-border">—</span>}
                  </TableCell>
                  <TableCell className="text-sm text-foreground/80 max-w-xs">
                    <p className="leading-relaxed">{tribute.message}</p>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
