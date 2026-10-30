"use client";
import { useRef, useState } from "react";
import { browserClient } from "@/lib/supabase/browser";

/** Multi-photo uploader. Each URL is submitted as a repeated hidden input with the same name. */
export default function GalleryUpload({ name, defaultValue, folder = "gallery" }: { name: string; defaultValue?: string[] | null; folder?: string }) {
  const [urls, setUrls] = useState<string[]>(defaultValue ?? []);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function onFiles(files: FileList) {
    setErr("");
    const sb = browserClient();
    const list = Array.from(files);
    setBusy(list.length);
    for (const file of list) {
      if (file.size > 10 * 1024 * 1024) { setErr(`${file.name} is over 10 MB and was skipped.`); setBusy((b) => b - 1); continue; }
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await sb.storage.from("media").upload(path, file, { cacheControl: "31536000", contentType: file.type });
      if (error) setErr("Upload failed: " + error.message);
      else { const url = sb.storage.from("media").getPublicUrl(path).data.publicUrl; setUrls((u) => [...u, url]); }
      setBusy((b) => b - 1);
    }
  }

  const move = (i: number, d: -1 | 1) => setUrls((u) => {
    const j = i + d; if (j < 0 || j >= u.length) return u;
    const n = [...u]; [n[i], n[j]] = [n[j], n[i]]; return n;
  });

  return (
    <div className="rounded border border-dashed border-slate-300 bg-slate-50 p-4">
      {urls.map((u) => <input key={u} type="hidden" name={name} value={u} />)}
      {urls.length > 0 && (
        <ul className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {urls.map((u, i) => (
            <li key={u} className="overflow-hidden rounded bg-white ring-1 ring-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="aspect-square w-full object-cover" />
              <div className="flex items-center justify-between px-1.5 py-1 text-sm">
                <span className="flex">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier" className="rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-30">←</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === urls.length - 1} aria-label="Move later" className="rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-30">→</button>
                </span>
                <button type="button" onClick={() => setUrls((x) => x.filter((y) => y !== u))} className="rounded px-2 py-1 font-medium text-red-700 hover:bg-red-50">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={() => input.current?.click()} disabled={busy > 0} className="rounded bg-white px-4 py-2.5 text-sm font-medium ring-1 ring-slate-300 hover:bg-slate-100 disabled:opacity-60">
        {busy > 0 ? `Uploading ${busy}…` : urls.length ? "Add more photos" : "Upload photos"}
      </button>
      <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
        onChange={(e) => { if (e.target.files?.length) onFiles(e.target.files); e.target.value = ""; }} />
      {err && <p className="mt-2 text-sm text-red-700">{err}</p>}
      <p className="mt-2 text-xs text-slate-500">Select several photos at once. Use the arrows to reorder. Remember to click Save.</p>
    </div>
  );
}
