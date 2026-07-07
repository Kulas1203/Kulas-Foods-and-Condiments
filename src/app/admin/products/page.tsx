export const dynamic = "force-dynamic";

import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { products as demoProducts } from "@/data/products";
import { formatPrice } from "@/lib/utils";

async function loadProducts() {
  try {
    const dbProducts = await prisma.product.findMany({
      include: { inventory: true },
      orderBy: { createdAt: "desc" },
    });
    if (dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
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
    name: p.name,
    heroImage: p.heroImage,
    price: p.price,
    status: p.status,
    stock: p.status === "ACTIVE" ? 142 : 0,
  }));
}

export default async function AdminProductsPage() {
  const products = await loadProducts();

  return (
    <div>
      <AdminTopbar title="Products" />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">{products.length} products</p>
          <Button size="sm">
            <Plus className="h-4 w-4" /> New Product
          </Button>
        </div>

        <div className="overflow-hidden rounded-4xl border border-white/10 bg-surface/50 backdrop-blur-xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-widest text-muted">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/40">
                        <Image
                          src={p.heroImage}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{formatPrice(p.price)}</td>
                  <td className="p-4">
                    <span
                      className={
                        p.stock <= 10 ? "text-brand-secondary" : "text-white"
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      className="inline-grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}