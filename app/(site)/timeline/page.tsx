import type { Metadata } from "next";
import Image from "next/image";
import { getSettings, getTimeline } from "@/lib/data";
import PageHero from "@/components/PageHero";
import { External } from "@/components/Icons";

export const revalidate = 300;
export const metadata: Metadata = { title: "History & Timeline", description: "Key milestones in the history of ibogaine, from traditional use to modern research and policy.", alternates: { canonical: "/timeline" } };

export default async function TimelinePage() {
  const [s, entries] = await Promise.all([getSettings(), getTimeline()]);
  return (
    <>
      <PageHero eyebrow="History & Timeline" title={s.timeline_title || "A History of Tradition, Science and Discovery."} summary={s.timeline_body} />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <ol className="relative border-l border-gold-500/50 pl-8 sm:pl-12">
          {entries.map((e) => (
            <li key={e.id} className="relative pb-14 last:pb-0">
              <span className="absolute top-1.5 -left-[2.32rem] h-3 w-3 rotate-45 bg-gold-500 ring-4 ring-paper sm:-left-[3.32rem]" aria-hidden="true" />
              <p className="display text-3xl text-gold-600">{e.date_label || e.year}</p>
              {e.era && <p className="mt-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-navy-700">{e.era}</p>}
              <h2 className="display mt-2 text-2xl text-navy-900">{e.title}</h2>
              {e.description && <p className="mt-2 text-ink/80">{e.description}</p>}
              {e.image_url && <Image src={e.image_url} alt="" width={800} height={450} className="mt-4 h-auto w-full max-w-lg" />}
              {e.source_url && (
                <a href={e.source_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-navy-700 hover:text-gold-700">
                  Source: {e.source_name || "Read more"} <External />
                </a>
              )}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
