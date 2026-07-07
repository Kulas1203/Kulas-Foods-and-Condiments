"use client";

import { useEffect, useRef, useState } from "react";

export type ConnectionState = "connecting" | "open" | "closed";

/**
 * Subscribes to a Server-Sent Events endpoint and invokes `onEvent` for each
 * named event. Auto-reconnects (EventSource does this natively) and reports
 * connection state for UI indicators.
 */
export function useEventSource(
  url: string,
  eventTypes: string[],
  onEvent: (type: string, data: unknown) => void,
) {
  const [state, setState] = useState<ConnectionState>("connecting");
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;

  useEffect(() => {
    const es = new EventSource(url, { withCredentials: true });

    es.onopen = () => setState("open");
    es.onerror = () => setState("connecting"); // browser retries automatically

    const listeners = eventTypes.map((type) => {
      const listener = (e: MessageEvent) => {
        try {
          handlerRef.current(type, JSON.parse(e.data));
        } catch {
          /* ignore malformed frame */
        }
      };
      es.addEventListener(type, listener);
      return { type, listener };
    });

    return () => {
      listeners.forEach(({ type, listener }) =>
        es.removeEventListener(type, listener),
      );
      es.close();
      setState("closed");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, eventTypes.join(",")]);

  return state;
}
