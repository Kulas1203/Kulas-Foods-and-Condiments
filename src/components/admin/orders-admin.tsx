"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export type AdminOrder = {
  id: string;
  orderNumber: string;
  email: string;
  total: number;
  status: string;
  payment: string;
  date: string;
  demo?: boolean;
};

const STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-brand-accent/15 text-brand-accent",
  PAID: "bg-green-500/15 text-green-400",
  PROCESSING: "bg-sky-500/15 text-sky-400",
  SHIPPED: "bg-indigo-500/15 text-indigo-400",
  DELIVERED: "bg-green-500/15 text-green-400",
  CANCELLED: "bg-white/5 text-muted",
  REFUNDED: "bg-brand-primary/15 text-brand-secondary",
};

export function OrdersAdmin({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const demo = orders.some((o) => o.demo);

  async function setStatus(id: string, status: string) {
    setBusy(id);
    setError("");
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Update failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          {orders.length} orders
          {demo && " · demo data (connect a database to manage orders)"}
        </p>
        {error && <p className="text-sm text-brand-secondary">{error}</p>}
      </div>

      <div className="overflow-hidden rounded-4xl border border-white/10 bg-surface/50 backdrop-blur-xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((o) => (
              <tr key={o.orderNumber} className="hover:bg-white/[0.02]">
                <td className="p-4 font-mono text-xs">{o.orderNumber}</td>
                <td className="p-4 text-muted">{o.email}</td>
                <td className="p-4">
                  {demo ? (
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold">
                      {o.status}
                    </span>
                  ) : busy === o.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted" />
                  ) : (
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value)}
                      aria-label={`Status for order ${o.orderNumber}`}
                      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold focus:outline-none ${
                        STATUS_STYLES[o.status] ?? "bg-white/5"
                      }`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-surface text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="p-4">
                  <span className="rounded-full bg-brand-accent/10 px-2.5 py-1 text-xs font-semibold text-brand-accent">
                    {o.payment}
                  </span>
                </td>
                <td className="p-4 text-right font-semibold">
                  {formatPrice(o.total)}
                </td>
                <td className="p-4 text-right text-muted">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">
            No orders yet — they&apos;ll appear here as customers check out.
          </p>
        )}
      </div>
    </div>
  );
}
