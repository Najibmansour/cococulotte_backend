import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  price: z.number().positive("Price must be positive"),
  collection_slug: z
    .string()
    .min(1, "Collection slug is required")
    .max(191, "Collection slug too long"),
  image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name too long")
    .optional(),
  price: z.number().positive("Price must be positive").optional(),
  collection_slug: z
    .string()
    .min(1, "Collection slug is required")
    .max(191, "Collection slug too long")
    .optional(),
  image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
});
