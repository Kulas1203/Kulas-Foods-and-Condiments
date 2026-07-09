"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Check, Trash2, Loader2, Undo2 } from "lucide-react";

export type AdminReview = {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  approved: boolean;
  verified: boolean;
  date: string;
  demo?: boolean;
};

export function ReviewsAdmin({ reviews }: { reviews: AdminReview[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const demo = reviews.some((r) => r.demo);
  const pending = reviews.filter((r) => !r.approved).length;

  async function setApproved(id: string, approved: boolean) {
    setBusy(id);
    setError("");
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Update failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this review permanently?")) return;
    setBusy(id);
    setError("");
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          {reviews.length} reviews
          {pending > 0 && (
            <span className="ml-2 rounded-full bg-brand-accent/15 px-2.5 py-1 text-xs font-semibold text-brand-accent">
              {pending} awaiting approval
            </span>
          )}
          {demo && " · demo data (connect a database to moderate reviews)"}
        </p>
        {error && <p className="text-sm text-brand-secondary">{error}</p>}
      </div>

      <div className="grid gap-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-3xl border border-white/10 bg-surface/50 p-5 backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold">{r.authorName}</span>
                  {r.verified && (
                    <span className="rounded-full bg-brand-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-secondary">
                      Verified
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < r.rating
                          ? "h-4 w-4 fill-brand-accent text-brand-accent"
                          : "h-4 w-4 text-white/20"
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={
                    r.approved
                      ? "rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-400"
                      : "rounded-full bg-brand-accent/15 px-2.5 py-1 text-xs font-semibold text-brand-accent"
                  }
                >
                  {r.approved ? "Approved" : "Pending"}
                </span>
                {busy === r.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted" />
                ) : (
                  !demo && (
                    <>
                      {r.approved ? (
                        <button
                          onClick={() => setApproved(r.id, false)}
                          title="Unpublish"
                          className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-muted hover:text-white"
                        >
                          <Undo2 className="h-3.5 w-3.5" /> Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => setApproved(r.id, true)}
                          title="Approve"
                          className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400 hover:bg-green-500/25"
                        >
                          <Check className="h-3.5 w-3.5" /> Approve
                        </button>
                      )}
                      <button
                        onClick={() => remove(r.id)}
                        title="Delete"
                        className="inline-flex items-center gap-1 rounded-full bg-brand-primary/15 px-3 py-1 text-xs font-semibold text-brand-secondary hover:bg-brand-primary/25"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </>
                  )
                )}
              </div>
            </div>

            {r.title && <p className="mt-3 font-semibold">{r.title}</p>}
            <p className="mt-1 text-sm text-muted">{r.body}</p>
            <p className="mt-3 text-xs text-muted">{r.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
