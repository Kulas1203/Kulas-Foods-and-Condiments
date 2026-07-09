import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ok, created, badRequest, unauthorized, handleError } from "@/lib/api";
import { uploadFile, assertValidFile } from "@/services/upload";

// GET /api/media — list uploaded media (admin only).
// publicId is excluded: database-stored images keep their payload there.
export async function GET() {
  try {
    if (!(await requireRole(["STAFF", "ADMIN", "SUPER_ADMIN"])))
      return unauthorized();

    const media = await prisma.media.findMany({
      select: {
        id: true,
        url: true,
        alt: true,
        type: true,
        size: true,
        folder: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return ok(media);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/media — multipart upload of one or more files (admin only)
export async function POST(req: NextRequest) {
  try {
    if (!(await requireRole(["STAFF", "ADMIN", "SUPER_ADMIN"])))
      return unauthorized();

    const form = await req.formData();
    const files = form.getAll("files").filter((f): f is File => f instanceof File);
    const folder = (form.get("folder") as string) || "uploads";
    const alt = (form.get("alt") as string) || null;

    if (files.length === 0) return badRequest("No files provided");

    const results = await Promise.all(
      files.map(async (file) => {
        assertValidFile(file); // validation errors must not fall into the DB path
        try {
          const uploaded = await uploadFile(file, folder);
          return await prisma.media.create({
            data: {
              url: uploaded.url,
              publicId: uploaded.publicId,
              alt,
              type: uploaded.type,
              size: uploaded.size,
              folder,
            },
          });
        } catch {
          // Serverless hosts (Vercel) have a read-only filesystem, so
          // without Cloudinary we persist the image bytes in Postgres and
          // serve them from /api/media/[id]/raw.
          const bytes = Buffer.from(await file.arrayBuffer());
          const record = await prisma.media.create({
            data: {
              url: "pending",
              publicId: `db:${file.type};base64,${bytes.toString("base64")}`,
              alt,
              type: file.type,
              size: bytes.length,
              folder,
            },
          });
          return await prisma.media.update({
            where: { id: record.id },
            data: { url: `/api/media/${record.id}/raw` },
          });
        }
      }),
    );

    // Strip payloads from the response.
    return created(
      results.map(({ publicId: _publicId, ...rest }) => rest),
    );
  } catch (error) {
    return handleError(error);
  }
}
