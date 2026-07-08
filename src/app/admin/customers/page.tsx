export const dynamic = "force-dynamic";

import { Users } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { prisma } from "@/lib/prisma";

async function loadCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return customers.map((c) => ({
      id: c.id,
      name:
        [c.firstName, c.lastName].filter(Boolean).join(" ") ||
        c.user?.name ||
        "—",
      email: c.user?.email ?? "—",
      joined: c.createdAt.toISOString().slice(0, 10),
    }));
  } catch {
    return [];
  }
}

export default async function AdminCustomersPage() {
  const customers = await loadCustomers();

  return (
    <div>
      <AdminTopbar title="Customers" />
      <div className="space-y-6 p-6">
        <p className="text-sm text-muted">{customers.length} customers</p>

        {customers.length === 0 ? (
          <div className="grid place-items-center rounded-4xl border border-white/10 bg-surface/50 p-16 text-center backdrop-blur-xl">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/5">
              <Users className="h-6 w-6 text-muted" />
            </div>
            <h3 className="font-heading text-lg font-bold">No customers yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted">
              Customer accounts appear here as soon as shoppers register and
              place their first orders.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-4xl border border-white/10 bg-surface/50 backdrop-blur-xl">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-widest text-muted">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-xs font-bold uppercase text-white">
                          {c.name.slice(0, 1)}
                        </span>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted">{c.email}</td>
                    <td className="p-4 text-right text-muted">{c.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
