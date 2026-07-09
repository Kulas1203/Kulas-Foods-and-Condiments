"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, Wallet, Smartphone, Landmark, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import { paymentMethods, type PaymentMethodKey } from "@/data/site";

const PAYMENT_OPTIONS: {
  key: PaymentMethodKey;
  icon: typeof Wallet;
  color: string;
}[] = [
  { key: "GCASH", icon: Smartphone, color: "from-sky-500/20 to-sky-500/5" },
  { key: "MAYA", icon: Wallet, color: "from-emerald-500/20 to-emerald-500/5" },
  {
    key: "CHINABANK",
    icon: Landmark,
    color: "from-brand-primary/20 to-brand-primary/5",
  },
];

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>("GCASH");
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
          paymentMethod,
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
      router.push(
        `/checkout/success?order=${json.data.orderNumber}&pay=${paymentMethod}&total=${json.data.total}`,
      );
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

          <Section title="Payment Method">
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYMENT_OPTIONS.map(({ key, icon: Icon, color }) => {
                const m = paymentMethods[key];
                const active = paymentMethod === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPaymentMethod(key)}
                    aria-pressed={active}
                    className={cn(
                      "relative rounded-2xl border bg-gradient-to-b p-4 text-left transition-all",
                      color,
                      active
                        ? "border-brand-secondary/60 ring-2 ring-brand-secondary/40"
                        : "border-white/10 hover:border-white/25",
                    )}
                  >
                    {active && (
                      <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-brand-gradient">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                    )}
                    <Icon className="h-6 w-6 text-white/90" />
                    <p className="mt-2 font-heading text-sm font-bold">
                      {m.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted">
                      {m.note}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted">
              Place your order, then pay via{" "}
              <span className="font-semibold text-white">
                {paymentMethods[paymentMethod].label}
              </span>{" "}
              using your order number as reference — full instructions appear on
              the next screen and in your email.
            </p>
          </Section>

          {error && <p className="text-sm text-brand-secondary">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            <Lock className="h-4 w-4" />
            {loading
              ? "Processing..."
              : `Place order · ${formatPrice(total + shipping)}`}
          </Button>
          <p className="text-center text-xs text-muted">
            Pay via GCash, Maya, or China Bank after placing your order.
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
