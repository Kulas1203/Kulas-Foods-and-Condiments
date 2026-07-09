export const dynamic = "force-dynamic";

import { AdminTopbar } from "@/components/admin/topbar";
import { ReviewsAdmin, type AdminReview } from "@/components/admin/reviews-admin";
import { prisma } from "@/lib/prisma";
import { reviews as demoReviews } from "@/data/products";

async function loadReviews(): Promise<AdminReview[]> {
  try {
    const dbReviews = await prisma.review.findMany({
      orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
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
    return [];
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
    demo: true,
  }));
}

export default async function AdminReviewsPage() {
  const reviews = await loadReviews();

  return (
    <div>
      <AdminTopbar title="Reviews" />
      <div className="p-6">
        <ReviewsAdmin reviews={reviews} />
      </div>
    </div>
  );
}
