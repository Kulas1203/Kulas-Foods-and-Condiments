export const dynamic = "force-dynamic";

import { Star } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { prisma } from "@/lib/prisma";
import { reviews as demoReviews } from "@/data/products";

type ReviewRow = {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  approved: boolean;
  verified: boolean;
  date: string;
};

async function loadReviews(): Promise<ReviewRow[]> {
  try {
    const dbReviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    if (dbReviews.length > 0) {
      return dbReviews.map((r) => ({
        id: r.id,
        authorName: r.authorName,
        rating: r.rating,
        title: r.title ?? "",
        body: r.body,
        approved: r.approved,
        verified: r.verified,
        date: r.createdAt.toISOString().slice(0, 10),
      }));
    }
  } catch {
    /* fall back to demo */
  }
  return demoReviews.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    title: r.title ?? "",
    body: r.body,
    approved: true,
    verified: r.verified,
    date: r.date,
  }));
}

export default async function AdminReviewsPage() {
  const reviews = await loadReviews();

  return (
    <div>
      <AdminTopbar title="Reviews" />
      <div className="space-y-4 p-6">
        <p className="text-sm text-muted">{reviews.length} reviews</p>

        <div className="grid gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-3xl border border-white/10 bg-surface/50 p-5 backdrop-blur-xl"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold">
                      {r.authorName}
                    </span>
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
                <span
                  className={
                    r.approved
                      ? "rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-400"
                      : "rounded-full bg-brand-accent/15 px-2.5 py-1 text-xs font-semibold text-brand-accent"
                  }
                >
                  {r.approved ? "Approved" : "Pending"}
                </span>
              </div>
              {r.title && <p className="mt-3 font-semibold">{r.title}</p>}
              <p className="mt-1 text-sm text-muted">{r.body}</p>
              <p className="mt-3 text-xs text-muted">{r.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
