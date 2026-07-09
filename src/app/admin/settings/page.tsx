export const dynamic = "force-dynamic";

import { Mail, Phone, MapPin, Facebook, Check, X } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { siteConfig, paymentMethods } from "@/data/site";

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-white/90">{label}</span>
      <span
        className={
          ok
            ? "inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-400"
            : "inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-muted"
        }
      >
        {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
        {ok ? "Configured" : "Not set"}
      </span>
    </div>
  );
}

export default function AdminSettingsPage() {
  const integrations = [
    { label: "Database (Postgres)", ok: Boolean(process.env.DATABASE_URL) },
    { label: "Email — Resend", ok: Boolean(process.env.RESEND_API_KEY) },
    {
      label: "AI Chef — Gemini",
      ok: Boolean(process.env.GEMINI_API_KEY),
    },
    { label: "AI Chef — Anthropic", ok: Boolean(process.env.ANTHROPIC_API_KEY) },
    ...Object.values(paymentMethods).map((m) => ({
      label: `Payments — ${m.label}`,
      ok: Boolean(m.accountNumber),
    })),
    { label: "Payments — Stripe (cards)", ok: Boolean(process.env.STRIPE_SECRET_KEY) },
    {
      label: "Media — Cloudinary",
      ok: Boolean(process.env.CLOUDINARY_URL || process.env.CLOUDINARY_API_KEY),
    },
  ];

  const contact = [
    { icon: Mail, label: "Email", value: siteConfig.email },
    { icon: Phone, label: "Phone", value: siteConfig.phone },
    { icon: MapPin, label: "Address", value: siteConfig.address },
    { icon: Facebook, label: "Facebook", value: siteConfig.socials.facebook },
  ];

  return (
    <div>
      <AdminTopbar title="Settings" />
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        {/* Business details */}
        <div className="rounded-4xl border border-white/10 bg-surface/50 p-6 backdrop-blur-xl">
          <h2 className="font-heading text-lg font-bold">Business Details</h2>
          <p className="mt-1 text-sm text-muted">
            Shown across the storefront, footer, and contact page.
          </p>
          <div className="mt-5 space-y-4">
            {contact.map((c) => (
              <div key={c.label} className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5">
                  <c.icon className="h-4 w-4 text-brand-secondary" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-muted">
                    {c.label}
                  </p>
                  <p className="truncate text-sm text-white/90">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs text-muted">
            To edit these, update{" "}
            <code className="text-brand-accent">src/data/site.ts</code> and
            redeploy.
          </p>
        </div>

        {/* Integrations status */}
        <div className="rounded-4xl border border-white/10 bg-surface/50 p-6 backdrop-blur-xl">
          <h2 className="font-heading text-lg font-bold">Integrations</h2>
          <p className="mt-1 text-sm text-muted">
            Live status of optional services, read from environment variables.
          </p>
          <div className="mt-4 divide-y divide-white/5">
            {integrations.map((i) => (
              <StatusRow key={i.label} label={i.label} ok={i.ok} />
            ))}
          </div>
          <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs text-muted">
            Add or update keys in your Vercel project&apos;s Environment
            Variables, then redeploy for changes to take effect.
          </p>
        </div>
      </div>
    </div>
  );
}
