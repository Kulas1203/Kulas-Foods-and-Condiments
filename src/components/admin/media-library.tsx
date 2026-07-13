"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  UploadCloud,
  Trash2,
  Copy,
  Check,
  Loader2,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  url: string;
  alt: string | null;
  type: string;
  size: number | null;
  folder: string | null;
  createdAt: string;
}

const MAX_SIZE = 8 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml";

export function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/media");
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upload = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      // Client-side guardrails before hitting the network.
      const tooBig = files.find((f) => f.size > MAX_SIZE);
      if (tooBig) {
        setError(`"${tooBig.name}" exceeds the 8MB limit.`);
        return;
      }

      setError("");
      setUploading(true);
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      try {
        const res = await fetch("/api/media", { method: "POST", body: form });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Upload failed");
        setItems((prev) => [...json.data, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  // Paste-to-upload support.
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const files = Array.from(e.clipboardData?.files ?? []);
      if (files.length) upload(files);
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [upload]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) upload(e.dataTransfer.files);
  }

  async function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/media/${id}`, { method: "DELETE" }).catch(() => {});
  }

  async function copyUrl(url: string) {
    const full =
      typeof window !== "undefined" ? window.location.origin + url : url;
    await navigator.clipboard.writeText(full).catch(() => {});
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
        }
        className={cn(
          "group relative grid cursor-pointer place-items-center rounded-4xl border-2 border-dashed p-12 text-center transition-colors",
          dragging
            ? "border-brand-secondary bg-brand-primary/10"
            : "border-white/15 bg-surface/40 hover:border-brand-secondary/50 hover:bg-white/[0.03]",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
        <motion.div
          animate={{ y: dragging ? -6 : [0, -8, 0] }}
          transition={
            dragging
              ? { duration: 0.2 }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
          className="grid h-16 w-16 place-items-center rounded-3xl bg-brand-gradient shadow-glow"
        >
          {uploading ? (
            <Loader2 className="h-7 w-7 animate-spin text-white" />
          ) : (
            <UploadCloud className="h-7 w-7 text-white" />
          )}
        </motion.div>
        <p className="mt-5 font-heading text-lg font-bold">
          {uploading
            ? "Uploading…"
            : dragging
              ? "Drop to upload"
              : "Drag & drop images here"}
        </p>
        <p className="mt-1 text-sm text-muted">
          or click to browse · paste from clipboard · JPG, PNG, WEBP, SVG up to 8MB
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-brand-primary/40 bg-brand-primary/10 px-4 py-3 text-sm text-brand-secondary">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-3xl shimmer" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="grid place-items-center rounded-4xl border border-white/10 bg-surface/40 py-16 text-center">
          <ImageIcon className="h-10 w-10 text-muted" />
          <p className="mt-3 text-muted">No media yet. Upload your first image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-black/40"
              >
                <Image
                  src={item.url}
                  alt={item.alt ?? "Media asset"}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-contain p-2"
                />
                <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="truncate text-[11px] text-white/70">
                    {formatSize(item.size)}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => copyUrl(item.url)}
                      aria-label="Copy URL"
                      className="grid h-8 w-8 place-items-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20"
                    >
                      {copied === item.url ? (
                        <Check className="h-3.5 w-3.5 text-brand-accent" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      aria-label="Delete"
                      className="grid h-8 w-8 place-items-center rounded-full bg-white/10 backdrop-blur hover:bg-brand-primary/60"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
