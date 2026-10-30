import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStory } from "@/lib/data";
import Markdown from "@/components/Markdown";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getStory((await params).slug);
  if (!s) return {};
  return { title: `${s.name} — Veteran Story`, description: s.short_bio || undefined, alternates: { canonical: `/stories/${s.slug}` } };
}

export default async function StoryPage({ params }: Props) {
  const s = await getStory((await params).slug);
  if (!s || !s.full_story) notFound();
  return (
    <article>
      <header className="on-dark neural-bg text-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <Link href="/why-veterans#stories" className="text-xs font-semibold tracking-[0.14em] uppercase text-white/85 hover:text-gold-300">← All veteran stories</Link>
          <p className="eyebrow mt-5">Veteran Story</p>
          <h1 className="display mt-2 text-[2.1rem] leading-[1.1] sm:text-5xl">{s.name}</h1>
          {s.service && <p className="mt-2 text-sm font-semibold tracking-[0.1em] uppercase text-gold-300">{s.service}</p>}
        </div>
      </header>
      <div className={`mx-auto grid gap-8 px-4 py-8 sm:px-6 sm:py-10 ${s.photo_url ? "max-w-5xl md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-12" : "max-w-3xl"}`}>
        {s.photo_url && (
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-navy-900 md:sticky md:top-28 md:self-start">
            <Image src={s.photo_url} alt={`Photo of ${s.name}`} fill priority sizes="(min-width:768px) 35vw, 100vw" className="object-cover" />
          </div>
        )}
        <div className="min-w-0">
          {s.quote && <p className="display mb-6 text-2xl leading-snug text-gold-700">“{s.quote.replace(/^["“]|["”]$/g, "")}”</p>}
          <Markdown>{s.full_story}</Markdown>
          <p className="mt-8 border-l-2 border-gold-500 bg-white p-5 text-xs leading-relaxed text-muted">
            This is a personal account shared with permission. Individual experiences vary and are not medical advice. Ibogaine is a Schedule I substance in the U.S., is not FDA-approved, and carries serious medical risks. <Link href="/medical-disclaimer" className="underline">Medical disclaimer</Link>.
          </p>
        </div>
      </div>
    </article>
  );
}
