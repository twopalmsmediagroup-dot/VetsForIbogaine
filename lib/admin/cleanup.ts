import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_AGE_MS = 48 * 60 * 60 * 1000;

/**
 * Story photos upload as soon as a visitor picks one, before the form is sent. Removes photos older
 * than 48h that no inquiry points to (abandoned forms or spam). Runs with the staff session; never throws.
 */
export async function removeOrphanStoryPhotos(sb: SupabaseClient) {
  try {
    const { data: files } = await sb.storage.from("submissions").list("stories", { limit: 1000, sortBy: { column: "created_at", order: "asc" } });
    const cutoff = Date.now() - MAX_AGE_MS;
    const old = (files ?? []).filter((f) => f.id && f.created_at && Date.parse(f.created_at) < cutoff).map((f) => `stories/${f.name}`);
    if (!old.length) return;
    const { data: used } = await sb.from("inquiries").select("photo_path").in("photo_path", old);
    const keep = new Set((used ?? []).map((u) => u.photo_path));
    const orphans = old.filter((p) => !keep.has(p));
    if (orphans.length) await sb.storage.from("submissions").remove(orphans);
  } catch (err) {
    console.error("[cleanup] story photos", err);
  }
}
