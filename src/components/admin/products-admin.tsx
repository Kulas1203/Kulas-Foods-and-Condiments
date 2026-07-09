"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, X, ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, slugify } from "@/lib/utils";

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  heroImage: string;
  price: number;
  status: string;
  stock: number;
  demo?: boolean;
};

const STATUSES = ["ACTIVE", "DRAFT", "COMING_SOON", "ARCHIVED"] as const;

export function ProductsAdmin({ products }: { products: AdminProduct[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const demo = products.some((p) => p.demo);

  async function remove(p: AdminProduct) {
    if (
      !window.confirm(
        `Delete "${p.name}" permanently? This cannot be undone.`,
      )
    )
      return;
    setBusy(p.id);
    setError("");
    try {
      const res = await fetch(`/api/products/${p.slug}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Delete failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          {products.length} products
          {demo && " · demo data (connect a database to manage products)"}
        </p>
        <Button size="sm" onClick={() => setCreating(true)} disabled={demo}>
          <Plus className="h-4 w-4" /> New Product
        </Button>
      </div>

      {error && <p className="text-sm text-brand-secondary">{error}</p>}

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
                  {busy === p.id ? (
                    <Loader2 className="ml-auto h-4 w-4 animate-spin text-muted" />
                  ) : (
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditing(p)}
                        disabled={demo}
                        className="inline-grid h-8 w-8 place-items-center rounded-full hover:bg-white/10 disabled:opacity-40"
                        aria-label={`Edit ${p.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(p)}
                        disabled={demo}
                        className="inline-grid h-8 w-8 place-items-center rounded-full text-brand-secondary hover:bg-brand-primary/15 disabled:opacity-40"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        open={creating}
        onClose={() => setCreating(false)}
        product={null}
      />
      <ProductFormModal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        product={editing}
      />
    </div>
  );
}

function ProductFormModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: AdminProduct | null;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(product);
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [status, setStatus] = useState(product?.status ?? "ACTIVE");
  const [heatLevel, setHeatLevel] = useState(4);
  const [netWeight, setNetWeight] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(""); // uploaded image URL (pending save)
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keep fields in sync when a different product is opened.
  const [lastId, setLastId] = useState<string | null>(null);
  if (product && product.id !== lastId) {
    setLastId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setStatus(product.status);
    setPhoto("");
  }

  const previewSrc = photo || product?.heroImage || "";

  async function uploadPhoto(file: File) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("files", file);
      form.append("folder", "products");
      form.append("alt", name || file.name);
      const res = await fetch("/api/media", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      const url = json.data?.[0]?.url;
      if (!url) throw new Error("Upload failed");
      setPhoto(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const priceNum = Number(price);
      if (!Number.isFinite(priceNum) || priceNum <= 0)
        throw new Error("Enter a valid price");

      const res = isEdit
        ? await fetch(`/api/products/${product!.slug}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              price: priceNum,
              status,
              ...(photo ? { heroImage: photo } : {}),
            }),
          })
        : await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              slug: slugify(name),
              price: priceNum,
              status,
              heatLevel,
              netWeight: netWeight || undefined,
              description:
                description.length >= 10
                  ? description
                  : `${name} — handcrafted by Kulas Foods and Condiments.`,
              heroImage: photo || "/products/kulas-chili-garlic-sauce.jpg",
            }),
          });
      const json = await res.json();
      if (!res.ok) {
        const details = json.details
          ? Object.entries(json.details as Record<string, string[]>)
              .map(([k, v]) => `${k}: ${v.join(", ")}`)
              .join(" · ")
          : "";
        throw new Error(details || json.error || "Save failed");
      }
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={isEdit ? "Edit product" : "New product"}
            className="fixed inset-0 z-[81] m-auto h-fit max-h-[90vh] w-[92%] max-w-lg overflow-y-auto rounded-4xl border border-white/10 bg-surface/95 p-6 backdrop-blur-2xl sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-heading text-2xl font-extrabold">
              {isEdit ? `Edit ${product!.name}` : "New product"}
            </h3>

            <form onSubmit={submit} className="mt-6 grid gap-4">
              {/* Product photo */}
              <Field label="Product photo">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    {previewSrc ? (
                      <Image
                        src={previewSrc}
                        alt="Product photo"
                        fill
                        sizes="80px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <ImageUp className="absolute inset-0 m-auto h-6 w-6 text-muted" />
                    )}
                  </div>
                  <div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadPhoto(f);
                        e.target.value = "";
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={uploading}
                      onClick={() => fileRef.current?.click()}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />{" "}
                          Uploading…
                        </>
                      ) : (
                        <>
                          <ImageUp className="h-4 w-4" /> Upload photo
                        </>
                      )}
                    </Button>
                    <p className="mt-1.5 text-[11px] text-muted">
                      JPG/PNG/WebP, max 8MB.
                      {photo && " ✓ New photo ready — save to apply."}
                    </p>
                  </div>
                </div>
              </Field>

              <Field label="Name">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-input"
                  placeholder="e.g. Kulas Garlic Chili Crunch"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (PHP)">
                  <input
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="admin-input"
                    placeholder="95"
                  />
                </Field>
                <Field label="Status">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="admin-input"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-surface">
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {!isEdit && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={`Heat level: ${heatLevel}/5`}>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={heatLevel}
                        onChange={(e) => setHeatLevel(Number(e.target.value))}
                        className="w-full accent-brand-secondary"
                      />
                    </Field>
                    <Field label="Net weight (optional)">
                      <input
                        value={netWeight}
                        onChange={(e) => setNetWeight(e.target.value)}
                        className="admin-input"
                        placeholder="220g"
                      />
                    </Field>
                  </div>
                  <Field label="Description (optional)">
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="admin-input resize-none"
                      placeholder="What makes this product special?"
                    />
                  </Field>
                </>
              )}

              {error && <p className="text-sm text-brand-secondary">{error}</p>}

              <Button type="submit" disabled={loading || uploading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : isEdit ? (
                  "Save changes"
                ) : (
                  "Create product"
                )}
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
