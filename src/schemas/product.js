// validation/product.schemas.ts
import { z } from "zod";

const NonEmptyString = z.string().min(1, "Required");
const Slug = z.string().min(1, "Required").max(191, "Too long");
const Availability = z.enum(
  ["available", "out_of_stock", "sold"],
  "Invalid availability"
);

export const createProductSchema = z.object({
  name: NonEmptyString.max(255, "Name too long"),
  // Accept "12.34" or 12.34; round to 2dp client-side if needed
  price: z.coerce.number().positive("Price must be positive"),
  collection_slug: Slug,
  type_slug: Slug, // REQUIRED by DB
  // Optional fields with sensible defaults/nullable handling
  image_urls: z
    .array(z.string().url("Invalid image URL"))
    .optional()
    .default([]),
  quantity: z.coerce.number().int().min(0).optional().default(0),
  colors: z
    .array(
      z.object({
        name: z.string().min(1),
        hex: z.string().min(1), // could add regex validation for hex
      })
    )
    .optional()
    .default([]),
  has_quantity: z.boolean().optional().default(true),
  description: z.string().optional().default(""),
  availability: Availability.optional().default("available"),
});

export const updateProductSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    price: z.coerce.number().positive().optional(),
    collection_slug: Slug.optional(),
    type_slug: Slug.optional(),
    image_urls: z.array(z.string().url("Invalid image URL")).optional(),
    quantity: z.coerce.number().int().min(0).optional(),
    colors: z
      .array(
        z.object({
          name: z.string().min(1),
          hex: z.string().min(1),
        })
      )
      .optional(),
    has_quantity: z.boolean().optional(),
    description: z.string().optional(),
    availability: Availability.optional(),
  })
  // Disallow empty body updates
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// For list filters (query string)
export const listProductsQuerySchema = z.object({
  collection_slug: z.string().min(1).optional(),
  type_slug: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  price_min: z.coerce.number().optional(),
  price_max: z.coerce.number().optional(),
  availability: Availability.optional(), // matches enum column
});
