"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Settings2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface Settings {
  method: string;
  phone: string;
  name: string;
  note: string;
}

async function fetchKey(key: string): Promise<string> {
  const res = await fetch(`/api/admin/content?key=${key}`, { cache: "no-store" });
  if (!res.ok) return "";
  const d = await res.json();
  return d.value ?? "";
}

async function putKey(key: string, value: string) {
  return fetch("/api/admin/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
}

export function ContributionSettingsEditor() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Settings>({ method: "M-Pesa", phone: "", name: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all([
      fetchKey("contribution_method"),
      fetchKey("contribution_phone"),
      fetchKey("contribution_name"),
      fetchKey("contribution_note"),
    ]).then(([method, phone, name, note]) => {
      setForm({ method: method || "M-Pesa", phone, name, note });
      setLoading(false);
    });
  }, [open]);

  const save = async () => {
    setSaving(true);
    try {
      await Promise.all([
        putKey("contribution_method", form.method),
        putKey("contribution_phone", form.phone),
        putKey("contribution_name", form.name),
        putKey("contribution_note", form.note),
      ]);
      toast.success("Payment details saved.");
      setOpen(false);
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-muted/20 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium font-sans hover:bg-muted/40 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2">
          <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
          Payment details for public page
        </span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>

      {open && (
        <div className="border-t border-border px-4 py-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground font-sans">
                These details are displayed on the public Support tab so visitors know where to send money.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-sans">Method (e.g. M-Pesa, Airtel Money)</Label>
                  <Input value={form.method} onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))} className="text-sm" placeholder="M-Pesa" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-sans">Phone number</Label>
                  <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="text-sm" placeholder="0712 345 678" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-sans">Recipient name</Label>
                  <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="text-sm" placeholder="Jane Doe" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-sans">Note (optional)</Label>
                  <Input value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} className="text-sm" placeholder="Optional guidance for senders" />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" onClick={save} disabled={saving} className="gap-1.5">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? "Saving…" : "Save"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
