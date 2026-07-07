import { z } from "zod";

/** Zod schemas shared by API routes and forms. */

export const contactSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80),
  email: z.string().email("Enter a valid email"),
  subject: z.string().max(120).optional(),
  body: z.string().min(10, "Message is too short").max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  tagline: z.string().optional(),
  description: z.string().min(10),
  story: z.string().optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  currency: z.string().default("PHP"),
  heatLevel: z.number().int().min(1).max(5),
  netWeight: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED", "COMING_SOON"]),
  featured: z.boolean().default(false),
  heroImage: z.string().url().or(z.string().startsWith("/")),
  gallery: z.array(z.string()).default([]),
  ingredients: z.array(z.string()).default([]),
  pairings: z.array(z.string()).default([]),
  categoryId: z.string().optional(),
});

export const reviewSchema = z.object({
  productId: z.string(),
  authorName: z.string().min(2).max(60),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(5).max(1000),
});

export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

export const checkoutSchema = z.object({
  email: z.string().email(),
  items: z.array(orderItemSchema).min(1),
  couponCode: z.string().optional(),
  address: z
    .object({
      line1: z.string().min(3),
      line2: z.string().optional(),
      city: z.string().min(2),
      province: z.string().min(2),
      postalCode: z.string().min(3),
      country: z.string().default("Philippines"),
    })
    .optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().positive(),
  minSpend: z.number().optional(),
  maxUses: z.number().int().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductInput = z.infer<typeof productSchema>;
