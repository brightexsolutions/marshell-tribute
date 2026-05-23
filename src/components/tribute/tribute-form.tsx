"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  tributeSchema,
  TributeFormData,
  RELATIONSHIP_OPTIONS,
} from "@/lib/validations/tribute";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Tribute } from "@/types/database";

interface TributeFormProps {
  onSuccess: (newTribute: Tribute) => void;
}

export function TributeForm({ onSuccess }: TributeFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TributeFormData>({
    resolver: zodResolver(tributeSchema),
    defaultValues: { is_anonymous: false },
  });

  const isAnonymous = watch("is_anonymous");
  const relationship = watch("relationship");
  const message = watch("message") ?? "";

  const onSubmit = async (data: TributeFormData) => {
    const supabase = createClient();

    let finalRelationship: string | null = null;
    if (data.relationship === "Other") {
      finalRelationship = data.relationship_other?.trim() || null;
    } else if (data.relationship === "Classmate") {
      const inst = data.institution?.trim();
      finalRelationship = inst ? `Classmate — ${inst}` : "Classmate";
    } else {
      finalRelationship = data.relationship || null;
    }

    const { data: inserted, error } = await supabase
      .from("tributes")
      .insert({
        name: data.is_anonymous ? null : data.name?.trim() || null,
        contact: data.contact?.trim() || null,
        message: data.message.trim(),
        is_anonymous: data.is_anonymous,
        relationship: finalRelationship,
      })
      .select()
      .single();

    if (error || !inserted) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    toast.success("Your tribute has been submitted. Thank you.");
    onSuccess(inserted as Tribute);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Anonymous toggle */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/60">
        <Checkbox
          id="is_anonymous"
          checked={isAnonymous}
          onCheckedChange={(checked) => {
            setValue("is_anonymous", !!checked);
            if (checked) {
              setValue("name", "");
              setValue("contact", "");
            }
          }}
        />
        <Label
          htmlFor="is_anonymous"
          className="cursor-pointer text-sm font-sans"
        >
          Submit anonymously
        </Label>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-sans">
          Your name{" "}
          {!isAnonymous && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id="name"
          placeholder="e.g. John Otieno"
          disabled={isAnonymous}
          {...register("name")}
          className={cn(isAnonymous && "opacity-50 cursor-not-allowed")}
        />
        {errors.name && (
          <p className="text-destructive text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* Relationship to Marshell */}
      <div className="space-y-2">
        <Label htmlFor="relationship" className="text-sm font-sans">
          Relationship to Marshell{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <select
          id="relationship"
          {...register("relationship")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">— Select —</option>
          {RELATIONSHIP_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {relationship === "Classmate" && (
          <div className="space-y-2 pt-1">
            <Label htmlFor="institution" className="text-xs text-muted-foreground font-sans">
              Institution / School{" "}
              <span className="font-normal">(optional)</span>
            </Label>
            <Input
              id="institution"
              placeholder="e.g. University of Nairobi"
              {...register("institution")}
            />
          </div>
        )}

        {relationship === "Other" && (
          <div className="space-y-2 pt-1">
            <Input
              placeholder="Describe your relationship…"
              {...register("relationship_other")}
            />
            {errors.relationship_other && (
              <p className="text-destructive text-xs">
                {errors.relationship_other.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <Label htmlFor="contact" className="text-sm font-sans">
          Phone or email{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="contact"
          placeholder="e.g. 0700 000 000 or you@email.com"
          disabled={isAnonymous}
          {...register("contact")}
          className={cn(isAnonymous && "opacity-50 cursor-not-allowed")}
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-sans">
          Your tribute <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Share a memory, a kind word, or a prayer…"
          rows={5}
          {...register("message")}
        />
        <div className="flex justify-between items-center">
          {errors.message ? (
            <p className="text-destructive text-xs">{errors.message.message}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">
            {message.length}/2000
          </span>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? "Submitting…" : "Submit Tribute"}
      </Button>
    </form>
  );
}
