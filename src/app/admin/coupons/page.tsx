export const dynamic = "force-dynamic";

import { Plus, Tag } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

type CouponRow = {
  id: string;
  code: string;
  type: string;
  value: number;
  used: number;
  maxUses: number | null;
  active: boolean;
  expires: string | null;
};

async function loadCoupons(): Promise<CouponRow[]> {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (coupons.length > 0) {
      return coupons.map((c) => ({
        id: c.id,
        code: c.code,
        type: c.type,
        value: Number(c.value),
        used: c.usedCount,
        maxUses: c.maxUses,
        active: c.active,
        expires: c.expiresAt ? c.expiresAt.toISOString().slice(0, 10) : null,
      }));
    }
  } catch {
    /* fall back to demo */
  }
  return [
    {
      id: "demo-kulas10",
      code: "KULAS10",
      type: "PERCENT",
      value: 10,
      used: 0,
      maxUses: null,
      active: true,
      expires: null,
    },
  ];
}

function formatValue(type: string, value: number) {
  return type === "PERCENT" ? `${value}% off` : `₱${value.toFixed(0)} off`;
}

export default async function AdminCouponsPage() {
  const coupons = await loadCoupons();

  return (
    <div>
      <AdminTopbar title="Coupons" />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">{coupons.length} coupons</p>
          <Button size="sm">
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
                  <td className="p-4">{formatValue(c.type, c.value)}</td>
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
      </div>
    </div>
  );
}
