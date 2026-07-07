import { EventEmitter } from "node:events";

/**
 * In-process event bus for real-time server → client push.
 *
 * Powers the admin live-sales feed and real-time inventory updates via
 * Server-Sent Events (see /api/admin/live). A single emitter is cached on
 * globalThis so it survives Next.js dev hot-reloads and is shared across all
 * route handlers within one Node server process (the production deploy model —
 * `node server.js` / Docker).
 *
 * SSE is used rather than raw WebSockets because it works inside Next.js App
 * Router route handlers with no custom server, auto-reconnects, and is the
 * right transport for one-way server → client streaming like a sales ticker.
 */

export type LiveEvent =
  | {
      type: "order.created";
      orderNumber: string;
      email: string;
      total: number;
      itemCount: number;
      at: string;
    }
  | {
      type: "inventory.updated";
      productId: string;
      sku: string;
      quantity: number;
      lowStock: boolean;
      at: string;
    };

const globalForBus = globalThis as unknown as { kulasBus?: EventEmitter };

const bus =
  globalForBus.kulasBus ??
  (() => {
    const e = new EventEmitter();
    e.setMaxListeners(0); // many concurrent SSE subscribers
    return e;
  })();

if (process.env.NODE_ENV !== "production") globalForBus.kulasBus = bus;

const CHANNEL = "live";

/** Publish an event to every connected SSE subscriber. */
export function publish(event: LiveEvent) {
  bus.emit(CHANNEL, event);
}

/** Subscribe to live events. Returns an unsubscribe function. */
export function subscribe(listener: (event: LiveEvent) => void) {
  bus.on(CHANNEL, listener);
  return () => bus.off(CHANNEL, listener);
}
