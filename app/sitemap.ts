import type { MetadataRoute } from "next";
import { publicClient } from "@/lib/supabase/public";
import { SITE_URL } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sb = publicClient();
  const [{ data: pages }, { data: articles }, { data: stories }] = await Promise.all([
    sb.from("pages").select("slug, kind, updated_at").eq("status", "published"),
    sb.from("articles").select("slug, article_type, body, updated_at").eq("status", "published"),
    sb.from("veteran_stories").select("slug, full_story, updated_at").eq("status", "published").eq("consent_on_file", true),
  ]);
  const staticRoutes = ["", "/consortium", "/partners", "/timeline", "/news", "/resources", "/contact"].map((p) => ({ url: `${SITE_URL}${p}` }));
  const pageRoutes = (pages ?? []).map((p) => ({ url: `${SITE_URL}${p.kind === "consortium_area" ? "/consortium" : ""}/${p.slug}`, lastModified: p.updated_at }));
  const articleRoutes = (articles ?? []).filter((a) => a.article_type !== "media_coverage" || a.body).map((a) => ({ url: `${SITE_URL}/news/${a.slug}`, lastModified: a.updated_at }));
  const storyRoutes = (stories ?? []).filter((s) => s.full_story).map((s) => ({ url: `${SITE_URL}/stories/${s.slug}`, lastModified: s.updated_at }));
  return [...staticRoutes, ...pageRoutes, ...articleRoutes, ...storyRoutes];
}
