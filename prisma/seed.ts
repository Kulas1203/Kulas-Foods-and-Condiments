import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { products, reviews, recipes } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
  console.log("🌶️  Seeding Kulas Foods database...");

  // ── Admin user ──
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@kulasfoods.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "SUPER_ADMIN", passwordHash },
    create: {
      email: adminEmail,
      name: "Kulas Admin",
      role: "SUPER_ADMIN",
      passwordHash,
    },
  });
  console.log(`✅ Admin: ${adminEmail}`);

  // ── Categories ──
  const categoryNames = ["Sauces", "Vinegars", "Crunch"];
  const categories: Record<string, string> = {};
  for (const name of categoryNames) {
    const slug = name.toLowerCase();
    const cat = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    categories[slug] = cat.id;
  }
  console.log(`✅ Categories: ${categoryNames.length}`);

  // ── Products + inventory ──
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        tagline: p.tagline,
        description: p.description,
        story: p.story,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        currency: p.currency,
        heatLevel: p.heatLevel,
        netWeight: p.netWeight,
        status: p.status,
        featured: p.featured,
        heroImage: p.heroImage,
        gallery: p.gallery,
        ingredients: p.ingredients,
        pairings: p.pairings,
        nutrition: p.nutrition ? { ...p.nutrition } : undefined,
        categoryId: p.categorySlug ? categories[p.categorySlug] : undefined,
      },
    });

    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        sku: `KLS-${p.slug.toUpperCase().slice(0, 12)}`,
        quantity: p.status === "ACTIVE" ? 142 : 0,
        lowStockAlert: 20,
      },
    });

    // Reviews (attach approved reviews to the flagship product)
    if (p.featured) {
      for (const r of reviews) {
        await prisma.review.create({
          data: {
            productId: product.id,
            authorName: r.authorName,
            rating: r.rating,
            title: r.title,
            body: r.body,
            verified: r.verified,
            approved: true,
          },
        });
      }
    }
  }
  console.log(`✅ Products: ${products.length}`);

  // ── Recipes ──
  for (const r of recipes) {
    await prisma.recipe.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        content: r.excerpt,
        image: r.image,
        category: r.category,
        prepTime: r.prepTime,
        cookTime: r.cookTime,
        servings: r.servings,
        ingredients: r.ingredients,
        steps: r.steps,
        published: true,
      },
    });
  }
  console.log(`✅ Recipes: ${recipes.length}`);

  // ── Sample coupon ──
  await prisma.coupon.upsert({
    where: { code: "KULAS10" },
    update: {},
    create: { code: "KULAS10", type: "PERCENT", value: 10, active: true },
  });
  console.log("✅ Coupon: KULAS10 (10% off)");

  console.log("🔥 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
