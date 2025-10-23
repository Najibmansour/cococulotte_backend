import { z } from "zod";

// Schema for creating a new product type
export const createProductTypeSchema = z.object({
  body: z.object({
    slug: z
      .string({
        required_error: "Slug is required",
      })
      .min(1, "Slug cannot be empty")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      ),
    title: z
      .string({
        required_error: "Title is required",
      })
      .min(1, "Title cannot be empty")
      .max(100, "Title must be 100 characters or fewer"),
  }),
});

// Schema for updating an existing product type
export const updateProductTypeSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
      })
      .min(1, "Title cannot be empty")
      .max(100, "Title must be 100 characters or fewer"),
  }),
  params: z.object({
    slug: z
      .string({
        required_error: "Slug is required",
      })
      .min(1, "Slug cannot be empty"),
  }),
});
