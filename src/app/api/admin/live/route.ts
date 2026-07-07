import type { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { unauthorized } from "@/lib/api";
import { subscribe, publish, type LiveEvent } from "@/services/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/live — Server-Sent Events stream of live sales + inventory.
// Admin-guarded; the browser's EventSource sends the session cookie automatically.
export async function GET(req: NextRequest) {
  if (!(await requireRole(["STAFF", "ADMIN", "SUPER_ADMIN"])))
    return unauthorized();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown, event?: string) => {
        try {
          if (event) controller.enqueue(encoder.encode(`event: ${event}\n`));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          /* controller closed */
        }
      };

      // Initial hello so the client can flip to "connected" immediately.
      send({ ok: true, at: new Date().toISOString() }, "ready");

      const unsubscribe = subscribe((e: LiveEvent) => send(e, e.type));

      // Heartbeat keeps proxies from closing an idle connection.
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          /* closed */
        }
      }, 25_000);

      const close = () => {
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      req.signal.addEventListener("abort", close);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

// POST /api/admin/live — emit a synthetic event (demo / manual test of the feed).
export async function POST() {
  if (!(await requireRole(["STAFF", "ADMIN", "SUPER_ADMIN"])))
    return unauthorized();

  const demo: LiveEvent = {
    type: "order.created",
    orderNumber: `KLS-DEMO-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    email: "guest@kulasfoods.com",
    total: 189 + Math.floor(Math.random() * 600),
    itemCount: 1 + Math.floor(Math.random() * 3),
    at: new Date().toISOString(),
  };
  publish(demo);
  return Response.json({ success: true, data: demo });
}
