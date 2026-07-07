import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ok, created, badRequest, unauthorized, handleError } from "@/lib/api";
import { uploadFile } from "@/services/upload";

// GET /api/media — list uploaded media (admin only)
export async function GET() {
  try {
    if (!(await requireRole(["STAFF", "ADMIN", "SUPER_ADMIN"])))
      return unauthorized();

    const media = await prisma.media.findMany({
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
        const uploaded = await uploadFile(file, folder);
        return prisma.media.create({
          data: {
            url: uploaded.url,
            publicId: uploaded.publicId,
            alt,
            type: uploaded.type,
            size: uploaded.size,
            folder,
          },
        });
      }),
    );

    return created(results);
  } catch (error) {
    return handleError(error);
  }
}
