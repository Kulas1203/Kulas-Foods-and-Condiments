export const dynamic = "force-dynamic";

import { AdminTopbar } from "@/components/admin/topbar";
import { CouponsAdmin, type AdminCoupon } from "@/components/admin/coupons-admin";
import { prisma } from "@/lib/prisma";

async function loadCoupons(): Promise<AdminCoupon[]> {
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
    // DB reachable but empty — still manageable, just no rows yet.
    return [];
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
      demo: true,
    },
  ];
}

export default async function AdminCouponsPage() {
  const coupons = await loadCoupons();

  return (
    <div>
      <AdminTopbar title="Coupons" />
      <div className="p-6">
        <CouponsAdmin coupons={coupons} />
      </div>
    </div>
  );
}
