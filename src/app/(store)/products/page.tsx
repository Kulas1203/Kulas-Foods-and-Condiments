import type { Metadata } from "next";
import { products } from "@/data/products";
import { ProductGrid } from "@/components/product/product-grid";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse the full Kulas Foods and Condiments collection — handcrafted chili garlic sauce and more.",
};

export default function ProductsPage() {
  return (
    <div className="container-px pb-24 pt-32">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-4xl font-extrabold sm:text-5xl">
          The <span className="text-gradient">Kulas</span> Collection
        </h1>
        <p className="mt-4 text-muted">
          Small-batch, handcrafted, and made with fire. Explore every flavor.
        </p>
      </div>
      <div className="mt-14">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
