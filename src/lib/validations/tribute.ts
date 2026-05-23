import { z } from "zod";

export const RELATIONSHIP_OPTIONS = [
  "Parent",
  "Family",
  "Relative",
  "Friend",
  "Colleague",
  "Other",
] as const;

export const tributeSchema = z
  .object({
    name: z.string().max(100).optional(),
    contact: z.string().max(200).optional(),
    message: z
      .string()
      .min(1, "Please write your tribute message.")
      .max(2000, "Message must be 2000 characters or less."),
    is_anonymous: z.boolean(),
    relationship: z.string().max(100).optional(),
    relationship_other: z.string().max(100).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.is_anonymous && (!data.name || data.name.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter your name, or choose to submit anonymously.",
        path: ["name"],
      });
    }
    if (data.relationship === "Other" && !data.relationship_other?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please describe your relationship to Marshell.",
        path: ["relationship_other"],
      });
    }
  });

export type TributeFormData = z.infer<typeof tributeSchema>;
