import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticles, getOrganizations, getPage, getResources, getSettings, formatDate } from "@/lib/data";
import Markdown from "@/components/Markdown";
import PageHero from "@/components/PageHero";
import ArticleCard from "@/components/ArticleCard";
import OrgCard from "@/components/OrgCard";
import { External } from "@/components/Icons";

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
  const [s, articles, orgs, resources] = await Promise.all([getSettings(), getArticles({ area: slug, limit: 6 }), getOrganizations({ area: slug }), getResources(slug)]);

  return (
    <>
      <PageHero eyebrow="Consortium Focus Area" title={p.title} summary={p.summary} />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="min-w-0">
          <Markdown>{p.body}</Markdown>

          {resources.length > 0 && (
            <section className="mt-14" aria-labelledby="res-h">
              <h2 id="res-h" className="display text-3xl text-navy-900">Research & Resources</h2>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {resources.map((r) => (
                  <li key={r.id} className="py-5">
                    <p className="eyebrow !text-[0.62rem]">{r.resource_type}{r.published_date ? ` · ${formatDate(r.published_date)}` : ""}</p>
                    <h3 className="mt-1 text-lg font-semibold text-navy-900">
                      {r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-gold-700">{r.title} <External /></a> : r.title}
                    </h3>
                    {r.description && <p className="mt-1 text-sm text-muted">{r.description}</p>}
                    {r.citation && <p className="mt-1 text-xs italic text-muted">{r.citation}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {articles.length > 0 && (
            <section className="mt-14" aria-labelledby="art-h">
              <h2 id="art-h" className="display text-3xl text-navy-900">Articles & Coverage</h2>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2">
                {articles.map((a) => <li key={a.id}><ArticleCard a={a} /></li>)}
              </ul>
            </section>
          )}

          {orgs.length > 0 && (
            <section className="mt-14" aria-labelledby="org-h">
              <h2 id="org-h" className="display text-3xl text-navy-900">Organizations</h2>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2">
                {orgs.map((o) => <li key={o.id}><OrgCard o={o} /></li>)}
              </ul>
            </section>
          )}
        </div>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="bg-navy-900 p-6 text-white on-dark">
            <p className="eyebrow">Get Involved</p>
            <p className="mt-3 text-sm text-white/80">Is your organization working in this area? Connect with the consortium.</p>
            <Link href="/contact?type=join" className="btn btn-gold mt-5 w-full justify-center">Join the Consortium</Link>
          </div>
          <div className="border-l-2 border-gold-500 bg-white p-5 text-xs leading-relaxed text-muted">
            {s.disclaimer_short} <Link href="/medical-disclaimer" className="underline">Read the full disclaimer.</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
