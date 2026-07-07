"use client";

import { useEffect, useRef } from "react";

/** A soft chili-flame glow that trails the cursor (desktop only). */
export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`;
      }
    };

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.12;
      ring.y += (pos.y - ring.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x - 130}px, ${ring.y - 130}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] h-[260px] w-[260px] rounded-full opacity-60 mix-blend-screen blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,90,54,0.5) 0%, rgba(193,18,31,0.25) 40%, transparent 70%)",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[61] h-2 w-2 rounded-full bg-brand-accent shadow-glow-gold"
      />
    </>
  );
}
