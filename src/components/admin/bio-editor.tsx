"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export function BioEditor() {
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/admin/content?key=bio")
      .then((r) => r.json())
      .then((d) => {
        setBio(d.value ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const startEdit = () => {
    setDraft(bio);
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft("");
  };

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "bio", value: draft }),
    });

    if (res.ok) {
      setBio(draft);
      setEditing(false);
      toast.success("Bio updated successfully.");
    } else {
      toast.error("Failed to save bio. Please try again.");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-serif font-semibold text-foreground">
          About Marshell — Bio Text
        </h3>
        {!editing && !loading && (
          <Button
            size="sm"
            variant="outline"
            onClick={startEdit}
            className="gap-1.5 text-xs"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </Button>
        )}
      </div>

      {loading ? (
        <div className="h-32 rounded-lg bg-muted animate-pulse" />
      ) : editing ? (
        <div className="space-y-3">
          <Textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={8}
            className="text-sm leading-relaxed font-sans resize-y"
            placeholder="Write Marshell's biography here…"
          />
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={cancelEdit}
              disabled={saving}
              className="gap-1.5 text-xs"
            >
              <X className="w-3 h-3" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={save}
              disabled={saving}
              className="gap-1.5 text-xs"
            >
              {saving ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Save className="w-3 h-3" />
              )}
              {saving ? "Saving…" : "Save Bio"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-4">
          {bio ? (
            bio.split("\n\n").map((p, i) => (
              <p
                key={i}
                className="text-sm text-foreground/80 leading-relaxed font-sans mb-3 last:mb-0"
              >
                {p}
              </p>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No bio written yet. Click Edit to add one.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
