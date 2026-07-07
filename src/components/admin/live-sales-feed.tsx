"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, ShoppingBag, PackageMinus, Zap } from "lucide-react";
import { useEventSource, type ConnectionState } from "@/hooks/use-event-source";
import { formatPrice, cn } from "@/lib/utils";

interface FeedItem {
  id: string;
  kind: "order" | "inventory";
  title: string;
  subtitle: string;
  amount?: number;
  at: string;
}

export function LiveSalesFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [liveRevenue, setLiveRevenue] = useState(0);
  const [liveOrders, setLiveOrders] = useState(0);

  const onEvent = useCallback((type: string, data: unknown) => {
    const now = new Date().toISOString();
    if (type === "order.created") {
      const d = data as {
        orderNumber: string;
        total: number;
        itemCount: number;
      };
      setLiveRevenue((r) => r + d.total);
      setLiveOrders((n) => n + 1);
      setItems((prev) =>
        [
          {
            id: `${d.orderNumber}-${now}`,
            kind: "order" as const,
            title: `New order ${d.orderNumber}`,
            subtitle: `${d.itemCount} item${d.itemCount > 1 ? "s" : ""}`,
            amount: d.total,
            at: now,
          },
          ...prev,
        ].slice(0, 12),
      );
    } else if (type === "inventory.updated") {
      const d = data as { sku: string; quantity: number; lowStock: boolean };
      setItems((prev) =>
        [
          {
            id: `${d.sku}-${now}`,
            kind: "inventory" as const,
            title: `Stock updated · ${d.sku}`,
            subtitle: d.lowStock
              ? `⚠ Low stock — ${d.quantity} left`
              : `${d.quantity} in stock`,
            at: now,
          },
          ...prev,
        ].slice(0, 12),
      );
    }
  }, []);

  const state = useEventSource(
    "/api/admin/live",
    ["order.created", "inventory.updated"],
    onEvent,
  );

  async function emitTest() {
    await fetch("/api/admin/live", { method: "POST" }).catch(() => {});
  }

  return (
    <div className="rounded-4xl border border-white/10 bg-surface/50 p-6 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-lg font-bold">Live Sales</h2>
          <ConnectionDot state={state} />
        </div>
        <button
          onClick={emitTest}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-brand-secondary transition-colors hover:bg-white/10"
        >
          <Zap className="h-3.5 w-3.5" /> Emit test event
        </button>
      </div>

      {/* Live counters */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-widest text-muted">
            Revenue (session)
          </p>
          <p className="mt-1 font-heading text-2xl font-extrabold text-gradient">
            {formatPrice(liveRevenue)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-widest text-muted">
            Orders (session)
          </p>
          <p className="mt-1 font-heading text-2xl font-extrabold">
            {liveOrders}
          </p>
        </div>
      </div>

      {/* Feed */}
      <div className="max-h-72 space-y-2 overflow-y-auto no-scrollbar">
        {items.length === 0 ? (
          <div className="grid place-items-center py-10 text-center text-sm text-muted">
            <Radio className="mb-2 h-6 w-6 animate-pulse-glow text-brand-secondary" />
            Listening for live orders in real time…
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
              >
                <div
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                    item.kind === "order"
                      ? "bg-brand-gradient shadow-glow"
                      : "bg-white/10",
                  )}
                >
                  {item.kind === "order" ? (
                    <ShoppingBag className="h-4 w-4 text-white" />
                  ) : (
                    <PackageMinus className="h-4 w-4 text-brand-secondary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="truncate text-xs text-muted">{item.subtitle}</p>
                </div>
                {item.amount != null && (
                  <span className="text-sm font-bold text-brand-accent">
                    {formatPrice(item.amount)}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function ConnectionDot({ state }: { state: ConnectionState }) {
  const map = {
    open: { color: "bg-green-400", label: "Live" },
    connecting: { color: "bg-brand-accent", label: "Connecting" },
    closed: { color: "bg-muted", label: "Offline" },
  }[state];
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted">
      <span className={cn("h-2 w-2 rounded-full", map.color, state === "open" && "animate-pulse")} />
      {map.label}
    </span>
  );
}
