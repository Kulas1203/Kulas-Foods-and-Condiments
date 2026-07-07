import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  revenue: number;
  orders: number;
  customers: number;
  products: number;
  lowStock: number;
  salesSeries: { month: string; revenue: number; orders: number }[];
  topProducts: { name: string; sold: number; revenue: number }[];
  recentOrders: {
    orderNumber: string;
    email: string;
    total: number;
    status: string;
    date: string;
  }[];
  usingDemoData: boolean;
}

const demoStats: DashboardStats = {
  revenue: 284_600,
  orders: 1_506,
  customers: 892,
  products: 3,
  lowStock: 1,
  salesSeries: [
    { month: "Jan", revenue: 18200, orders: 96 },
    { month: "Feb", revenue: 22400, orders: 118 },
    { month: "Mar", revenue: 26800, orders: 142 },
    { month: "Apr", revenue: 24100, orders: 128 },
    { month: "May", revenue: 31500, orders: 167 },
    { month: "Jun", revenue: 38900, orders: 205 },
    { month: "Jul", revenue: 42700, orders: 226 },
  ],
  topProducts: [
    { name: "Kulas Chili Garlic Sauce", sold: 1204, revenue: 227_556 },
    { name: "Kulas Spicy Vinegar", sold: 186, revenue: 27_714 },
    { name: "Kulas Garlic Crunch", sold: 116, revenue: 23_084 },
  ],
  recentOrders: [
    {
      orderNumber: "KLS-8F2K-A1C4",
      email: "maria@example.com",
      total: 498,
      status: "PAID",
      date: "2026-07-06",
    },
    {
      orderNumber: "KLS-7D1J-B9X2",
      email: "john@example.com",
      total: 189,
      status: "SHIPPED",
      date: "2026-07-06",
    },
    {
      orderNumber: "KLS-6C0H-C3M7",
      email: "grace@example.com",
      total: 756,
      status: "PROCESSING",
      date: "2026-07-05",
    },
    {
      orderNumber: "KLS-5B9G-D5P1",
      email: "paolo@example.com",
      total: 378,
      status: "DELIVERED",
      date: "2026-07-05",
    },
  ],
  usingDemoData: true,
};

/**
 * Returns live dashboard metrics from Postgres. If the database is
 * unavailable (e.g. before `db:push`), gracefully falls back to demo data
 * so the dashboard always renders.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [revenueAgg, orders, customers, products, lowStock, recent] =
      await Promise.all([
        prisma.order.aggregate({
          _sum: { total: true },
          where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
        }),
        prisma.order.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.product.count(),
        prisma.inventory.count({ where: { quantity: { lte: 10 } } }),
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    if (products === 0) return demoStats;

    return {
      ...demoStats,
      revenue: Number(revenueAgg._sum.total ?? 0),
      orders,
      customers,
      products,
      lowStock,
      recentOrders: recent.map((o) => ({
        orderNumber: o.orderNumber,
        email: o.email,
        total: Number(o.total),
        status: o.status,
        date: o.createdAt.toISOString().slice(0, 10),
      })),
      usingDemoData: false,
    };
  } catch {
    return demoStats;
  }
}
