export type Status = "draft" | "published";

export type Page = {
  id: string; slug: string; kind: "page" | "consortium_area" | "legal"; title: string;
  eyebrow: string | null; summary: string | null; body: string | null; hero_image_url: string | null;
  icon: string | null; gallery: string[] | null; sort_order: number; status: Status; seo_title: string | null; seo_description: string | null;
};

export type Article = {
  id: string; slug: string; title: string; excerpt: string | null; body: string | null;
  cover_image_url: string | null; author: string | null;
  article_type: "editorial" | "research_summary" | "media_coverage" | "announcement";
  area_slug: string | null; source_name: string | null; source_url: string | null; references_md: string | null;
  featured: boolean; status: Status; published_at: string | null; seo_description: string | null; updated_at: string;
};

export type Resource = {
  id: string; title: string; description: string | null; url: string | null; resource_type: string;
  area_slug: string | null; citation: string | null; published_date: string | null; sort_order: number; status: Status;
};

export type Organization = {
  id: string; name: string; slug: string; description: string | null; website: string | null; logo_url: string | null;
  org_type: string; relationship: "confirmed_partner" | "resource_listing"; area_slug: string | null;
  location: string | null; featured: boolean; sort_order: number; status: Status;
};

export type TimelineEntry = {
  id: string; year: number; date_label: string | null; title: string; description: string | null; era: string | null;
  source_name: string | null; source_url: string | null; image_url: string | null; sort_order: number; status: Status;
};

export type VeteranStory = {
  id: string; slug: string; name: string; service: string | null; photo_url: string | null; quote: string | null;
  short_bio: string | null; full_story: string | null; sort_order: number;
};

export type Settings = Record<string, string | null>;
