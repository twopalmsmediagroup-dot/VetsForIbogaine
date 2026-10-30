import type { Metadata } from "next";
import { formatDate, getAreas, getResources } from "@/lib/data";
import PageHero from "@/components/PageHero";
import { External } from "@/components/Icons";

export const revalidate = 300;
export const metadata: Metadata = { title: "Resources", description: "Studies, reports, guides and policy resources on ibogaine and veteran health.", alternates: { canonical: "/resources" } };

export default async function ResourcesPage() {
  const [areas, resources] = await Promise.all([getAreas(), getResources()]);
  const byArea = areas.map((a) => ({ area: a, items: resources.filter((r) => r.area_slug === a.slug) })).filter((g) => g.items.length);
  const other = resources.filter((r) => !areas.some((a) => a.slug === r.area_slug));
  if (other.length) byArea.push({ area: { slug: "other", title: "General" } as never, items: other });
  return (
    <>
      <PageHero eyebrow="Resources" title="Evidence & Resources" summary="Peer-reviewed studies, reports, guides and policy documents, organized by focus area." />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {byArea.map(({ area, items }) => (
          <section key={area.slug} className="mb-10" aria-labelledby={`r-${area.slug}`}>
            <h2 id={`r-${area.slug}`} className="display text-3xl text-navy-900">{area.title}</h2>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {items.map((r) => (
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
        ))}
      </div>
    </>
  );
}
