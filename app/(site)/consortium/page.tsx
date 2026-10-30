import type { Metadata } from "next";
import Link from "next/link";
import { getAreas, getSettings } from "@/lib/data";
import PageHero from "@/components/PageHero";
import { AREA_ICONS, ArrowRight, Book } from "@/components/Icons";

export const revalidate = 300;
export const metadata: Metadata = { title: "The Consortium", description: "Seven focus areas connecting science, veteran advocacy, policy and public education.", alternates: { canonical: "/consortium" } };

export default async function ConsortiumPage() {
  const [s, areas] = await Promise.all([getSettings(), getAreas()]);
  return (
    <>
      <PageHero eyebrow="The Consortium" title={s.consortium_title || "Progress Requires Collaboration."} summary={s.consortium_body} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="max-w-3xl text-lg text-ink/80">
          <strong className="text-navy-900">{s.tagline}</strong> is our mission framework. The seven focus areas below are the subjects and organizations our network brings together.
        </p>
        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((a, i) => {
            const Icon = AREA_ICONS[a.icon || "book"] || Book;
            return (
              <li key={a.id}>
                <Link href={`/consortium/${a.slug}`} className="group flex h-full flex-col bg-white p-7 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <Icon className="text-gold-600" />
                    <span className="display text-3xl text-line">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 className="display mt-4 text-2xl text-navy-900">{a.title}</h2>
                  <p className="mt-1 text-xs font-semibold tracking-[0.12em] uppercase text-gold-700">{a.eyebrow}</p>
                  <p className="mt-3 text-sm text-muted">{a.summary}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-bold tracking-[0.14em] uppercase text-navy-800 group-hover:text-gold-700">Explore <ArrowRight /></span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
