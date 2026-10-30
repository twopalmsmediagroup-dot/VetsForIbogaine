import { articleHref } from "@/lib/articles";

export type FieldType = "text" | "textarea" | "markdown" | "select" | "image" | "date" | "checkbox" | "number" | "url" | "slug" | "area" | "gallery";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
  wide?: boolean;
  defaultValue?: string | number | boolean;
};

export type Entity = {
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  titleField: string;
  order: { column: string; ascending: boolean }[];
  columns: { name: string; label: string }[];
  fields: Field[];
  publicPath?: (row: Record<string, unknown>) => string | null;
};

const STATUS: Field = {
  name: "status", label: "Visibility", type: "select", defaultValue: "draft",
  options: [{ value: "draft", label: "Draft — hidden from the public" }, { value: "published", label: "Published — live on the website" }],
};
const SORT: Field = { name: "sort_order", label: "Display order", type: "number", defaultValue: 0, help: "Lower numbers appear first." };
const AREA: Field = { name: "area_slug", label: "Consortium focus area", type: "area", help: "Shows this item on that focus area's page." };

export const ENTITIES: Record<string, Entity> = {
  articles: {
    key: "articles", table: "articles", label: "Articles & News", singular: "Article",
    description: "Editorial articles, research summaries, announcements and links to outside media coverage.",
    titleField: "title",
    order: [{ column: "published_at", ascending: false }],
    columns: [{ name: "article_type", label: "Type" }, { name: "published_at", label: "Date" }],
    publicPath: (r) => articleHref(r),
    fields: [
      { name: "title", label: "Headline", type: "text", required: true, wide: true },
      { name: "article_type", label: "Type", type: "select", defaultValue: "editorial", options: [
        { value: "editorial", label: "Editorial article (written by us)" },
        { value: "research_summary", label: "Research summary" },
        { value: "announcement", label: "Announcement" },
        { value: "media_coverage", label: "In the News (link to outside coverage)" },
      ], help: "For “In the News”, fill in Source name and Source link — the card will link straight to that article." },
      STATUS,
      { name: "published_at", label: "Publish date", type: "date" },
      AREA,
      { name: "excerpt", label: "Short summary", type: "textarea", wide: true, help: "One or two sentences shown on cards and in search results." },
      { name: "cover_image_url", label: "Cover image", type: "image", wide: true, help: "For “In the News”, leave this empty and the publisher's preview image is added automatically when you save." },
      { name: "body", label: "Article text", type: "markdown", wide: true, help: "Leave empty for “In the News” links." },
      { name: "author", label: "Author", type: "text" },
      { name: "source_name", label: "Source name", type: "text", help: "e.g. Reuters, Stanford Medicine" },
      { name: "source_url", label: "Source link", type: "url", wide: true },
      { name: "references_md", label: "References", type: "markdown", wide: true, help: "List the studies and sources this article relies on." },
      { name: "slug", label: "Web address", type: "slug", wide: true },
      { name: "seo_description", label: "Search engine description", type: "textarea", wide: true },
    ],
  },
  resources: {
    key: "resources", table: "resources", label: "Resources", singular: "Resource",
    description: "Studies, reports, guides and policy documents listed on the Resources page and focus area pages.",
    titleField: "title",
    order: [{ column: "sort_order", ascending: true }, { column: "created_at", ascending: false }],
    columns: [{ name: "resource_type", label: "Type" }, { name: "area_slug", label: "Focus area" }],
    publicPath: () => "/resources",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "url", label: "Link", type: "url", wide: true },
      { name: "resource_type", label: "Type", type: "select", defaultValue: "other", options: [
        { value: "study", label: "Study" }, { value: "report", label: "Report" }, { value: "guide", label: "Guide" },
        { value: "policy", label: "Policy / legislation" }, { value: "video", label: "Video" }, { value: "other", label: "Other" },
      ] },
      STATUS, AREA,
      { name: "published_date", label: "Publication date", type: "date" },
      { name: "description", label: "Description", type: "textarea", wide: true },
      { name: "citation", label: "Citation", type: "text", wide: true, help: "e.g. Author, et al. Journal. Year;Volume:Pages." },
      SORT,
    ],
  },
  organizations: {
    key: "organizations", table: "organizations", label: "Organizations", singular: "Organization",
    description: "Confirmed partners and informational listings shown on the Partners page.",
    titleField: "name",
    order: [{ column: "relationship", ascending: true }, { column: "sort_order", ascending: true }, { column: "name", ascending: true }],
    columns: [{ name: "relationship", label: "Relationship" }, { name: "org_type", label: "Type" }],
    publicPath: () => "/partners",
    fields: [
      { name: "name", label: "Organization name", type: "text", required: true, wide: true },
      { name: "relationship", label: "Relationship", type: "select", defaultValue: "resource_listing", options: [
        { value: "resource_listing", label: "Informational listing (no formal relationship)" },
        { value: "confirmed_partner", label: "Confirmed partner (formal relationship)" },
      ], help: "Only choose “Confirmed partner” when the organization has formally agreed to partner." },
      STATUS,
      { name: "org_type", label: "Category", type: "select", defaultValue: "other", options: [
        { value: "research", label: "Research institution" }, { value: "treatment", label: "Treatment organization" },
        { value: "advocacy", label: "Veteran advocacy" }, { value: "policy", label: "Policy" }, { value: "government", label: "Government" },
        { value: "funder", label: "Funder / philanthropy" }, { value: "media", label: "Media" }, { value: "other", label: "Other" },
      ] },
      AREA,
      { name: "featured", label: "Show on homepage", type: "checkbox" },
      { name: "description", label: "Description", type: "textarea", wide: true },
      { name: "website", label: "Website", type: "url" },
      { name: "location", label: "Location", type: "text" },
      { name: "logo_url", label: "Logo", type: "image", wide: true, help: "Only upload a logo with the organization's permission." },
      SORT,
      { name: "slug", label: "Web address", type: "slug" },
    ],
  },
  stories: {
    key: "stories", table: "veteran_stories", label: "Veteran Stories", singular: "Story",
    description: "Photos and short bios of veterans sharing their ibogaine experience, shown on the Why Veterans page.",
    titleField: "name",
    order: [{ column: "sort_order", ascending: true }, { column: "created_at", ascending: false }],
    columns: [{ name: "service", label: "Service" }],
    publicPath: (r) => (r.full_story ? `/stories/${r.slug}` : "/why-veterans#stories"),
    fields: [
      { name: "name", label: "Veteran's name", type: "text", required: true, help: "Use only the name they've agreed to share (e.g. first name and last initial)." },
      { name: "service", label: "Service", type: "text", help: "e.g. U.S. Army · Iraq, 2004–2010" },
      { name: "consent_on_file", label: "Written consent on file", type: "checkbox" },
      { name: "status", label: "Visibility", type: "select", defaultValue: "draft", options: [{ value: "draft", label: "Draft — hidden from the public" }, { value: "published", label: "Published — live on the website" }], help: "A story can only be published once written consent is on file." },
      { name: "photo_url", label: "Photo", type: "image", wide: true, help: "A portrait or photo the veteran has approved. Square or portrait orientation works best." },
      { name: "quote", label: "Short quote (optional)", type: "text", wide: true, help: "One sentence in their own words, shown in gold on the card." },
      { name: "short_bio", label: "Short bio", type: "textarea", wide: true, help: "2–4 sentences shown on the card. Describe their experience in their words — avoid promising outcomes." },
      { name: "full_story", label: "Full story (optional)", type: "markdown", wide: true, help: "If filled in, the card gets a “Read full story” link to its own page." },
      { name: "sort_order", label: "Display order", type: "number", defaultValue: 0, help: "Lower numbers appear first." },
      { name: "slug", label: "Web address", type: "slug" },
    ],
  },
  timeline: {
    key: "timeline", table: "timeline_entries", label: "Timeline", singular: "Timeline entry",
    description: "Milestones on the History & Timeline page, shown in order of year.",
    titleField: "title",
    order: [{ column: "year", ascending: true }, { column: "sort_order", ascending: true }],
    columns: [{ name: "year", label: "Year" }, { name: "era", label: "Era" }],
    publicPath: () => "/timeline",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "year", label: "Year (for ordering)", type: "number", required: true },
      { name: "date_label", label: "Date as displayed", type: "text", help: "e.g. “January 2024” or “1939–1966”. Leave blank to show the year." },
      STATUS,
      { name: "era", label: "Era label", type: "text", help: "e.g. Tradition, Early science, Regulation, Modern research" },
      { name: "description", label: "Description", type: "textarea", wide: true },
      { name: "source_name", label: "Source name", type: "text" },
      { name: "source_url", label: "Source link", type: "url" },
      { name: "image_url", label: "Image (optional)", type: "image", wide: true },
      { name: "sort_order", label: "Order within the same year", type: "number", defaultValue: 0 },
    ],
  },
  pages: {
    key: "pages", table: "pages", label: "Pages & Focus Areas", singular: "Page",
    description: "About Ibogaine, Why Veterans, the seven consortium focus areas and legal pages.",
    titleField: "title",
    order: [{ column: "kind", ascending: true }, { column: "sort_order", ascending: true }],
    columns: [{ name: "kind", label: "Kind" }, { name: "slug", label: "Address" }],
    publicPath: (r) => (r.kind === "consortium_area" ? `/consortium/${r.slug}` : `/${r.slug}`),
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "kind", label: "Kind of page", type: "select", defaultValue: "page", options: [
        { value: "page", label: "Main page" }, { value: "consortium_area", label: "Consortium focus area" }, { value: "legal", label: "Legal page" },
      ] },
      STATUS,
      { name: "eyebrow", label: "Small label / short line", type: "text", help: "For focus areas, the short line shown under the title on cards." },
      { name: "icon", label: "Icon (focus areas)", type: "select", options: [
        { value: "", label: "—" }, { value: "microscope", label: "Microscope" }, { value: "shield", label: "Shield" }, { value: "people", label: "People" },
        { value: "layers", label: "Layers" }, { value: "columns", label: "Capitol columns" }, { value: "handshake", label: "Handshake" },
        { value: "megaphone", label: "Megaphone" }, { value: "book", label: "Book" }, { value: "network", label: "Network" },
      ] },
      { name: "summary", label: "Summary", type: "textarea", wide: true, help: "Shown under the page title and on cards." },
      { name: "body", label: "Page content", type: "markdown", wide: true },
      { name: "hero_image_url", label: "Header image / portrait (optional)", type: "image", wide: true, help: "On the About Us page this is the portrait shown beside the bio." },
      { name: "gallery", label: "Photo gallery (optional)", type: "gallery", wide: true, help: "Shown as a photo grid below the page content." },
      SORT,
      { name: "slug", label: "Web address", type: "slug", help: "Changing this changes the page's link." },
      { name: "seo_title", label: "Search engine title", type: "text" },
      { name: "seo_description", label: "Search engine description", type: "textarea", wide: true },
    ],
  },
};

