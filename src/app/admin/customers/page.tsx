export const dynamic = "force-dynamic";

import { AdminTopbar } from "@/components/admin/topbar";
import {
  CustomersAdmin,
  type AdminCustomer,
} from "@/components/admin/customers-admin";
import { prisma } from "@/lib/prisma";

async function loadCustomers(): Promise<AdminCustomer[]> {
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
      firstName: c.firstName ?? "",
      lastName: c.lastName ?? "",
      notes: c.notes ?? "",
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
      <div className="p-6">
        <CustomersAdmin customers={customers} />
      </div>
    </div>
  );
}
