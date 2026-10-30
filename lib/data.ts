import { cache } from "react";
import { draftMode } from "next/headers";
import { publicClient } from "./supabase/public";
import { serverClient } from "./supabase/server";
import type { Article, Organization, Page, Resource, Settings, TimelineEntry, VeteranStory } from "./types";

export const getSettings = cache(async (): Promise<Settings> => {
  const { data } = await publicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  return (data ?? {}) as Settings;
});

/**
 * Content reads. In preview (draft mode, switched on from the dashboard) they use the signed-in
 * session, so RLS also returns drafts to staff — and still only published rows to anyone else.
 */
const reader = cache(async () => {
  const preview = (await draftMode()).isEnabled;
  return {
    db: preview ? await serverClient() : publicClient(),
    statuses: preview ? ["draft", "published"] : ["published"],
    consent: preview ? [true, false] : [true],
  };
});

export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const { db, statuses } = await reader();
  const { data } = await db.from("pages").select("*").eq("slug", slug).in("status", statuses).maybeSingle();
  return data as Page | null;
});

export const getAreas = cache(async (): Promise<Page[]> => {
  const { db, statuses } = await reader();
  const { data } = await db.from("pages").select("*").eq("kind", "consortium_area").in("status", statuses).order("sort_order");
  return (data ?? []) as Page[];
});

export async function getArticles(opts: { type?: string; area?: string; limit?: number; featured?: boolean } = {}): Promise<Article[]> {
  const { db, statuses } = await reader();
  let q = db.from("articles").select("*").in("status", statuses);
  if (opts.type) q = q.eq("article_type", opts.type);
  if (opts.area) q = q.eq("area_slug", opts.area);
  if (opts.featured) q = q.eq("featured", true);
  q = q.order("published_at", { ascending: false, nullsFirst: false });
  if (opts.limit) q = q.limit(opts.limit);
  const { data } = await q;
  return (data ?? []) as Article[];
}

export const getArticle = cache(async (slug: string): Promise<Article | null> => {
  const { db, statuses } = await reader();
  const { data } = await db.from("articles").select("*").eq("slug", slug).in("status", statuses).maybeSingle();
  return data as Article | null;
});

export async function getResources(area?: string): Promise<Resource[]> {
  const { db, statuses } = await reader();
  let q = db.from("resources").select("*").in("status", statuses);
  if (area) q = q.eq("area_slug", area);
  const { data } = await q.order("sort_order").order("published_date", { ascending: false, nullsFirst: false });
  return (data ?? []) as Resource[];
}

export async function getOrganizations(opts: { area?: string; featured?: boolean } = {}): Promise<Organization[]> {
  const { db, statuses } = await reader();
  let q = db.from("organizations").select("*").in("status", statuses);
  if (opts.area) q = q.eq("area_slug", opts.area);
  if (opts.featured) q = q.eq("featured", true);
  const { data } = await q.order("relationship").order("sort_order").order("name");
  return (data ?? []) as Organization[];
}

export async function getTimeline(): Promise<TimelineEntry[]> {
  const { db, statuses } = await reader();
  const { data } = await db.from("timeline_entries").select("*").in("status", statuses).order("year").order("sort_order");
  return (data ?? []) as TimelineEntry[];
}

export async function getStories(): Promise<VeteranStory[]> {
  const { db, statuses, consent } = await reader();
  const { data } = await db.from("veteran_stories").select("id, slug, name, service, photo_url, quote, short_bio, full_story, sort_order")
    .in("status", statuses).in("consent_on_file", consent).order("sort_order").order("created_at", { ascending: false });
  return (data ?? []) as VeteranStory[];
}

export const getStory = cache(async (slug: string): Promise<VeteranStory | null> => {
  const { db, statuses, consent } = await reader();
  const { data } = await db.from("veteran_stories").select("id, slug, name, service, photo_url, quote, short_bio, full_story, sort_order")
    .eq("slug", slug).in("status", statuses).in("consent_on_file", consent).maybeSingle();
  return data as VeteranStory | null;
});

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://vetsforibogaine.org").replace(/\/$/, "");

export const ARTICLE_TYPE_LABELS: Record<string, string> = {
  editorial: "Editorial",
  research_summary: "Research Summary",
  media_coverage: "In the News",
  announcement: "Announcement",
};

export function formatDate(d: string | null) {
  if (!d) return "";
  const dt = new Date(d + (d.length === 10 ? "T12:00:00Z" : ""));
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
