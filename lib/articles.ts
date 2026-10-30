/** "In the News" items with a source link and no text of our own link straight out to the source; everything else has a page at /news/[slug]. */
export function isExternalArticle(a: { article_type?: unknown; source_url?: unknown; body?: unknown }) {
  return a.article_type === "media_coverage" && !!a.source_url && !a.body;
}

export function articleHref(a: { article_type?: unknown; source_url?: unknown; body?: unknown; slug?: unknown }) {
  return isExternalArticle(a) ? String(a.source_url) : `/news/${a.slug}`;
}
