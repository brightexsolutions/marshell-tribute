"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Heart, CheckCircle, Users, Smartphone, Banknote } from "lucide-react";
import { toast } from "sonner";

interface SupportTabProps {
  method: string;
  phone: string;
  recipientName: string;
  note: string;
}

export function SupportTab({ method, phone, recipientName, note }: SupportTabProps) {
  const [count, setCount] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "cash">("mpesa");
  const [form, setForm] = useState({ contributor: "", mpesa_ref: "", amount: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/contributions/count", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? 0))
      .catch(() => setCount(null));
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!isAnonymous && !form.contributor.trim()) e.contributor = "Your name is required.";
    if (paymentMethod === "mpesa" && !form.mpesa_ref.trim()) e.mpesa_ref = "M-Pesa reference is required.";
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
        contributor: isAnonymous ? "Anonymous" : form.contributor,
        payment_method: paymentMethod,
        mpesa_ref: paymentMethod === "mpesa" ? form.mpesa_ref : undefined,
        amount: form.amount ? Number(form.amount) : undefined,
        is_anonymous: isAnonymous,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? "Failed to submit. Please try again.");
    } else {
      setSubmitted(true);
      setCount((c) => (c ?? 0) + 1);
      toast.success("Thank you! Your contribution has been recorded.");
    }
    setSubmitting(false);
  };

  return (
    <div className="py-6 space-y-6 max-w-lg mx-auto">
      {/* Payment details card */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-muted/40 flex items-center gap-2.5">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
          <p className="text-sm font-semibold font-serif">Support the Family</p>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-xs text-muted-foreground font-sans">Send via {method} to:</p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-2xl font-semibold font-sans tracking-wide">{phone || "—"}</span>
            <span className="text-sm text-muted-foreground font-sans">{recipientName}</span>
          </div>
          {note && (
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">{note}</p>
          )}
        </div>

        {/* Contribution count */}
        {count !== null && count > 0 && (
          <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center gap-2 text-sm text-muted-foreground font-sans">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>
              <strong className="text-foreground">{count}</strong>{" "}
              {count === 1 ? "person has" : "people have"} contributed so far
            </span>
          </div>
        )}
      </div>

      {/* CTA button */}
      {!submitted && !showForm && (
        <Button className="w-full gap-2" onClick={() => setShowForm(true)}>
          <CheckCircle className="w-4 h-4" />
          I&apos;ve sent — confirm my contribution
        </Button>
      )}

      {/* Confirmation form */}
      {!submitted && showForm && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <p className="text-sm font-semibold font-serif">Confirm your contribution</p>
          <p className="text-xs text-muted-foreground font-sans -mt-2">
            Enter your details so the family can verify receipt.
          </p>

          {/* Payment method toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setPaymentMethod("mpesa"); setErrors({}); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium font-sans transition-colors ${
                paymentMethod === "mpesa"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-muted-foreground"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              M-Pesa
            </button>
            <button
              type="button"
              onClick={() => { setPaymentMethod("cash"); setErrors({}); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium font-sans transition-colors ${
                paymentMethod === "cash"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-muted-foreground"
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              Cash
            </button>
          </div>

          {/* Anonymous checkbox */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/60">
            <Checkbox
              id="anon"
              checked={isAnonymous}
              onCheckedChange={(v) => {
                setIsAnonymous(!!v);
                if (v) setForm((f) => ({ ...f, contributor: "" }));
              }}
            />
            <Label htmlFor="anon" className="cursor-pointer text-sm font-sans">
              Contribute anonymously
            </Label>
          </div>

          <div className="space-y-4">
            {!isAnonymous && (
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
                {errors.contributor && <p className="text-destructive text-xs">{errors.contributor}</p>}
              </div>
            )}

            {paymentMethod === "mpesa" && (
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
                {errors.mpesa_ref && <p className="text-destructive text-xs">{errors.mpesa_ref}</p>}
              </div>
            )}

            {paymentMethod === "cash" && (
              <div className="rounded-lg bg-muted/60 px-3 py-2.5">
                <p className="text-xs text-muted-foreground font-sans">
                  Cash contributions are recorded as-is. No reference code needed.
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-sans">
                Amount (KES) <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                placeholder="e.g. 1000"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="text-sm"
                inputMode="numeric"
              />
              {errors.amount && <p className="text-destructive text-xs">{errors.amount}</p>}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button onClick={handleSubmit} disabled={submitting} className="gap-2 flex-1">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Submitting…" : "Submit"}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)} disabled={submitting}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm font-medium font-sans">Contribution recorded</p>
            <p className="text-xs text-muted-foreground font-sans">
              Thank you for your generosity. The family will confirm receipt shortly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
