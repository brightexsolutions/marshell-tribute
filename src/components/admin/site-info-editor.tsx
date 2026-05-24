"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Save, Loader2, X } from "lucide-react";
import { toast } from "sonner";

async function fetchContent(key: string): Promise<string> {
  const res = await fetch(`/api/admin/content?key=${key}`);
  if (!res.ok) return "";
  const data = await res.json();
  return data.value ?? "";
}

async function saveContent(key: string, value: string): Promise<boolean> {
  const res = await fetch("/api/admin/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  return res.ok;
}

export function SiteInfoEditor() {
  const [name, setName] = useState("");
  const [bornYear, setBornYear] = useState("");
  const [diedYear, setDiedYear] = useState("");
  const [burialDate, setBurialDate] = useState("");
  const [draftName, setDraftName] = useState("");
  const [draftBornYear, setDraftBornYear] = useState("");
  const [draftDiedYear, setDraftDiedYear] = useState("");
  const [draftBurialDate, setDraftBurialDate] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchContent("hero_name"),
      fetchContent("born_year"),
      fetchContent("died_year"),
      fetchContent("burial_date"),
    ]).then(([n, born, died, b]) => {
      setName(n);
      setBornYear(born);
      setDiedYear(died);
      setBurialDate(b);
      setLoading(false);
    });
  }, []);

  const startEdit = () => {
    setDraftName(name);
    setDraftBornYear(bornYear);
    setDraftDiedYear(diedYear);
    setDraftBurialDate(burialDate);
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const save = async () => {
    setSaving(true);
    const results = await Promise.all([
      saveContent("hero_name", draftName),
      saveContent("born_year", draftBornYear),
      saveContent("died_year", draftDiedYear),
      saveContent("burial_date", draftBurialDate),
    ]);

    if (results.every(Boolean)) {
      setName(draftName);
      setBornYear(draftBornYear);
      setDiedYear(draftDiedYear);
      setBurialDate(draftBurialDate);
      setEditing(false);
      toast.success("Details saved. Reload the homepage to see the changes.");
    } else {
      toast.error("Failed to save details.");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-serif font-semibold text-foreground">
          Hero Details
        </h3>
        {!editing && !loading && (
          <Button size="sm" variant="outline" onClick={startEdit} className="gap-1.5 text-xs">
            <Pencil className="w-3 h-3" />
            Edit
          </Button>
        )}
      </div>

      {loading ? (
        <div className="h-20 rounded-lg bg-muted animate-pulse" />
      ) : editing ? (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-sans">Displayed Name</Label>
            <Input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="e.g. Marshell Okatch"
              className="text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-sans">Year Born</Label>
              <Input
                value={draftBornYear}
                onChange={(e) => setDraftBornYear(e.target.value)}
                placeholder="e.g. 1990"
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-sans">Year of Passing</Label>
              <Input
                value={draftDiedYear}
                onChange={(e) => setDraftDiedYear(e.target.value)}
                placeholder="e.g. 2026"
                className="text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-sans">Burial Date</Label>
            <Input
              value={draftBurialDate}
              onChange={(e) => setDraftBurialDate(e.target.value)}
              placeholder="e.g. June 5, 2026"
              className="text-sm"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={cancelEdit} disabled={saving} className="gap-1.5 text-xs">
              <X className="w-3 h-3" />
              Cancel
            </Button>
            <Button size="sm" onClick={save} disabled={saving} className="gap-1.5 text-xs">
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
          <div className="flex gap-2 text-sm">
            <span className="text-muted-foreground font-sans w-24 shrink-0">Name:</span>
            <span className="font-medium">
              {name || <span className="italic text-muted-foreground">Not set</span>}
            </span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-muted-foreground font-sans w-24 shrink-0">Years:</span>
            <span>
              {bornYear || diedYear
                ? `${bornYear || "?"} – ${diedYear || "?"}`
                : <span className="italic text-muted-foreground">Not set</span>}
            </span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-muted-foreground font-sans w-24 shrink-0">Burial date:</span>
            <span>
              {burialDate || <span className="italic text-muted-foreground">Not set</span>}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
