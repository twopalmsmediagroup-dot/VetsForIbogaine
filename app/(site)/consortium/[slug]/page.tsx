import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAreas, getArticles, getOrganizations, getPage, getResources, getSettings, formatDate } from "@/lib/data";
import Markdown from "@/components/Markdown";
import PageHero from "@/components/PageHero";
import ArticleCard from "@/components/ArticleCard";
import OrgCard from "@/components/OrgCard";
import { AREA_ICONS, ArrowRight, Book, External } from "@/components/Icons";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPage((await params).slug);
  if (!p) return {};
  return { title: p.seo_title || p.title, description: p.seo_description || p.summary || undefined, alternates: { canonical: `/consortium/${p.slug}` } };
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const p = await getPage(slug);
  if (!p || p.kind !== "consortium_area") notFound();
  const [s, articles, orgs, resources, areas] = await Promise.all([getSettings(), getArticles({ area: slug, limit: 6 }), getOrganizations({ area: slug }), getResources(slug), getAreas()]);
  // The hero already shows the summary; don't repeat it if the body opens with the same text.
  const body = p.summary && p.body?.trimStart().startsWith(p.summary.trim()) ? p.body.trimStart().slice(p.summary.trim().length).trimStart() : p.body;
  const empty = !resources.length && !articles.length && !orgs.length;
  const others = areas.filter((a) => a.slug !== slug);

  return (
    <>
      <PageHero eyebrow="Consortium Focus Area" title={p.title} summary={p.summary} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:gap-12 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="min-w-0">
          <Markdown>{body}</Markdown>

          {empty && (
            <div className="mt-8 border border-dashed border-accent/60 bg-white p-6">
              <p className="display text-2xl text-navy-900">We&apos;re building this collection.</p>
              <p className="mt-2 text-sm text-muted">We&apos;re still gathering credible research, reporting and organizations for {p.title.toLowerCase()}. Know of a study, article or organization that belongs here?</p>
              <Link href="/contact?type=general" className="btn btn-outline mt-5">Suggest a resource <ArrowRight /></Link>
            </div>
          )}

          {resources.length > 0 && (
            <section className="mt-8" aria-labelledby="res-h">
              <h2 id="res-h" className="display text-3xl text-navy-900">Research & Resources</h2>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {resources.map((r) => (
                  <li key={r.id} className="py-4">
                    <p className="eyebrow !text-[0.62rem]">{r.resource_type}{r.published_date ? ` · ${formatDate(r.published_date)}` : ""}</p>
                    <h3 className="mt-1 text-lg font-semibold text-navy-900">
                      {r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent">{r.title} <External /></a> : r.title}
                    </h3>
                    {r.description && <p className="mt-1 text-sm text-muted">{r.description}</p>}
                    {r.citation && <p className="mt-1 text-xs italic text-muted">{r.citation}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {articles.length > 0 && (
            <section className="mt-8" aria-labelledby="art-h">
              <h2 id="art-h" className="display text-3xl text-navy-900">Articles & Coverage</h2>
              <ul className="mt-4 grid gap-6 sm:grid-cols-2">
                {articles.map((a) => <li key={a.id}><ArticleCard a={a} /></li>)}
              </ul>
              {articles.length >= 6 && <Link href={`/news?area=${slug}`} className="mt-4 inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-navy-800 uppercase hover:text-accent">All articles in this area <ArrowRight /></Link>}
            </section>
          )}

          {orgs.length > 0 && (
            <section className="mt-8" aria-labelledby="org-h">
              <h2 id="org-h" className="display text-3xl text-navy-900">Organizations</h2>
              <ul className="mt-4 grid gap-6 sm:grid-cols-2">
                {orgs.map((o) => <li key={o.id}><OrgCard o={o} /></li>)}
              </ul>
            </section>
          )}
        </div>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="bg-navy-900 p-6 text-white on-dark">
            <p className="eyebrow">Get Involved</p>
            <p className="mt-3 text-sm text-white/90">Is your organization working in this area? Connect with the consortium.</p>
            <Link href="/contact?type=join" className="btn btn-primary mt-5 w-full justify-center">Join the Consortium</Link>
          </div>
          <div className="border-l-2 border-accent bg-white p-5 text-xs leading-relaxed text-muted">
            {s.disclaimer_short} <Link href="/medical-disclaimer" className="underline">Read the full disclaimer.</Link>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <nav aria-labelledby="more-areas" className="border-t border-line bg-paper-2">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <h2 id="more-areas" className="eyebrow">More Focus Areas</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {others.map((a) => {
                const Icon = AREA_ICONS[a.icon || "book"] || Book;
                return (
                  <li key={a.id}>
                    <Link href={`/consortium/${a.slug}`} className="group flex h-full flex-col items-start gap-2 bg-white p-4 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-md hover:ring-accent/60">
                      <Icon size={26} className="text-accent" />
                      <span className="text-sm font-semibold leading-snug text-navy-900 group-hover:text-accent">{a.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      )}
    </>
  );
}
