import { z } from "zod";

export const createHomeSchema = z.object({
  about: z.object({
    text: z.string().min(1, "About text is required"),
    title: z
      .string()
      .min(1, "About title is required")
      .max(255, "Title too long"),
  }),
  social: z.object({
    instagramUrl: z.string().url("Invalid Instagram URL"),
    instagramHandle: z.string().min(1, "Instagram handle is required").max(100),
  }),
  featuredProducts: z.object({
    indexes: z
      .array(z.number().int().positive("Indexes must be positive integers"))
      .min(1, "At least one index is required"),
    imagePattern: z
      .string()
      .min(1, "Image pattern is required")
      .max(512, "Image pattern too long"),
  }),
  collectionsPreviewImages: z
    .array(z.string().min(1, "Image path is required").max(512))
    .min(1, "At least one preview image is required"),
});

export const updateHomeSchema = z.object({
  about: z
    .object({
      text: z.string().min(1).optional(),
      title: z.string().min(1).max(255).optional(),
    })
    .optional(),
  social: z
    .object({
      instagramUrl: z.string().url("Invalid Instagram URL").optional(),
      instagramHandle: z.string().min(1).max(100).optional(),
    })
    .optional(),
  featuredProducts: z
    .object({
      indexes: z.array(z.number().int().positive()).min(1).optional(),
      imagePattern: z.string().min(1).max(512).optional(),
    })
    .optional(),
  collectionsPreviewImages: z
    .array(z.string().min(1).max(512))
    .min(1)
    .optional(),
});
