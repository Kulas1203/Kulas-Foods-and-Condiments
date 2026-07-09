export const dynamic = "force-dynamic";

import { AdminTopbar } from "@/components/admin/topbar";
import { OrdersAdmin, type AdminOrder } from "@/components/admin/orders-admin";
import { prisma } from "@/lib/prisma";
import { getDashboardStats } from "@/services/dashboard";

async function loadOrders(): Promise<AdminOrder[]> {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return orders.map((o) => ({
      id: o.id,
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
  } catch {
    /* fall back to demo */
  }
  return (await getDashboardStats()).recentOrders.map((o, i) => ({
    ...o,
    id: `demo-${i}`,
    payment: "—",
    demo: true,
  }));
}

export default async function AdminOrdersPage() {
  const orders = await loadOrders();

  return (
    <div>
      <AdminTopbar title="Orders" />
      <div className="p-6">
        <OrdersAdmin orders={orders} />
      </div>
    </div>
  );
}
