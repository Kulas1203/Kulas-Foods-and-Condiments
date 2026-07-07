export const dynamic = "force-dynamic";

import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { SalesChart } from "@/components/admin/sales-chart";
import { LiveSalesFeed } from "@/components/admin/live-sales-feed";
import { getDashboardStats } from "@/services/dashboard";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.revenue),
      icon: DollarSign,
      trend: "+18.2%",
    },
    {
      label: "Orders",
      value: stats.orders.toLocaleString(),
      icon: ShoppingCart,
      trend: "+9.4%",
    },
    {
      label: "Customers",
      value: stats.customers.toLocaleString(),
      icon: Users,
      trend: "+12.1%",
    },
    {
      label: "Products",
      value: stats.products.toString(),
      icon: Package,
      trend: `${stats.lowStock} low stock`,
    },
  ];

  return (
    <div>
      <AdminTopbar title="Dashboard" />
      <div className="space-y-6 p-6">
        {stats.usingDemoData && (
          <div className="flex items-center gap-2 rounded-2xl border border-brand-accent/30 bg-brand-accent/10 px-4 py-3 text-sm text-brand-accent">
            <AlertTriangle className="h-4 w-4" />
            Showing demo analytics — run <code className="mx-1">npm run db:seed</code>{" "}
            to load live data from Postgres.
          </div>
        )}

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-4xl border border-white/10 bg-surface/50 p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient shadow-glow">
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-brand-secondary">
                  <TrendingUp className="h-3 w-3" />
                  {card.trend}
                </span>
              </div>
              <p className="mt-4 font-heading text-2xl font-extrabold">
                {card.value}
              </p>
              <p className="text-sm text-muted">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Sales chart */}
          <div className="rounded-4xl border border-white/10 bg-surface/50 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold">Sales Overview</h2>
              <span className="text-xs text-muted">Last 7 months</span>
            </div>
            <SalesChart data={stats.salesSeries} />
          </div>

          {/* Real-time sales feed (SSE) */}
          <LiveSalesFeed />
        </div>

        {/* Top products */}
        <div className="rounded-4xl border border-white/10 bg-surface/50 p-6 backdrop-blur-xl">
          <h2 className="mb-4 font-heading text-lg font-bold">Top Products</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.topProducts.map((p, i) => (
              <div
                key={p.name}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/5 font-heading text-sm font-bold text-brand-accent">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted">
                    {p.sold} sold · {formatPrice(p.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="rounded-4xl border border-white/10 bg-surface/50 p-6 backdrop-blur-xl">
          <h2 className="mb-4 font-heading text-lg font-bold">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-widest text-muted">
                <tr>
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Total</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentOrders.map((o) => (
                  <tr key={o.orderNumber}>
                    <td className="py-3 font-mono text-xs">{o.orderNumber}</td>
                    <td className="py-3 text-muted">{o.email}</td>
                    <td className="py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="py-3 text-right font-semibold">
                      {formatPrice(o.total)}
                    </td>
                    <td className="py-3 text-right text-muted">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID: "bg-brand-accent/15 text-brand-accent",
    SHIPPED: "bg-blue-500/15 text-blue-400",
    PROCESSING: "bg-brand-secondary/15 text-brand-secondary",
    DELIVERED: "bg-green-500/15 text-green-400",
    PENDING: "bg-white/10 text-muted",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        map[status] ?? "bg-white/10 text-muted"
      }`}
    >
      {status}
    </span>
  );
}