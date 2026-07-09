export const dynamic = "force-dynamic";

import { AdminTopbar } from "@/components/admin/topbar";
import { ProductsAdmin, type AdminProduct } from "@/components/admin/products-admin";
import { prisma } from "@/lib/prisma";
import { products as demoProducts } from "@/data/products";

async function loadProducts(): Promise<AdminProduct[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      include: { inventory: true },
      orderBy: { createdAt: "desc" },
    });
    if (dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        heroImage: p.heroImage,
        price: Number(p.price),
        status: p.status,
        stock: p.inventory?.quantity ?? 0,
      }));
    }
  } catch {
    /* fall back to demo */
  }
  return demoProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    heroImage: p.heroImage,
    price: p.price,
    status: p.status,
    stock: p.status === "ACTIVE" ? 142 : 0,
    demo: true,
  }));
}

export default async function AdminProductsPage() {
  const products = await loadProducts();

  return (
    <div>
      <AdminTopbar title="Products" />
      <div className="p-6">
        <ProductsAdmin products={products} />
      </div>
    </div>
  );
}
