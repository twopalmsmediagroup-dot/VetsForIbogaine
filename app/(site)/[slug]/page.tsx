import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data";
import Markdown from "@/components/Markdown";
import PageHero from "@/components/PageHero";
import Visual from "@/components/Visual";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPage((await params).slug);
  if (!p) return {};
  return { title: p.seo_title || p.title, description: p.seo_description || p.summary || undefined, alternates: { canonical: `/${p.slug}` } };
}

export default async function GenericPage({ params }: Props) {
  const { slug } = await params;
  const p = await getPage(slug);
  if (!p || p.kind === "consortium_area") notFound();
  if (p.kind === "legal") {
    return (
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="display text-4xl text-navy-900 sm:text-5xl">{p.title}</h1>
        <Markdown className="mt-6">{p.body}</Markdown>
      </article>
    );
  }
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} summary={p.summary} />
      {p.hero_image_url && <Visual src={p.hero_image_url} alt="" className="mx-auto -mt-0 h-64 max-w-7xl md:h-96" />}
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Markdown>{p.body}</Markdown>
      </article>
    </>
  );
}
