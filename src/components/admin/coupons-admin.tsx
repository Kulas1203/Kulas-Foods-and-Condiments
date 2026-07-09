"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Tag, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AdminCoupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  used: number;
  maxUses: number | null;
  active: boolean;
  expires: string | null;
  demo?: boolean;
};

export function CouponsAdmin({ coupons }: { coupons: AdminCoupon[] }) {
  const [creating, setCreating] = useState(false);
  const demo = coupons.some((c) => c.demo);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {coupons.length} coupons
          {demo && " · demo data (connect a database to manage coupons)"}
        </p>
        <Button size="sm" onClick={() => setCreating(true)} disabled={demo}>
          <Plus className="h-4 w-4" /> New Coupon
        </Button>
      </div>

      <div className="overflow-hidden rounded-4xl border border-white/10 bg-surface/50 backdrop-blur-xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Used</th>
              <th className="p-4">Expires</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02]">
                <td className="p-4">
                  <span className="inline-flex items-center gap-2 font-mono text-sm font-semibold">
                    <Tag className="h-3.5 w-3.5 text-brand-accent" />
                    {c.code}
                  </span>
                </td>
                <td className="p-4">
                  {c.type === "PERCENT"
                    ? `${c.value}% off`
                    : `₱${c.value.toFixed(0)} off`}
                </td>
                <td className="p-4 text-muted">
                  {c.used}
                  {c.maxUses ? ` / ${c.maxUses}` : ""}
                </td>
                <td className="p-4 text-muted">{c.expires ?? "No expiry"}</td>
                <td className="p-4 text-right">
                  <span
                    className={
                      c.active
                        ? "rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-400"
                        : "rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-muted"
                    }
                  >
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CouponFormModal open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}

function CouponFormModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [value, setValue] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const valueNum = Number(value);
      if (!Number.isFinite(valueNum) || valueNum <= 0)
        throw new Error("Enter a valid discount value");
      if (type === "PERCENT" && valueNum > 100)
        throw new Error("Percent discount cannot exceed 100");

      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          type,
          value: valueNum,
          maxUses: maxUses ? Number(maxUses) : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not create coupon");
      router.refresh();
      setCode("");
      setValue("");
      setMaxUses("");
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
            aria-label="New coupon"
            className="fixed inset-0 z-[81] m-auto h-fit w-[92%] max-w-md rounded-4xl border border-white/10 bg-surface/95 p-6 backdrop-blur-2xl sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-heading text-2xl font-extrabold">New coupon</h3>

            <form onSubmit={submit} className="mt-6 grid gap-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                  Code
                </label>
                <input
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="admin-input font-mono uppercase"
                  placeholder="KULAS20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as "PERCENT" | "FIXED")
                    }
                    className="admin-input"
                  >
                    <option value="PERCENT" className="bg-surface">
                      Percent (%)
                    </option>
                    <option value="FIXED" className="bg-surface">
                      Fixed (₱)
                    </option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                    {type === "PERCENT" ? "Percent off" : "Amount off (₱)"}
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="admin-input"
                    placeholder={type === "PERCENT" ? "10" : "50"}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                  Max uses (optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  className="admin-input"
                  placeholder="Unlimited"
                />
              </div>

              {error && <p className="text-sm text-brand-secondary">{error}</p>}

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating…
                  </>
                ) : (
                  "Create coupon"
                )}
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
