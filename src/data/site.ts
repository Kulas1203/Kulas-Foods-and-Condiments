/** Global site configuration — single source of truth for branding & nav. */

export const siteConfig = {
  name: "Kulas Foods and Condiments",
  shortName: "Kulas",
  description:
    "Premium handcrafted chili garlic sauce made from fresh ingredients for every Filipino kitchen. Crafted with fire, made with flavor.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/products/kulas-chili-garlic-sauce.jpg",
  tagline: "Crafted with Fire. Made with Flavor.",
  email: "rysarsuelo2@gmail.com",
  phone: "0992 890 9806 / 0995 109 4135",
  address: "Butuan City, Philippines",
  socials: {
    facebook: "https://www.facebook.com/KulasChiliGarlicSauce",
  },
} as const;

/**
 * Payment channels shown at checkout. Customers pay directly to these
 * accounts and use their order number as the payment reference.
 * ⚠️ Confirm/update these details before taking real orders.
 */
export type PaymentMethod = {
  label: string;
  accountName: string;
  /** Empty string = not configured yet (checkout says details follow by email). */
  accountNumber: string;
  note: string;
  /** Path under /public to the official app-exported QR (e.g. "/payments/gcash-qr.jpg"). */
  qrImage: string;
};

export const paymentMethods: Record<"GCASH" | "MAYA" | "CHINABANK", PaymentMethod> = {
  GCASH: {
    label: "GCash",
    accountName: "Ralph Ryan Sarsuelo",
    accountNumber: "0995 109 4135",
    note: "Send via the GCash app — Express Send or scan the QR.",
    // Export from GCash app: Profile → My QR → Save, then place the image
    // at public/payments/gcash-qr.jpg and set the path here.
    qrImage: "",
  },
  MAYA: {
    label: "Maya",
    accountName: "Ralph Ryan Sarsuelo",
    accountNumber: "0995 109 4135",
    note: "Send via the Maya app or scan the QR.",
    qrImage: "",
  },
  CHINABANK: {
    label: "China Bank",
    accountName: "Ralph Ryan Sarsuelo",
    accountNumber: "6291 0214 5769",
    note: "Bank transfer via China Bank app, InstaPay, or over the counter.",
    qrImage: "",
  },
};

export type PaymentMethodKey = keyof typeof paymentMethods;

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
