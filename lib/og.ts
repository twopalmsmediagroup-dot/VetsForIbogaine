import type { SupabaseClient } from "@supabase/supabase-js";

type StorageClient = Pick<SupabaseClient, "storage">;

const UA = "Mozilla/5.0 (compatible; VetsForIbogaineBot/1.0; +https://vetsforibogaine.org)";
const KEYS = ["og:image:secure_url", "og:image", "og:image:url", "twitter:image", "twitter:image:src"];
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

function decode(s: string) {
  return s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x2F;/gi, "/").trim();
}

/** Finds the publisher's social preview image (og:image / twitter:image) for a page. */
export async function findPreviewImage(pageUrl: string): Promise<string | null> {
  if (!/^https?:\/\//i.test(pageUrl)) return null;
  const res = await fetch(pageUrl, {
    headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml" },
    redirect: "follow", cache: "no-store", signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const html = (await res.text()).slice(0, 600_000);
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const key of KEYS) {
    for (const m of metas) {
      const prop = /(?:property|name)\s*=\s*["']([^"']+)["']/i.exec(m)?.[1]?.toLowerCase();
      if (prop !== key) continue;
      const content = /content\s*=\s*["']([^"']+)["']/i.exec(m)?.[1];
      if (content) return new URL(decode(content), res.url).toString();
    }
  }
  return null;
}

/** Downloads a page's preview image into the `media` bucket and returns its public URL. */
export async function importPreviewImage(supabase: StorageClient, pageUrl: string): Promise<string | null> {
  try {
    const imgUrl = await findPreviewImage(pageUrl);
    if (!imgUrl || !/^https?:\/\//i.test(imgUrl)) return null;
    const res = await fetch(imgUrl, { headers: { "user-agent": UA, referer: pageUrl }, cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const type = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    const ext = TYPES[type];
    if (!ext) return null;
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 1000 || buf.byteLength > 8 * 1024 * 1024) return null;
    const path = `articles/preview-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, buf, { contentType: type, cacheControl: "31536000" });
    if (error) return null;
    return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  } catch {
    return null;
  }
}
