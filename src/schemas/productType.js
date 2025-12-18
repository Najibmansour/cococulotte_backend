import { z } from "zod";

const Slug = z
  .string({ required_error: "Slug is required" })
  .min(1, "Slug cannot be empty")
  .max(191, "Slug too long")
  .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens allowed");

const Title = z
  .string({ required_error: "Title is required" })
  .min(1, "Title cannot be empty")
  .max(100, "Title must be 100 characters or fewer");

// Simple shapes that match the controllers' expectations
export const createProductTypeSchema = z.object({
  slug: Slug,
  title: Title,
});

export const updateProductTypeSchema = z.object({
  title: Title,
});
