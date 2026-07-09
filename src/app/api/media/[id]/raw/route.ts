import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/media/[id]/raw — serves image bytes for media stored in the
 * database (used on serverless hosts without Cloudinary). Public: these are
 * storefront product images.
 */
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const media = await prisma.media.findUnique({
    where: { id },
    select: { publicId: true, url: true, type: true },
  });

  if (!media) return new NextResponse("Not found", { status: 404 });

  // Database-stored payload: "db:<mime>;base64,<data>"
  if (media.publicId?.startsWith("db:")) {
    const comma = media.publicId.indexOf(",");
    const base64 = media.publicId.slice(comma + 1);
    const bytes = Buffer.from(base64, "base64");
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": media.type || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // Otherwise the asset lives elsewhere (Cloudinary/local) — redirect.
  return NextResponse.redirect(new URL(media.url, req.url));
}
