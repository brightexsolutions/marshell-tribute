"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { Tribute } from "@/types/database";

interface PdfExportButtonProps {
  tributes: Tribute[];
}

export function PdfExportButton({ tributes }: PdfExportButtonProps) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      await import("jspdf-autotable");

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const generatedAt = formatDateTime(new Date().toISOString());
      const dateSlug = new Date().toISOString().slice(0, 10);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Marshell Okatch — Memorial Tributes", 14, 16);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Generated: ${generatedAt}  |  Total tributes: ${tributes.length}`, 14, 23);

      const head = [["#", "Name", "Relationship", "Contact", "Message", "Date Submitted"]];
      const body = tributes.map((t, i) => [
        String(i + 1),
        t.is_anonymous || !t.name ? "Anonymous" : t.name,
        t.relationship ?? "—",
        t.contact ?? "—",
        t.message,
        formatDateTime(t.created_at),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc as any).autoTable({
        head,
        body,
        startY: 28,
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
          valign: "top",
        },
        headStyles: {
          fillColor: [30, 30, 35],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 32 },
          2: { cellWidth: 28 },
          3: { cellWidth: 38 },
          4: { cellWidth: "auto" },
          5: { cellWidth: 42 },
        },
        didDrawPage: (data: { pageNumber: number; doc: typeof doc }) => {
          const pageCount = doc.getNumberOfPages();
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(150);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 8,
            { align: "center" }
          );
        },
      });

      doc.save(`marshell-tributes-${dateSlug}.pdf`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={generating} className="gap-2">
      {generating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {generating ? "Generating PDF…" : "Download PDF"}
    </Button>
  );
}
