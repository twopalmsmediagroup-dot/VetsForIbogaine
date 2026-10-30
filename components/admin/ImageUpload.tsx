"use client";
import { useRef, useState } from "react";
import { browserClient } from "@/lib/supabase/browser";

export default function ImageUpload({ name, defaultValue, folder = "uploads" }: { name: string; defaultValue?: string | null; folder?: string }) {
  const [url, setUrl] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function onFile(file: File) {
    setErr("");
    if (file.size > 10 * 1024 * 1024) return setErr("Please choose an image under 10 MB.");
    setBusy(true);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const sb = browserClient();
    const { error } = await sb.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
    setBusy(false);
    if (error) return setErr("Upload failed: " + error.message);
    setUrl(sb.storage.from("media").getPublicUrl(path).data.publicUrl);
  }

  return (
    <div className="rounded border border-dashed border-slate-300 bg-slate-50 p-4">
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="h-28 w-44 rounded object-cover ring-1 ring-slate-200" />
          <div className="flex gap-2">
            <button type="button" onClick={() => input.current?.click()} className="rounded bg-white px-3 py-2 text-sm font-medium ring-1 ring-slate-300 hover:bg-slate-100">Replace</button>
            <button type="button" onClick={() => setUrl("")} className="rounded px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50">Remove</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className="rounded bg-white px-4 py-2.5 text-sm font-medium ring-1 ring-slate-300 hover:bg-slate-100 disabled:opacity-60">
          {busy ? "Uploading…" : "Upload image"}
        </button>
      )}
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
      {busy && url && <p className="mt-2 text-xs text-slate-500">Uploading…</p>}
      {err && <p className="mt-2 text-sm text-red-700">{err}</p>}
      <p className="mt-2 text-xs text-slate-500">JPG, PNG or WebP. Landscape photos at least 1600px wide look best. Remember to click Save.</p>
    </div>
  );
}
