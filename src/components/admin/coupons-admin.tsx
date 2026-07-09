"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Tag, Loader2, X, Pencil, Trash2 } from "lucide-react";
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
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const demo = coupons.some((c) => c.demo);

  async function toggleActive(c: AdminCoupon) {
    setBusy(c.id);
    setError("");
    try {
      const res = await fetch(`/api/coupons/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !c.active }),
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

  async function remove(id: string) {
    if (!window.confirm("Delete this coupon permanently?")) return;
    setBusy(id);
    setError("");
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Delete failed");
      }
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
          {coupons.length} coupons
          {demo && " · demo data (connect a database to manage coupons)"}
          {error && (
            <span className="ml-2 text-brand-secondary">{error}</span>
          )}
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
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
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
                <td className="p-4">
                  <button
                    onClick={() => toggleActive(c)}
                    disabled={demo || busy === c.id}
                    title={c.active ? "Click to deactivate" : "Click to activate"}
                    className={
                      c.active
                        ? "rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-400 hover:bg-green-500/25 disabled:pointer-events-none"
                        : "rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-muted hover:bg-white/10 disabled:pointer-events-none"
                    }
                  >
                    {busy === c.id ? "…" : c.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  {busy === c.id ? (
                    <Loader2 className="ml-auto h-4 w-4 animate-spin text-muted" />
                  ) : (
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditing(c)}
                        disabled={demo}
                        className="inline-grid h-8 w-8 place-items-center rounded-full hover:bg-white/10 disabled:opacity-40"
                        aria-label={`Edit ${c.code}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(c.id)}
                        disabled={demo}
                        className="inline-grid h-8 w-8 place-items-center rounded-full text-brand-secondary hover:bg-brand-primary/15 disabled:opacity-40"
                        aria-label={`Delete ${c.code}`}
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
        {coupons.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">
            No coupons yet — create one with the button above.
          </p>
        )}
      </div>

      <CouponFormModal
        open={creating}
        coupon={null}
        onClose={() => setCreating(false)}
      />
      <CouponFormModal
        open={Boolean(editing)}
        coupon={editing}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}

function CouponFormModal({
  open,
  coupon,
  onClose,
}: {
  open: boolean;
  coupon: AdminCoupon | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(coupon);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [value, setValue] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [lastId, setLastId] = useState<string | null>(null);
  if (coupon && coupon.id !== lastId) {
    setLastId(coupon.id);
    setCode(coupon.code);
    setType(coupon.type === "FIXED" ? "FIXED" : "PERCENT");
    setValue(String(coupon.value));
    setMaxUses(coupon.maxUses ? String(coupon.maxUses) : "");
  }

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

      const payload = {
        code: code.trim().toUpperCase(),
        type,
        value: valueNum,
        maxUses: maxUses ? Number(maxUses) : isEdit ? null : undefined,
      };

      const res = isEdit
        ? await fetch(`/api/coupons/${coupon!.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/coupons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      router.refresh();
      if (!isEdit) {
        setCode("");
        setValue("");
        setMaxUses("");
      }
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
            aria-label={isEdit ? "Edit coupon" : "New coupon"}
            className="fixed inset-0 z-[81] m-auto h-fit w-[92%] max-w-md rounded-4xl border border-white/10 bg-surface/95 p-6 backdrop-blur-2xl sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-heading text-2xl font-extrabold">
              {isEdit ? `Edit ${coupon!.code}` : "New coupon"}
            </h3>

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
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : isEdit ? (
                  "Save changes"
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
