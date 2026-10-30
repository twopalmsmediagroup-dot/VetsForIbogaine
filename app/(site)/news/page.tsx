import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLE_TYPE_LABELS, getAreas, getArticles, getSettings } from "@/lib/data";
import PageHero from "@/components/PageHero";
import ArticleCard from "@/components/ArticleCard";

export const revalidate = 300;
export const metadata: Metadata = { title: "News & Articles", description: "Editorial articles, research summaries and media coverage on ibogaine and veteran health.", alternates: { canonical: "/news" } };

type Props = { searchParams: Promise<{ type?: string; area?: string }> };

export default async function NewsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const type = sp.type && ARTICLE_TYPE_LABELS[sp.type] ? sp.type : undefined;
  const [s, areas, articles] = await Promise.all([getSettings(), getAreas(), getArticles({ type, area: sp.area })]);
  const chip = (active: boolean) => `rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase ring-1 transition ${active ? "bg-navy-900 text-white ring-navy-900" : "bg-white text-navy-800 ring-line hover:ring-navy-700"}`;
  const href = (t?: string, a?: string) => { const q = new URLSearchParams(); if (t) q.set("type", t); if (a) q.set("area", a); const str = q.toString(); return `/news${str ? `?${str}` : ""}`; };

  return (
    <>
      <PageHero eyebrow="Article Library" title={s.news_title || "Research, Policy and Reporting."} summary={s.news_body} />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <nav aria-label="Filter by type" className="flex flex-wrap gap-2">
          <Link href={href(undefined, sp.area)} className={chip(!type)}>All</Link>
          {Object.entries(ARTICLE_TYPE_LABELS).map(([k, v]) => <Link key={k} href={href(k, sp.area)} className={chip(type === k)}>{v}</Link>)}
        </nav>
        <nav aria-label="Filter by focus area" className="mt-3 flex flex-wrap gap-2">
          <Link href={href(type)} className={chip(!sp.area)}>All areas</Link>
          {areas.map((a) => <Link key={a.slug} href={href(type, a.slug)} className={chip(sp.area === a.slug)}>{a.title}</Link>)}
        </nav>
        {articles.length ? (
          <ul className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{articles.map((a) => <li key={a.id}><ArticleCard a={a} /></li>)}</ul>
        ) : (
          <p className="mt-8 text-muted">No articles match these filters yet.</p>
        )}
      </section>
    </>
  );
}
