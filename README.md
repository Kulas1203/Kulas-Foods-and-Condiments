# 🌶️ Kulas Foods and Condiments

> **Crafted with Fire. Made with Flavor.**

A world-class, premium e-commerce platform and marketing site for **Kulas Foods and Condiments** — a Filipino artisan condiment brand. Built with a luxury, animated, glassmorphic aesthetic (Apple × Aesop × Tesla energy) and a warm, bold food identity.

The flagship product is the **Kulas Chili Garlic Sauce**, featured throughout the experience with a 3D floating product jar, scroll-driven storytelling, and a full commerce + CMS backend.

---

## ✨ Features

### Storefront
- **Cinematic hero** — 3D rotating jar (React Three Fiber) with soft spotlight, mouse parallax, floating chili/garlic particles, ember glow, and a particle field.
- **Scroll-driven storytelling** — parallax, fade-in-on-scroll sections, animated "Made with Love" timeline, and an animated sauce-wave divider between sections.
- **Featured product** — heat meter animation, ingredients, best pairings, nutrition facts, quantity selector, add-to-cart, favorite, and share.
- **Product showcase** — horizontal scroll gallery with future-product placeholders.
- **Reviews carousel** — glass cards, verified badges, star ratings.
- **Recipes** — searchable, category-filtered recipe grid with video hotspots.
- **Animated FAQ accordion**, **interactive contact form** + map placeholder + socials.
- **Sticky blurred navbar** with animated logo, scroll-progress indicator, and mobile menu.
- **Cursor flame glow**, **splash screen**, **magnetic-button hook**, **micro-interactions everywhere**.
- **Lenis smooth scrolling**, dark-first theming, reduced-motion aware, PWA/offline support.

### Commerce
- Cart (Zustand + localStorage persistence), slide-out cart drawer, checkout, order confirmation, coupon system, wishlist-ready, product search/sort/filter, inventory + low-stock tracking.
- **Stripe-ready** checkout — creates a Stripe Checkout session when keys are present, otherwise falls back to a demo confirmation flow.
- **Resend** email service for order confirmations, contact notifications, and welcome emails (safe no-op without an API key).

### Admin Dashboard (custom CMS — no WordPress)
- Revenue / orders / customers / inventory KPIs, sales-overview area chart (Recharts), top products, recent orders, low-stock alerts, and admin notifications.
- Products, orders, customers, coupons, reviews, recipes, and settings sections.
- **Drag-and-drop Media Library** — drag/drop, click, or paste images; live grid with copy-URL and delete; uploads to **Cloudinary** when configured, otherwise to local disk. Admin-guarded, Zod/size/type validated.
- Role-based access (`STAFF` / `ADMIN` / `SUPER_ADMIN`) enforced by middleware + NextAuth.

---

## 🧱 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | **Next.js 15** (App Router), **React 19**, **TypeScript** |
| Styling | **TailwindCSS**, shadcn-style UI, CSS-variable design tokens |
| Animation | **Framer Motion**, **GSAP**-ready, **Lenis** smooth scroll |
| 3D | **Three.js** / **React Three Fiber** + **drei** |
| State | **Zustand** (cart) |
| Backend | Next.js **API Routes**, **Prisma ORM**, **PostgreSQL** |
| Auth | **NextAuth** (JWT strategy) + **bcrypt** |
| Payments | **Stripe** (ready) |
| Email | **Resend** |
| Validation | **Zod** |
| Media | **Cloudinary / UploadThing** ready |
| Icons | **Lucide** |

---

## 📁 Project Structure