export const SETTINGS_GROUPS: { title: string; fields: Field[] }[] = [
  { title: "Brand", fields: [
    { name: "tagline", label: "Tagline (pillars)", type: "text", wide: true, help: "Separate pillars with •. The homepage pillar order follows this." },
    { name: "support_message", label: "Supporting message", type: "text", wide: true },
    { name: "advocacy_text", label: "Advocacy description", type: "textarea" },
    { name: "collaboration_text", label: "Collaboration description", type: "textarea" },
    { name: "education_text", label: "Education description", type: "textarea" },
    { name: "disclaimer_short", label: "Short disclaimer", type: "textarea", wide: true },
  ] },
  { title: "Homepage — Hero", fields: [
    { name: "hero_eyebrow", label: "Small label", type: "text", wide: true },
    { name: "hero_title", label: "Headline", type: "text" },
    { name: "hero_highlight", label: "Gold highlighted words", type: "text" },
    { name: "hero_body", label: "Intro text", type: "textarea", wide: true },
    { name: "hero_image_url", label: "Hero photo", type: "image", wide: true },
  ] },
  { title: "Homepage — Mission", fields: [
    { name: "mission_title", label: "Headline", type: "text", wide: true },
    { name: "mission_body", label: "Text", type: "textarea", wide: true },
    { name: "mission_image_url", label: "Photo", type: "image", wide: true },
  ] },
  { title: "Homepage — About Ibogaine", fields: [
    { name: "about_title", label: "Headline", type: "text", wide: true },
    { name: "about_body", label: "Text", type: "textarea", wide: true },
    { name: "about_image_url", label: "Photo", type: "image", wide: true },
  ] },
  { title: "Homepage — Other sections", fields: [
    { name: "consortium_title", label: "Consortium headline", type: "text" },
    { name: "consortium_body", label: "Consortium text", type: "textarea" },
    { name: "partners_title", label: "Partners headline", type: "text" },
    { name: "partners_body", label: "Partners text", type: "textarea" },
    { name: "timeline_title", label: "Timeline headline", type: "text" },
    { name: "timeline_body", label: "Timeline text", type: "textarea" },
    { name: "timeline_image_url", label: "Timeline photo", type: "image", wide: true },
    { name: "news_title", label: "News headline", type: "text" },
    { name: "news_body", label: "News text", type: "textarea" },
    { name: "newsletter_title", label: "Newsletter headline", type: "text" },
    { name: "newsletter_body", label: "Newsletter text", type: "textarea" },
  ] },
  { title: "Footer & Contact", fields: [
    { name: "footer_tagline", label: "Footer line", type: "text", wide: true },
    { name: "contact_email", label: "Public contact email", type: "text" },
    { name: "donate_url", label: "Donate link", type: "url", help: "Leave blank to hide the Donate button." },
    { name: "linkedin_url", label: "LinkedIn", type: "url" },
    { name: "instagram_url", label: "Instagram", type: "url" },
    { name: "youtube_url", label: "YouTube", type: "url" },
    { name: "x_url", label: "X (Twitter)", type: "url" },
  ] },
];

export function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
