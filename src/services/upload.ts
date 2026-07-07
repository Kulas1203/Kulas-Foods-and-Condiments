import { createHash } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

/**
 * Media upload service.
 *
 * Uses Cloudinary (signed REST upload — no SDK dependency) when
 * CLOUDINARY_* env vars are present; otherwise falls back to saving files
 * to `public/uploads/` on the local filesystem so uploads work out of the
 * box in development and self-hosted deployments.
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryEnabled = Boolean(
  CLOUD_NAME && API_KEY && API_SECRET,
);

export const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];
export const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

export interface UploadResult {
  url: string;
  publicId: string | null;
  type: string;
  size: number;
}

/** Validates a file's type and size, throwing a friendly error if invalid. */
export function assertValidFile(file: File) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max is 8MB.`,
    );
  }
}

/** Uploads a single file and returns its public URL + metadata. */
export async function uploadFile(
  file: File,
  folder = "uploads",
): Promise<UploadResult> {
  assertValidFile(file);
  const bytes = Buffer.from(await file.arrayBuffer());

  if (isCloudinaryEnabled) {
    return uploadToCloudinary(bytes, file.type, folder);
  }
  return uploadToDisk(bytes, file, folder);
}

/** Signed Cloudinary upload via the REST API. */
async function uploadToCloudinary(
  bytes: Buffer,
  mime: string,
  folder: string,
): Promise<UploadResult> {
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `folder=kulas/${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1")
    .update(paramsToSign + API_SECRET)
    .digest("hex");

  const form = new FormData();
  form.append(
    "file",
    new Blob([new Uint8Array(bytes)], { type: mime }),
    "upload",
  );
  form.append("api_key", API_KEY!);
  form.append("timestamp", String(timestamp));
  form.append("folder", `kulas/${folder}`);
  form.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) {
    throw new Error(`Cloudinary upload failed (${res.status})`);
  }
  const data = (await res.json()) as {
    secure_url: string;
    public_id: string;
    bytes: number;
    resource_type: string;
  };

  return {
    url: data.secure_url,
    publicId: data.public_id,
    type: mime,
    size: data.bytes,
  };
}

/** Local filesystem upload — saved under public/uploads and served at /uploads. */
async function uploadToDisk(
  bytes: Buffer,
  file: File,
  folder: string,
): Promise<UploadResult> {
  const ext = extFromMime(file.type);
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const dir = path.join(process.cwd(), "public", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safeName), bytes);

  return {
    url: `/${folder}/${safeName}`,
    publicId: `${folder}/${safeName}`,
    type: file.type,
    size: bytes.length,
  };
}

/** Removes a file from Cloudinary or local disk. */
export async function removeFile(publicId: string | null) {
  if (!publicId) return;

  if (isCloudinaryEnabled) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHash("sha1")
      .update(`public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`)
      .digest("hex");
    const form = new FormData();
    form.append("public_id", publicId);
    form.append("api_key", API_KEY!);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
      { method: "POST", body: form },
    ).catch(() => {});
    return;
  }

  // Local file: publicId is "<folder>/<name>"
  await unlink(path.join(process.cwd(), "public", publicId)).catch(() => {});
}

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/avif": ".avif",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
  };
  return map[mime] ?? "";
}
