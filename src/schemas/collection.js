import { z } from "zod";

export const createCollectionSchema = z.object({
  slug: z.string().min(1, "Slug is required").max(191, "Slug too long"),
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  header_image: z
    .string()
    .url("Invalid header image URL")
    .optional()
    .or(z.literal("")),
  description: z.string().max(1000, "Description too long").optional(),
});

export const updateCollectionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title too long")
    .optional(),
  header_image: z
    .string()
    .url("Invalid header image URL")
    .optional()
    .or(z.literal("")),
  description: z.string().max(1000, "Description too long").optional(),
});
