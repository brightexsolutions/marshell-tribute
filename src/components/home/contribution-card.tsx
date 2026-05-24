"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Heart, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ContributionCardProps {
  method: string;
  phone: string;
  recipientName: string;
  note: string;
}

export function ContributionCard({ method, phone, recipientName, note }: ContributionCardProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ contributor: "", mpesa_ref: "", amount: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.contributor.trim()) e.contributor = "Your name is required.";
    if (!form.mpesa_ref.trim()) e.mpesa_ref = "M-Pesa reference is required.";
    if (form.amount && isNaN(Number(form.amount))) e.amount = "Enter a valid amount.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const res = await fetch("/api/contributions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contributor: form.contributor,
        mpesa_ref: form.mpesa_ref,
        amount: form.amount ? Number(form.amount) : undefined,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? "Failed to submit. Please try again.");
    } else {
      setSubmitted(true);
      toast.success("Contribution recorded. Thank you for your support!");
    }
    setSubmitting(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-muted/40">
        <div className="flex items-center gap-2.5">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold font-serif text-foreground">
              Support the Family
            </p>
            <p className="text-xs text-muted-foreground font-sans">
              Contribute towards the send-off
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={open ? "Collapse" : "Expand"}
        >
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Payment details — always visible */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground font-sans mb-2">Send via {method} to:</p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-xl font-semibold font-sans tracking-wide text-foreground">
            {phone}
          </span>
          <span className="text-sm text-muted-foreground font-sans">— {recipientName}</span>
        </div>
        {note && (
          <p className="text-xs text-muted-foreground mt-2 font-sans leading-relaxed">{note}</p>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-3 text-xs font-medium text-primary underline underline-offset-2 hover:opacity-80 transition-opacity font-sans"
        >
          {open ? "Hide confirmation form" : "I've sent — confirm my contribution →"}
        </button>
      </div>

      {/* Confirmation form */}
      {open && (
        <div className="px-5 pb-5 border-t border-border bg-muted/20">
          {submitted ? (
            <div className="flex items-center gap-2.5 py-5 text-sm text-foreground font-sans">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              Thank you! Your contribution has been recorded and will be confirmed by the family.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-sans">
                    Your name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Jane Mwangi"
                    value={form.contributor}
                    onChange={(e) => setForm((f) => ({ ...f, contributor: e.target.value }))}
                    className="text-sm"
                  />
                  {errors.contributor && (
                    <p className="text-destructive text-xs">{errors.contributor}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-sans">
                    M-Pesa reference <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. QFX8Y2KL93"
                    value={form.mpesa_ref}
                    onChange={(e) => setForm((f) => ({ ...f, mpesa_ref: e.target.value }))}
                    className="text-sm font-mono uppercase"
                  />
                  {errors.mpesa_ref && (
                    <p className="text-destructive text-xs">{errors.mpesa_ref}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 max-w-[160px]">
                <Label className="text-xs text-muted-foreground font-sans">
                  Amount (KES) <span className="font-normal">(optional)</span>
                </Label>
                <Input
                  placeholder="e.g. 1000"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  className="text-sm"
                  inputMode="numeric"
                />
                {errors.amount && (
                  <p className="text-destructive text-xs">{errors.amount}</p>
                )}
              </div>
              <Button type="submit" size="sm" disabled={submitting} className="gap-2">
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {submitting ? "Submitting…" : "Confirm Contribution"}
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
