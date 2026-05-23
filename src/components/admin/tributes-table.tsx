"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PdfExportButton } from "./pdf-export-button";
import { formatDateTime } from "@/lib/utils";
import type { Tribute } from "@/types/database";

interface TributesTableProps {
  tributes: Tribute[];
}

export function TributesTable({ tributes }: TributesTableProps) {
  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">
            Tributes — Admin View
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-sans">
            Total tributes received:{" "}
            <span className="font-semibold text-foreground">
              {tributes.length}
            </span>
          </p>
        </div>
        <PdfExportButton tributes={tributes} />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-10 font-sans font-semibold text-foreground">
                  #
                </TableHead>
                <TableHead className="font-sans font-semibold text-foreground">
                  Name
                </TableHead>
                <TableHead className="font-sans font-semibold text-foreground whitespace-nowrap">
                  Relationship
                </TableHead>
                <TableHead className="font-sans font-semibold text-foreground">
                  Contact
                </TableHead>
                <TableHead className="font-sans font-semibold text-foreground">
                  Message
                </TableHead>
                <TableHead className="font-sans font-semibold text-foreground whitespace-nowrap">
                  Date Submitted
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tributes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground font-sans text-sm"
                  >
                    No tributes submitted yet.
                  </TableCell>
                </TableRow>
              ) : (
                tributes.map((tribute, index) => (
                  <TableRow key={tribute.id} className="align-top">
                    <TableCell className="text-muted-foreground text-sm">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-sans text-sm font-medium whitespace-nowrap">
                      {tribute.is_anonymous || !tribute.name ? (
                        <Badge variant="secondary" className="font-normal">
                          Anonymous
                        </Badge>
                      ) : (
                        tribute.name
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {tribute.relationship ?? (
                        <span className="text-border">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {tribute.contact ?? (
                        <span className="text-border">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-foreground/80 max-w-xs">
                      <p className="leading-relaxed">{tribute.message}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDateTime(tribute.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
