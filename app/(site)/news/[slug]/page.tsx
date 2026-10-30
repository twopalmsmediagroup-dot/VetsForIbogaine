import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ARTICLE_TYPE_LABELS, SITE_URL, formatDate, getArticle, getSettings } from "@/lib/data";
import { isExternalArticle } from "@/lib/articles";
import Markdown from "@/components/Markdown";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getArticle((await params).slug);
  if (!a) return {};
  const desc = a.seo_description || a.excerpt || undefined;
  return {
    title: a.title, description: desc, alternates: { canonical: `/news/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: desc, publishedTime: a.published_at || undefined, images: a.cover_image_url ? [a.cover_image_url] : undefined },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();
  if (isExternalArticle(a)) redirect(a.source_url!);
  const s = await getSettings();

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.excerpt,
    datePublished: a.published_at, dateModified: a.updated_at, image: a.cover_image_url || undefined,
    author: { "@type": "Organization", name: a.author || "Vets for Ibogaine" },
    publisher: { "@type": "Organization", name: "Vets for Ibogaine", logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/brain-mark.png` } },
    mainEntityOfPage: `${SITE_URL}/news/${a.slug}`,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="on-dark neural-bg text-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
          <Link href="/news" className="text-xs font-semibold tracking-[0.14em] uppercase text-white/85 hover:text-gold-300">← All articles</Link>
          <p className="eyebrow mt-6">{ARTICLE_TYPE_LABELS[a.article_type]}</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl">{a.title}</h1>
          {a.excerpt && <p className="mt-5 text-lg text-white/90">{a.excerpt}</p>}
          <p className="mt-6 text-sm text-white/60">{[a.author, formatDate(a.published_at)].filter(Boolean).join(" · ")}</p>
        </div>
      </header>
      {a.cover_image_url && (
        <div className="relative mx-auto aspect-[16/8] max-w-5xl">
          <Image src={a.cover_image_url} alt="" fill priority sizes="(min-width:1024px) 1024px, 100vw" className="object-cover" />
        </div>
      )}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Markdown>{a.body}</Markdown>
        {a.source_url && (
          <p className="mt-6 text-sm">Originally published by <a href={a.source_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy-700 underline">{a.source_name || "the source"}</a>.</p>
        )}
        {a.references_md && (
          <section className="mt-8 border-t border-line pt-6" aria-labelledby="refs">
            <h2 id="refs" className="text-sm font-bold tracking-[0.14em] uppercase text-navy-900">References</h2>
            <Markdown className="mt-4 !text-sm">{a.references_md}</Markdown>
          </section>
        )}
        <p className="mt-8 border-l-2 border-gold-500 bg-white p-5 text-xs leading-relaxed text-muted">
          This article is for educational purposes only and is not medical advice. {s.disclaimer_short} <Link href="/medical-disclaimer" className="underline">Medical disclaimer</Link>.
        </p>
      </div>
    </article>
  );
}
