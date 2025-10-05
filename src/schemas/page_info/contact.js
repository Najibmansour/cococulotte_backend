import { z } from "zod";

export const createContactSchema = z.object({
  intro: z.string().min(1, "Intro is required").max(1000, "Intro too long"),
  store: z.object({
    hours: z.string().min(1, "Hours are required").max(255),
    address: z.string().min(1, "Address is required").max(255),
    cityCountry: z.string().min(1, "City/Country is required").max(255),
  }),
  headline: z
    .string()
    .min(1, "Headline is required")
    .max(255, "Headline too long"),
});

export const updateContactSchema = z.object({
  intro: z.string().min(1).max(1000).optional(),
  store: z
    .object({
      hours: z.string().min(1).max(255).optional(),
      address: z.string().min(1).max(255).optional(),
      cityCountry: z.string().min(1).max(255).optional(),
    })
    .optional(),
  headline: z.string().min(1).max(255).optional(),
});
