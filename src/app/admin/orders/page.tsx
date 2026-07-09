export const dynamic = "force-dynamic";

import { AdminTopbar } from "@/components/admin/topbar";
import { prisma } from "@/lib/prisma";
import { getDashboardStats } from "@/services/dashboard";
import { formatPrice } from "@/lib/utils";

async function loadOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    if (orders.length > 0) {
      return orders.map((o) => ({
        orderNumber: o.orderNumber,
        email: o.email,
        total: Number(o.total),
        status: o.status,
        // Manual PH payment channels are stored as "manual:<METHOD>".
        payment: o.stripeSession?.startsWith("manual:")
          ? o.stripeSession.slice(7)
          : o.stripeSession
            ? "CARD"
            : "—",
        date: o.createdAt.toISOString().slice(0, 10),
      }));
    }
  } catch {
    /* fall back */
  }
  return (await getDashboardStats()).recentOrders.map((o) => ({
    ...o,
    payment: "—",
  }));
}

export default async function AdminOrdersPage() {
  const orders = await loadOrders();

  return (
    <div>
      <AdminTopbar title="Orders" />
      <div className="p-6">
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
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold">
                      {o.status}
                    </span>
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
        </div>
      </div>
    </div>
  );
}