import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/data";
import Markdown from "@/components/Markdown";
import PageHero from "@/components/PageHero";
import Visual from "@/components/Visual";
import Gallery from "@/components/Gallery";
import Image from "next/image";
import StoriesSection from "@/components/StoriesSection";

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
  const gallery = (p.gallery ?? []).filter(Boolean);
  const galleryBlock = gallery.length > 0 && (
    <section aria-labelledby="gallery-h" className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <h2 id="gallery-h" className="eyebrow mb-4">Photos</h2>
      <Gallery images={gallery} title={p.title} />
    </section>
  );

  // Profile layout (About Us): portrait beside the bio.
  if (p.slug === "about-us") {
    return (
      <>
        <PageHero eyebrow={p.eyebrow} title={p.title} summary={p.summary} />
        <div className={`mx-auto grid gap-8 px-4 py-8 sm:px-6 sm:py-10 ${p.hero_image_url ? "max-w-6xl md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12" : "max-w-3xl"}`}>
          {p.hero_image_url && (
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-navy-900 md:sticky md:top-28 md:self-start">
              <Image src={p.hero_image_url} alt={`Portrait — ${p.title}`} fill priority sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
            </div>
          )}
          <article className="min-w-0"><Markdown>{p.body}</Markdown></article>
        </div>
        {galleryBlock}
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} summary={p.summary} />
      {p.hero_image_url && <Visual src={p.hero_image_url} alt="" className="mx-auto -mt-0 h-64 max-w-7xl md:h-96" />}
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Markdown>{p.body}</Markdown>
      </article>
      {galleryBlock}
      {p.slug === "why-veterans" && <StoriesSection />}
    </>
  );
}
