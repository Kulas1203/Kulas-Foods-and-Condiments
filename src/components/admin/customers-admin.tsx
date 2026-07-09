"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Pencil, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  notes: string;
  joined: string;
};

export function CustomersAdmin({ customers }: { customers: AdminCustomer[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminCustomer | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function remove(id: string) {
    if (!window.confirm("Delete this customer profile?")) return;
    setBusy(id);
    setError("");
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
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
        <p className="text-sm text-muted">{customers.length} customers</p>
        {error && <p className="text-sm text-brand-secondary">{error}</p>}
      </div>

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
                <th className="p-4">Notes</th>
                <th className="p-4 text-right">Joined</th>
                <th className="p-4 text-right">Actions</th>
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
                  <td className="max-w-[200px] truncate p-4 text-muted">
                    {c.notes || "—"}
                  </td>
                  <td className="p-4 text-right text-muted">{c.joined}</td>
                  <td className="p-4 text-right">
                    {busy === c.id ? (
                      <Loader2 className="ml-auto h-4 w-4 animate-spin text-muted" />
                    ) : (
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditing(c)}
                          className="inline-grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
                          aria-label={`Edit ${c.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(c.id)}
                          className="inline-grid h-8 w-8 place-items-center rounded-full text-brand-secondary hover:bg-brand-primary/15"
                          aria-label={`Delete ${c.name}`}
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
        </div>
      )}

      <CustomerEditModal
        customer={editing}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}

function CustomerEditModal({
  customer,
  onClose,
}: {
  customer: AdminCustomer | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [lastId, setLastId] = useState<string | null>(null);
  if (customer && customer.id !== lastId) {
    setLastId(customer.id);
    setFirstName(customer.firstName);
    setLastName(customer.lastName);
    setNotes(customer.notes);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, notes }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {customer && (
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
            aria-label="Edit customer"
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
              Edit customer
            </h3>
            <p className="mt-1 text-sm text-muted">{customer.email}</p>

            <form onSubmit={submit} className="mt-6 grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                    First name
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                    Last name
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="admin-input resize-none"
                  placeholder="e.g. repeat buyer, prefers pickup…"
                />
              </div>

              {error && <p className="text-sm text-brand-secondary">{error}</p>}

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
