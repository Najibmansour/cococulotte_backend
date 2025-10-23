import { z } from "zod";

export const createAboutSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  sections: z
    .array(
      z.object({
        text: z.string().min(1, "Section text is required"),
        image: z
          .string()
          .min(1, "Image path is required")
          .max(512, "Image path too long"),
        title: z
          .string()
          .min(1, "Section title is required")
          .max(255, "Section title too long"),
      })
    )
    .min(1, "At least one section is required"),
});

export const updateAboutSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  sections: z
    .array(
      z.object({
        text: z.string().min(1).optional(),
        image: z.string().min(1).max(512).optional(),
        title: z.string().min(1).max(255).optional(),
      })
    )
    .optional(),
});
