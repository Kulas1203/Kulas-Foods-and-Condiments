import type { Product, Review, Recipe, FaqItem } from "@/types";

/**
 * Static product catalog used by the storefront when no database is connected.
 * The same shape is stored in Postgres via Prisma — see prisma/seed.ts.
 * Add future products here (or via the admin dashboard) and they flow through
 * the entire site automatically.
 */
export const products: Product[] = [
  {
    id: "kulas-chili-garlic-sauce",
    name: "Kulas Chili Garlic Sauce",
    slug: "kulas-chili-garlic-sauce",
    tagline: "Our flagship. Smoky, punchy, unapologetically bold.",
    description:
      "A slow-cooked chili garlic sauce built on fresh Filipino labuyo, toasted garlic, and premium oil. Every jar is small-batch crafted for deep, layered heat that finishes clean — the kind you'll spoon onto everything.",
    story:
      "Born in a home kitchen in Iloilo, Kulas started as a family recipe shared over Sunday lunches. Demand from friends turned a stovetop batch into a brand — but the recipe never changed.",
    price: 189,
    compareAtPrice: 229,
    currency: "PHP",
    heatLevel: 4,
    netWeight: "220g",
    status: "ACTIVE",
    featured: true,
    heroImage: "/products/kulas-chili-garlic-sauce.svg",
    gallery: [
      "/products/kulas-chili-garlic-sauce.svg",
      "/products/kulas-chili-garlic-sauce.svg",
      "/products/kulas-chili-garlic-sauce.svg",
    ],
    ingredients: [
      "Fresh red chili (labuyo)",
      "Toasted garlic",
      "Premium vegetable oil",
      "Sea salt",
      "Cane vinegar",
      "Natural spices",
    ],
    pairings: [
      "Grilled pork & chicken inasal",
      "Fried rice & sinangag",
      "Noodles & dumplings",
      "Eggs, any style",
      "Fresh lumpia & spring rolls",
    ],
    nutrition: {
      servingSize: "1 tbsp (15g)",
      calories: 70,
      sodiumMg: 180,
      carbsG: 2,
      sugarsG: 1,
      proteinG: 0,
    },
    categorySlug: "sauces",
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: "kulas-spicy-vinegar",
    name: "Kulas Spicy Sukang Pinakurat",
    slug: "kulas-spicy-vinegar",
    tagline: "Coming soon — a bright, fiery dipping vinegar.",
    description:
      "A tangy spiced coconut vinegar infused with chili, garlic, and onion. The perfect sawsawan for grilled meats and street food classics.",
    price: 149,
    currency: "PHP",
    heatLevel: 3,
    netWeight: "250ml",
    status: "COMING_SOON",
    featured: false,
    heroImage: "/products/kulas-chili-garlic-sauce.svg",
    gallery: [],
    ingredients: ["Coconut vinegar", "Chili", "Garlic", "Onion", "Spices"],
    pairings: ["Lechon", "Grilled seafood", "Lumpia"],
    categorySlug: "vinegars",
    rating: 0,
    reviewCount: 0,
  },
  {
    id: "kulas-garlic-crunch",
    name: "Kulas Garlic Chili Crunch",
    slug: "kulas-garlic-crunch",
    tagline: "Coming soon — crunchy, crispy, addictive.",
    description:
      "Crispy garlic and chili flakes suspended in aromatic oil. Texture and heat in every spoonful.",
    price: 199,
    currency: "PHP",
    heatLevel: 5,
    netWeight: "200g",
    status: "COMING_SOON",
    featured: false,
    heroImage: "/products/kulas-chili-garlic-sauce.svg",
    gallery: [],
    ingredients: ["Crispy garlic", "Chili flakes", "Shallots", "Oil", "Spices"],
    pairings: ["Ramen", "Rice bowls", "Dumplings"],
    categorySlug: "crunch",
    rating: 0,
    reviewCount: 0,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProduct(): Product {
  return products.find((p) => p.featured) ?? products[0];
}

export const reviews: Review[] = [
  {
    id: "r1",
    authorName: "Maria Santos",
    rating: 5,
    title: "The best chili garlic I've tried",
    body: "I put this on everything — eggs, rice, even pizza. The garlic flavor is so rich and the heat builds perfectly. Sarap!",
    verified: true,
    location: "Cebu City",
    date: "2026-05-12",
  },
  {
    id: "r2",
    authorName: "John Rivera",
    rating: 5,
    title: "Restaurant quality at home",
    body: "You can taste that it's handmade. Not too oily, real chili flavor, and the small batch quality shows. Already on my third jar.",
    verified: true,
    location: "Quezon City",
    date: "2026-04-28",
  },
  {
    id: "r3",
    authorName: "Andrea Lim",
    rating: 5,
    title: "A staple in our kitchen",
    body: "My family finishes a jar in a week. Perfect balance of heat and flavor. Packaging is premium too — feels like a gift.",
    verified: true,
    location: "Davao",
    date: "2026-04-10",
  },
  {
    id: "r4",
    authorName: "Paolo Mendoza",
    rating: 4,
    title: "Bold and fresh",
    body: "Genuinely spicy but you still taste the garlic and vinegar. Great with inasal. Wish the jar was bigger!",
    verified: true,
    location: "Iloilo City",
    date: "2026-03-22",
  },
  {
    id: "r5",
    authorName: "Grace Tan",
    rating: 5,
    title: "Obsessed",
    body: "The smoky finish is unreal. Ordered three more for my titas. Fast delivery too.",
    verified: true,
    location: "Makati",
    date: "2026-03-01",
  },
];

export const recipes: Recipe[] = [
  {
    id: "rc1",
    title: "Kulas Garlic Fried Rice",
    slug: "kulas-garlic-fried-rice",
    excerpt: "Two spoonfuls of Kulas transform leftover rice into a smoky, garlicky sinangag.",
    image: "/recipes/placeholder.svg",
    category: "Breakfast",
    prepTime: 5,
    cookTime: 10,
    servings: 2,
  },
  {
    id: "rc2",
    title: "Spicy Chili Garlic Noodles",
    slug: "spicy-chili-garlic-noodles",
    excerpt: "A 15-minute weeknight bowl with a glossy, fiery Kulas sauce.",
    image: "/recipes/placeholder.svg",
    category: "Mains",
    prepTime: 5,
    cookTime: 12,
    servings: 2,
  },
  {
    id: "rc3",
    title: "Grilled Inasal with Kulas Glaze",
    slug: "grilled-inasal-kulas-glaze",
    excerpt: "Brush Kulas over chicken inasal for a caramelized, spicy char.",
    image: "/recipes/placeholder.svg",
    category: "Grill",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
  },
  {
    id: "rc4",
    title: "Kulas Chili Garlic Eggs",
    slug: "kulas-chili-garlic-eggs",
    excerpt: "Crispy fried eggs finished with a spoon of Kulas. The ultimate breakfast.",
    image: "/recipes/placeholder.svg",
    category: "Breakfast",
    prepTime: 2,
    cookTime: 5,
    servings: 1,
  },
];

export const faqs: FaqItem[] = [
  {
    question: "How spicy is Kulas Chili Garlic Sauce?",
    answer:
      "It sits at a 4 out of 5 on our heat meter — a confident, building heat that never overwhelms the garlic and vinegar flavor. Most first-timers describe it as 'perfectly spicy.'",
  },
  {
    question: "What's the shelf life and how do I store it?",
    answer:
      "Unopened, each jar keeps for 12 months in a cool, dry place. Once opened, refrigerate and enjoy within 2 months. Because we use no artificial preservatives, keeping it cold preserves the fresh flavor.",
  },
  {
    question: "Is it made with preservatives?",
    answer:
      "Never. Kulas is small-batch cooked with fresh chili, garlic, oil, salt, and vinegar — nothing artificial. The natural acidity and oil keep it shelf-stable.",
  },
  {
    question: "Where do you ship and how much is shipping?",
    answer:
      "We ship nationwide across the Philippines. Standard shipping is a flat ₱120, and orders over ₱1,000 ship free. Metro Manila typically arrives in 2–3 business days.",
  },
  {
    question: "Do you offer bulk or reseller pricing?",
    answer:
      "Yes! We love working with cafés, restaurants, and resellers. Reach out through our contact form and our team will send you a wholesale price list.",
  },
  {
    question: "Is Kulas vegan and gluten-free?",
    answer:
      "The Chili Garlic Sauce is 100% plant-based and contains no gluten ingredients. It's crafted in a facility that handles common condiments, so contact us for detailed allergen info.",
  },
];

export const whyChooseUs = [
  {
    title: "Fresh Ingredients",
    description: "Sourced daily from local Filipino farms — real chili, real garlic.",
    icon: "Sprout",
  },
  {
    title: "Authentic Flavor",
    description: "A family recipe perfected over years, never compromised.",
    icon: "Flame",
  },
  {
    title: "Small Batch",
    description: "Cooked in limited batches so every jar tastes handmade.",
    icon: "ChefHat",
  },
  {
    title: "No Preservatives",
    description: "Nothing artificial. Just fresh ingredients and slow craft.",
    icon: "Leaf",
  },
  {
    title: "Premium Quality",
    description: "From the recipe to the jar, we obsess over every detail.",
    icon: "Award",
  },
  {
    title: "Fast Delivery",
    description: "Nationwide shipping with careful, spill-proof packaging.",
    icon: "Truck",
  },
] as const;

export const timeline = [
  {
    year: "2021",
    title: "A Family Recipe",
    description: "Kulas begins on a home stovetop in Iloilo, shared at Sunday lunches.",
  },
  {
    year: "2022",
    title: "Word Spreads",
    description: "Friends and neighbors ask for jars. The first small batches are sold.",
  },
  {
    year: "2024",
    title: "The Kulas Brand",
    description: "We refine the recipe, design the jar, and launch officially online.",
  },
  {
    year: "2026",
    title: "Growing the Table",
    description: "New condiments join the family as Kulas reaches kitchens nationwide.",
  },
] as const;
