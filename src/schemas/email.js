import { z } from "zod";

// Order email validation schema
export const orderEmailSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  items: z
    .array(
      z.object({
        productId: z
          .number()
          .int()
          .positive("Product ID must be a positive integer"),
        quantity: z
          .number()
          .int()
          .positive("Quantity must be a positive integer"),
      })
    )
    .min(1, "At least one item is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  orderNotes: z.string().optional(),
});

// Contact form validation schema
export const contactFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  message: z.string().min(1, "Message is required"),
});
