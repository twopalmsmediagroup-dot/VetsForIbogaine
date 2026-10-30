import { cache } from "react";
import { publicClient } from "./supabase/public";
import type { Article, Organization, Page, Resource, Settings, TimelineEntry } from "./types";

export const getSettings = cache(async (): Promise<Settings> => {
  const { data } = await publicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  return (data ?? {}) as Settings;
});

export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const { data } = await publicClient().from("pages").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  return data as Page | null;
});

export const getAreas = cache(async (): Promise<Page[]> => {
  const { data } = await publicClient().from("pages").select("*").eq("kind", "consortium_area").eq("status", "published").order("sort_order");
  return (data ?? []) as Page[];
});

export async function getArticles(opts: { type?: string; area?: string; limit?: number; featured?: boolean } = {}): Promise<Article[]> {
  let q = publicClient().from("articles").select("*").eq("status", "published");
  if (opts.type) q = q.eq("article_type", opts.type);
  if (opts.area) q = q.eq("area_slug", opts.area);
  if (opts.featured) q = q.eq("featured", true);
  q = q.order("published_at", { ascending: false, nullsFirst: false });
  if (opts.limit) q = q.limit(opts.limit);
  const { data } = await q;
  return (data ?? []) as Article[];
}

export const getArticle = cache(async (slug: string): Promise<Article | null> => {
  const { data } = await publicClient().from("articles").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  return data as Article | null;
});

export async function getResources(area?: string): Promise<Resource[]> {
  let q = publicClient().from("resources").select("*").eq("status", "published");
  if (area) q = q.eq("area_slug", area);
  const { data } = await q.order("sort_order").order("published_date", { ascending: false, nullsFirst: false });
  return (data ?? []) as Resource[];
}

export async function getOrganizations(opts: { area?: string; featured?: boolean } = {}): Promise<Organization[]> {
  let q = publicClient().from("organizations").select("*").eq("status", "published");
  if (opts.area) q = q.eq("area_slug", opts.area);
  if (opts.featured) q = q.eq("featured", true);
  const { data } = await q.order("relationship").order("sort_order").order("name");
  return (data ?? []) as Organization[];
}

export async function getTimeline(): Promise<TimelineEntry[]> {
  const { data } = await publicClient().from("timeline_entries").select("*").eq("status", "published").order("year").order("sort_order");
  return (data ?? []) as TimelineEntry[];
}

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
