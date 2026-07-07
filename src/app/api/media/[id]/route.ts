import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ok, notFound, unauthorized, handleError } from "@/lib/api";
import { removeFile } from "@/services/upload";

type Params = { params: Promise<{ id: string }> };

// DELETE /api/media/[id] — remove a media asset (admin only)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    if (!(await requireRole(["STAFF", "ADMIN", "SUPER_ADMIN"])))
      return unauthorized();

    const { id } = await params;
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return notFound("Media not found");

    await removeFile(media.publicId);
    await prisma.media.delete({ where: { id } });

    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
