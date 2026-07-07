"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = subtotal();
  const shipping = total > 1000 || total === 0 ? 0 : 120;

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          address: { ...address, country: "Philippines" },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Checkout failed");

      if (json.data.checkoutUrl) {
        window.location.href = json.data.checkoutUrl;
        return;
      }
      clear();
      router.push(`/checkout/success?order=${json.data.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-px grid min-h-[70vh] place-items-center pt-24 text-center">
        <div>
          <h1 className="font-heading text-3xl font-bold">Your cart is empty</h1>
          <p className="mt-3 text-muted">Add something spicy to get started.</p>
          <Button asChild className="mt-6">
            <Link href="/products">Shop products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-px pb-24 pt-32">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Continue shopping
      </Link>

      <h1 className="font-heading text-4xl font-extrabold">Checkout</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        {/* Form */}
        <form onSubmit={placeOrder} className="space-y-5">
          <Section title="Contact">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />
          </Section>
          <Section title="Shipping Address">
            <Input
              label="Street address"
              value={address.line1}
              onChange={(v) => setAddress({ ...address, line1: v })}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="City"
                value={address.city}
                onChange={(v) => setAddress({ ...address, city: v })}
                required
              />
              <Input
                label="Province"
                value={address.province}
                onChange={(v) => setAddress({ ...address, province: v })}
                required
              />
            </div>
            <Input
              label="Postal code"
              value={address.postalCode}
              onChange={(v) => setAddress({ ...address, postalCode: v })}
              required
            />
          </Section>

          {error && <p className="text-sm text-brand-secondary">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            <Lock className="h-4 w-4" />
            {loading ? "Processing..." : `Pay ${formatPrice(total + shipping)}`}
          </Button>
          <p className="text-center text-xs text-muted">
            Secure checkout · Stripe-ready. No card is charged in demo mode.
          </p>
        </form>

        {/* Summary */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-fit rounded-4xl border border-white/10 bg-surface/50 p-6 backdrop-blur-xl"
        >
          <h2 className="mb-4 font-heading text-lg font-bold">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-black/40">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(total)} />
            <Row
              label="Shipping"
              value={shipping === 0 ? "Free" : formatPrice(shipping)}
            />
            <div className="flex justify-between border-t border-white/10 pt-3 font-heading text-lg font-bold">
              <span>Total</span>
              <span className="text-gradient">{formatPrice(total + shipping)}</span>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-4xl border border-white/10 bg-surface/50 p-6 backdrop-blur-xl">
      <h2 className="font-heading text-lg font-bold">{title}</h2>
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-brand-secondary/50 focus:outline-none"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted">
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
