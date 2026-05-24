"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Trash2, Plus, CheckCircle, Circle, Download } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { ContributionSettingsEditor } from "./contribution-settings-editor";

interface Contribution {
  id: string;
  contributor: string;
  payment_method: string;
  mpesa_ref: string | null;
  amount: number | null;
  confirmed: boolean;
  is_anonymous: boolean;
  note: string | null;
  created_at: string;
}

export function ContributionsTab() {
  const [items, setItems] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "cash">("mpesa");
  const [form, setForm] = useState({ contributor: "", mpesa_ref: "", amount: "", note: "" });

  const totalConfirmed = items
    .filter((c) => c.confirmed && c.amount)
    .reduce((sum, c) => sum + (c.amount ?? 0), 0);

  const fetch_ = useCallback(async (quiet = false): Promise<Contribution[]> => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    const res = await fetch("/api/admin/contributions", { cache: "no-store" });
    const data: Contribution[] = res.ok ? await res.json() : [];
    if (res.ok) setItems(data);
    setLoading(false);
    setRefreshing(false);
    return data;
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const toggleConfirm = async (c: Contribution) => {
    setActionId(c.id);
    const res = await fetch(`/api/admin/contributions?id=${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmed: !c.confirmed }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((x) => x.id === c.id ? { ...x, confirmed: !c.confirmed } : x));
      toast.success(c.confirmed ? "Marked unconfirmed." : "Marked as confirmed.");
    } else toast.error("Failed to update.");
    setActionId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contribution record?")) return;
    setActionId(id);
    const res = await fetch(`/api/admin/contributions?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast.success("Deleted.");
    } else toast.error("Failed to delete.");
    setActionId(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contributor.trim()) { toast.error("Name is required."); return; }
    setAdding(true);
    const res = await fetch("/api/admin/contributions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contributor: form.contributor,
        payment_method: paymentMethod,
        mpesa_ref: paymentMethod === "mpesa" ? (form.mpesa_ref || null) : null,
        amount: form.amount ? Number(form.amount) : null,
        note: form.note || null,
        confirmed: true,
      }),
    });
    if (res.ok) {
      const newItem = await res.json();
      setItems((prev) => [newItem, ...prev]);
      setForm({ contributor: "", mpesa_ref: "", amount: "", note: "" });
      setPaymentMethod("mpesa");
      setShowAdd(false);
      toast.success("Contribution added.");
    } else toast.error("Failed to add.");
    setAdding(false);
  };

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const fresh = await fetch_();
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const confirmed = fresh.filter((c) => c.confirmed && c.amount);
      const total = confirmed.reduce((s, c) => s + (c.amount ?? 0), 0);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Contributions — Marshell Okatch Memorial", 14, 16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Generated: ${new Date().toLocaleString("en-KE")}`, 14, 23);
      if (total > 0) {
        doc.setFont("helvetica", "bold");
        doc.text(`Total Confirmed: KES ${total.toLocaleString()}`, 14, 29);
        doc.setFont("helvetica", "normal");
      }

      autoTable(doc, {
        startY: total > 0 ? 34 : 28,
        head: [["Name", "Method", "M-Pesa Ref", "Amount (KES)", "Status", "Date"]],
        body: fresh.map((c) => [
          c.is_anonymous ? "Anonymous" : c.contributor,
          c.payment_method === "cash" ? "Cash" : "M-Pesa",
          c.payment_method === "cash" ? "—" : (c.mpesa_ref ?? "—"),
          c.amount != null ? c.amount.toLocaleString() : "—",
          c.confirmed ? "Confirmed" : "Pending",
          new Date(c.created_at).toLocaleDateString("en-KE"),
        ]),
        headStyles: { fillColor: [30, 30, 35], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 8, font: "helvetica" },
        didDrawPage: (data) => {
          const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
          doc.setFontSize(7);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            doc.internal.pageSize.getWidth() - 20,
            doc.internal.pageSize.getHeight() - 8,
          );
        },
      });

      const date = new Date().toISOString().slice(0, 10);
      doc.save(`marshell-contributions-${date}.pdf`);
    } catch {
      toast.error("Failed to generate PDF.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Payment details settings */}
      <ContributionSettingsEditor />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground font-sans">
            {items.length} contribution{items.length !== 1 ? "s" : ""}
            {totalConfirmed > 0 && (
              <span className="ml-2 font-medium text-foreground">
                · KES {totalConfirmed.toLocaleString()} confirmed
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => fetch_(true)} disabled={refreshing} className="gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={downloadPdf} disabled={downloading} className="gap-1.5">
            {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {downloading ? "Generating…" : "Download PDF"}
          </Button>
          <Button size="sm" onClick={() => setShowAdd((v) => !v)} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add past contribution
          </Button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground font-sans">Add a contribution that happened before the site launched</p>

          {/* Method toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("mpesa")}
              className={`flex-1 py-1.5 px-3 rounded-md border text-xs font-medium font-sans transition-colors ${
                paymentMethod === "mpesa" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              M-Pesa
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={`flex-1 py-1.5 px-3 rounded-md border text-xs font-medium font-sans transition-colors ${
                paymentMethod === "cash" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              Cash
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Contributor name *" value={form.contributor} onChange={(e) => setForm((f) => ({ ...f, contributor: e.target.value }))} className="text-sm" />
            {paymentMethod === "mpesa" && (
              <Input placeholder="M-Pesa ref (optional)" value={form.mpesa_ref} onChange={(e) => setForm((f) => ({ ...f, mpesa_ref: e.target.value }))} className="text-sm font-mono" />
            )}
            <Input placeholder="Amount in KES (optional)" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} className="text-sm" inputMode="numeric" />
            <Input placeholder="Note (optional)" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} className="text-sm" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={adding} className="gap-1.5">
              {adding && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {adding ? "Adding…" : "Add (mark confirmed)"}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Table / Cards */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-border py-12 text-center text-sm text-muted-foreground font-sans">
          No contributions yet.
        </div>
      ) : (
        <>
          {/* ── Mobile: card layout ──────────────────────────────────────── */}
          <div className="sm:hidden space-y-3">
            {items.map((c) => (
              <div key={c.id} className="rounded-lg border border-border bg-card p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-medium text-sm">
                        {c.is_anonymous ? <span className="italic text-muted-foreground">Anonymous</span> : c.contributor}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {c.payment_method === "cash" ? "Cash" : "M-Pesa"}
                      </Badge>
                      <Badge variant={c.confirmed ? "default" : "secondary"} className="text-xs">
                        {c.confirmed ? "Confirmed" : "Pending"}
                      </Badge>
                    </div>
                    {c.payment_method !== "cash" && c.mpesa_ref && (
                      <p className="text-xs font-mono text-muted-foreground">{c.mpesa_ref}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button
                      size="icon" variant="ghost"
                      className={`h-7 w-7 ${c.confirmed ? "text-green-600" : "text-muted-foreground"}`}
                      title={c.confirmed ? "Mark unconfirmed" : "Mark confirmed"}
                      disabled={actionId === c.id}
                      onClick={() => toggleConfirm(c)}
                    >
                      {actionId === c.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : c.confirmed ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    </Button>
                    <Button
                      size="icon" variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      disabled={actionId === c.id}
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.amount != null ? `KES ${c.amount.toLocaleString()}` : "Amount not specified"}</span>
                  <span>{formatDateTime(c.created_at)}</span>
                </div>
                {c.note && <p className="text-xs text-muted-foreground italic">{c.note}</p>}
              </div>
            ))}
          </div>

          {/* ── Desktop: table layout ────────────────────────────────────── */}
          <div className="hidden sm:block rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-sans font-semibold text-foreground">Name</TableHead>
                    <TableHead className="font-sans font-semibold text-foreground">Method</TableHead>
                    <TableHead className="font-sans font-semibold text-foreground">M-Pesa Ref</TableHead>
                    <TableHead className="font-sans font-semibold text-foreground">Amount (KES)</TableHead>
                    <TableHead className="font-sans font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-sans font-semibold text-foreground">Date</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((c) => (
                    <TableRow key={c.id} className="align-top">
                      <TableCell className="font-medium text-sm">
                        {c.is_anonymous ? <span className="text-muted-foreground italic">Anonymous</span> : c.contributor}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {c.payment_method === "cash" ? "Cash" : "M-Pesa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">
                        {c.payment_method === "cash"
                          ? <span className="text-border">—</span>
                          : (c.mpesa_ref ?? <span className="text-border">—</span>)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.amount != null ? c.amount.toLocaleString() : <span className="text-border">—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={c.confirmed ? "default" : "secondary"} className="text-xs">
                          {c.confirmed ? "Confirmed" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDateTime(c.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon" variant="ghost"
                            className={`h-7 w-7 ${c.confirmed ? "text-green-600" : "text-muted-foreground"}`}
                            title={c.confirmed ? "Mark unconfirmed" : "Mark confirmed"}
                            disabled={actionId === c.id}
                            onClick={() => toggleConfirm(c)}
                          >
                            {actionId === c.id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : c.confirmed
                                ? <CheckCircle className="w-3.5 h-3.5" />
                                : <Circle className="w-3.5 h-3.5" />}
                          </Button>
                          <Button
                            size="icon" variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            disabled={actionId === c.id}
                            onClick={() => handleDelete(c.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
