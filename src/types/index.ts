/** Shared domain types for the Kulas storefront. */

export type NutritionFacts = {
  servingSize: string;
  calories: number;
  sodiumMg: number;
  carbsG: number;
  sugarsG: number;
  proteinG: number;
};

export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED" | "COMING_SOON";

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  story?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  heatLevel: number; // 1-5
  netWeight?: string;
  status: ProductStatus;
  featured: boolean;
  heroImage: string;
  gallery: string[];
  ingredients: string[];
  pairings: string[];
  nutrition?: NutritionFacts;
  categorySlug?: string;
  rating?: number;
  reviewCount?: number;
}

export interface CartLine {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  title?: string;
  body: string;
  verified: boolean;
  location?: string;
  date: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  videoUrl?: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string[];
  steps: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}
