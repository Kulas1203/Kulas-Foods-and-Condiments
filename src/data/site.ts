/** Global site configuration — single source of truth for branding & nav. */

export const siteConfig = {
  name: "Kulas Foods and Condiments",
  shortName: "Kulas",
  description:
    "Premium handcrafted chili garlic sauce made from fresh ingredients for every Filipino kitchen. Crafted with fire, made with flavor.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/products/kulas-chili-garlic-sauce.svg",
  tagline: "Crafted with Fire. Made with Flavor.",
  email: "hello@kulasfoods.com",
  phone: "+63 900 000 0000",
  address: "Iloilo City, Philippines",
  socials: {
    facebook: "https://facebook.com/kulasfoods",
    instagram: "https://instagram.com/kulasfoods",
    tiktok: "https://tiktok.com/@kulasfoods",
  },
} as const;

export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Product", href: "/#featured" },
  { label: "Why Kulas", href: "/#why" },
  { label: "Recipes", href: "/#recipes" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Contact", href: "/#contact" },
] as const;

export const footerLinks = {
  Shop: [
    { label: "Chili Garlic Sauce", href: "/products/kulas-chili-garlic-sauce" },
    { label: "All Products", href: "/products" },
    { label: "Gift Sets", href: "/products?category=gifts" },
  ],
  Company: [
    { label: "Our Story", href: "/#about" },
    { label: "Recipes", href: "/#recipes" },
    { label: "Contact", href: "/#contact" },
  ],
  Support: [
    { label: "FAQ", href: "/#faq" },
    { label: "Shipping", href: "/#faq" },
    { label: "Returns", href: "/#faq" },
  ],
};
