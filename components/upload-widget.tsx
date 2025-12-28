'use client';

import {useState} from "react";
import {Button} from "@/components/ui/button";

const CONFIG = {
  vehicle_image: {
    accept: "image/jpeg,image/png,image/webp",
    maxBytes: 8 * 1024 * 1024,
    label: "Upload image",
  },
  certificate_pdf: {
    accept: "application/pdf",
    maxBytes: 15 * 1024 * 1024,
    label: "Upload PDF",
  },
} as const;

type UploadType = keyof typeof CONFIG;

export function UploadWidget({type, label}: {type: UploadType; label: string}) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage(null);

    const cfg = CONFIG[type];
    if (!cfg.accept.split(",").includes(file.type)) {
      setMessage("File type not allowed");
      e.target.value = "";
      return;
    }
    if (file.size > cfg.maxBytes) {
      setMessage(`File too large (max ${Math.round(cfg.maxBytes / 1024 / 1024)}MB)`);
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);
      const headers: HeadersInit = {"Content-Type": "application/json"};
      const clientSecret = process.env.NEXT_PUBLIC_UPLOAD_ROUTE_SECRET;
      if (clientSecret) headers["authorization"] = `Bearer ${clientSecret}`;

      const metaRes = await fetch("/api/uploads", {
        method: "POST",
        headers,
        body: JSON.stringify({type, fileName: file.name, fileSize: file.size, mimeType: file.type}),
      });
      const meta = await metaRes.json();
      if (!metaRes.ok || !meta.signedUrl) throw new Error(meta?.error || "No signed URL");

      const putRes = await fetch(meta.signedUrl, {
        method: "PUT",
        headers: {"Content-Type": file.type || "application/octet-stream"},
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");

      setMessage(`Uploaded: ${meta.path}`);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const cfg = CONFIG[type];

  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between text-sm text-slate-200">
        <span>{label}</span>
        <Button asChild size="sm" variant="outline" disabled={uploading}>
          <label className="cursor-pointer">
            {uploading ? "..." : cfg.label}
            <input type="file" className="hidden" accept={cfg.accept} onChange={handleFile} />
          </label>
        </Button>
      </div>
      {message && <p className="text-xs text-slate-300">{message}</p>}
    </div>
  );
}

