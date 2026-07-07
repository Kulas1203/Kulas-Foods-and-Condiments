"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Star,
  BookOpen,
  ImageIcon,
  Settings,
  Flame,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Recipes", href: "/admin/recipes", icon: BookOpen },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-surface/40 p-5 backdrop-blur-xl lg:flex">
      <Link href="/admin" className="mb-8 flex items-center gap-2.5">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-gradient shadow-glow">
          <Flame className="h-5 w-5 text-white" />
        </span>
        <div>
          <p className="font-heading text-sm font-extrabold leading-none">Kulas</p>
          <p className="text-[10px] uppercase tracking-widest text-muted">
            Admin
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-gradient text-white shadow-glow"
                  : "text-muted hover:bg-white/5 hover:text-white",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="mt-4 rounded-2xl border border-white/10 px-4 py-2.5 text-center text-xs text-muted hover:text-white"
      >
        ← Back to store
      </Link>
    </aside>
  );
}