```
.
├── prisma/
│   ├── schema.prisma          # Full data model (User, Product, Order, Coupon, …)
│   └── seed.ts                # Seed admin, products, reviews, recipes, coupon
├── public/                    # Static assets, SVG placeholders, service worker
├── src/
│   ├── animations/            # Shared Framer Motion variants
│   ├── app/
│   │   ├── (store)/           # Public storefront (own layout: navbar/footer/cart)
│   │   │   ├── page.tsx        # Home (all sections)
│   │   │   ├── products/       # Listing + [slug] detail
│   │   │   └── checkout/       # Checkout + success
│   │   ├── admin/             # Admin dashboard (own layout + middleware guard)
│   │   ├── api/               # REST route handlers
│   │   ├── login/             # Admin sign-in
│   │   ├── layout.tsx         # Root (fonts, theme, PWA)
│   │   ├── manifest.ts        # PWA manifest
│   │   ├── sitemap.ts         # Dynamic sitemap
│   │   └── robots.ts          # robots.txt
│   ├── components/
│   │   ├── admin/  effects/  layout/  motion/
│   │   ├── product/  providers/  sections/  three/  ui/
│   ├── data/                  # Static catalog + site config (extensible)
│   ├── features/cart/         # Cart store
│   ├── hooks/                 # useMediaQuery, useMagnetic
│   ├── lib/                   # prisma, auth, stripe, api, utils, validations
│   ├── services/              # email, orders, dashboard (business logic)
│   ├── types/                 # Shared types + next-auth augmentation
│   └── middleware.ts          # Admin route protection
├── Dockerfile  docker-compose.yml  .env.example
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js ≥ 20
- PostgreSQL 16 (or use the bundled Docker Compose)

### 2. Install
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Fill in DATABASE_URL, NEXTAUTH_SECRET, and optionally Stripe/Resend keys
```

### 4. Database
```bash
# Spin up Postgres quickly (optional)
docker compose up -d db

npm run db:push      # apply the Prisma schema
npm run db:seed      # seed admin, products, reviews, recipes, coupon
```

### 5. Run
```bash
npm run dev          # http://localhost:3000
```

- Storefront → `/`
- Admin dashboard → `/admin` (sign in at `/login`)
- Default admin credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.

### 6. Production build
```bash
npm run build && npm start
```

### 7. Docker (full stack)
```bash
docker compose up --build
# App on :3000, Postgres on :5432 — migrations run automatically
```

---

## 🖼️ Using the real product photo

The site ships with a branded **SVG placeholder** of the jar at
`public/products/kulas-chili-garlic-sauce.svg`. To use the real photograph:

1. Drop the uploaded jar image into `public/products/` (e.g. `kulas-chili-garlic-sauce.jpg`).
2. Update the `heroImage` / `gallery` / `ogImage` paths in
   `src/data/products.ts` and `src/data/site.ts` (or edit the product in the admin dashboard once seeded).

For production PWA install icons you may also add `public/icon-192.png` and `public/icon-512.png`
(the app currently uses the scalable `src/app/icon.svg` everywhere).

---

## 🔌 API Overview

| Method | Route | Description |
| --- | --- | --- |
| `GET/POST` | `/api/products` | List / create products |
| `GET/PATCH/DELETE` | `/api/products/[slug]` | Read / update / delete a product |
| `GET/POST` | `/api/reviews` | List approved / submit review |
| `POST` | `/api/checkout` | Price cart, create order, Stripe session |
| `POST` | `/api/coupons/validate` | Validate a coupon against a subtotal |
| `GET/POST` | `/api/media` | List / upload media (admin, multipart) |
| `DELETE` | `/api/media/[id]` | Delete a media asset (admin) |
| `POST` | `/api/contact` | Store + email a contact message |
| `POST` | `/api/newsletter` | Newsletter subscribe |
| `POST` | `/api/auth/register` | Customer registration |
| `*` | `/api/auth/[...nextauth]` | NextAuth session endpoints |

All write routes validate input with **Zod** and return a consistent
`{ success, data | error }` envelope. Admin mutations are guarded by role.

---

## 🎨 Design Tokens

| Token | Value |
| --- | --- |
| Primary | `#C1121F` |
| Secondary | `#FF5A36` |
| Accent | `#F4B400` |
| Background | `#0F0F0F` |
| Surface | `#1B1B1B` |
| Text | `#FFFFFF` |
| Muted | `#A0A0A0` |
| Gradient | Deep Red → Orange → Gold |

Fonts: **Poppins** (headings), **Inter** (body), **Montserrat** (buttons).

---

## 🧪 Extending

- **Add a product**: append to `src/data/products.ts` (or create via the admin API) — it flows through the home page, showcase, product pages, sitemap, and seed automatically.
- **Add a section**: create a component in `src/components/sections/` and drop it into `src/app/(store)/page.tsx`.
- The architecture is unit-test-ready: pure business logic lives in `src/services` and `src/lib`, cleanly separated from UI.

---

## 📌 Notes & Roadmap
The **drag-and-drop media library** is now fully implemented (Cloudinary + local-disk fallback, admin-guarded API at `/api/media`). A couple of advanced items remain architected/stubbed for incremental extension: the live WebSocket sales feed and AI recipe recommendations. The data models, services, and UI hooks are in place to implement them.

---

© Kulas Foods and Condiments. All rights reserved.
