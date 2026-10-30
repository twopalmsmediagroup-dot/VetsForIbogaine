import Link from "next/link";
import { getAreas, getOrganizations, getSettings } from "@/lib/data";
import Visual from "@/components/Visual";
import NewsletterForm from "@/components/NewsletterForm";
import { RelationshipBadge } from "@/components/OrgCard";
import { AREA_ICONS, ArrowRight, Book, Megaphone, Network } from "@/components/Icons";

export const revalidate = 300;

const PILLARS: Record<string, { icon: typeof Book; key: string }> = {
  advocacy: { icon: Megaphone, key: "advocacy_text" },
  collaboration: { icon: Network, key: "collaboration_text" },
  education: { icon: Book, key: "education_text" },
};

export default async function Home() {
  const [s, areas, orgs] = await Promise.all([
    getSettings(), getAreas(), getOrganizations({ featured: true }),
  ]);
  const pillarOrder = (s.tagline || "Advocacy • Collaboration • Education")
    .split(/[•·|]/).map((p) => p.trim().toLowerCase()).filter((p) => PILLARS[p]);

  return (
    <>
      {/* HERO */}
      <section className="on-dark relative overflow-hidden bg-navy-950 text-white">
        <div className="absolute inset-0 lg:left-[45%]">
          <Visual src={s.hero_image_url} mark priority className="h-full w-full" sizes="(min-width:1024px) 55vw, 100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/10 lg:via-navy-950/20" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <p className="eyebrow">{s.hero_eyebrow}</p>
            <h1 className="display mt-4 text-[2.75rem] sm:mt-5 sm:text-6xl lg:text-7xl">
              {s.hero_title || "Veterans Deserve"}{" "}
              <em className="gold-text italic">{s.hero_highlight || "More Options."}</em>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">{s.hero_body}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/about-ibogaine" className="btn btn-gold justify-center">Explore Ibogaine <ArrowRight /></Link>
              <Link href="/contact?type=join" className="btn btn-outline-light justify-center">Join the Consortium <ArrowRight /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ACE PILLARS */}
      <section aria-labelledby="ace-heading" className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
          <h2 id="ace-heading" className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-navy-700">
            {s.support_message || "Connecting Organizations. Sharing Knowledge. Amplifying Veteran Voices."}
          </h2>
          <ul className="mt-6 grid gap-7 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
            {pillarOrder.map((p) => {
              const { icon: Icon, key } = PILLARS[p];
              return (
                <li key={p} className="flex flex-col items-center px-6 text-center">
                  <Icon className="text-navy-800" />
                  <h3 className="mt-3 text-sm font-bold tracking-[0.18em] uppercase text-navy-900">
                    <span className="gold-text text-lg">{p[0].toUpperCase()}</span>{p.slice(1).toUpperCase()}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-muted">{s[key]}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* MISSION */}
      <section className="grid bg-paper lg:grid-cols-2">
        <div className="mx-auto flex max-w-2xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-12 lg:mr-0 lg:py-14 lg:pr-14 lg:pl-8">
          <p className="eyebrow">The Mission</p>
          <h2 className="display mt-3 text-[2.1rem] leading-[1.1] sm:text-4xl text-navy-900 sm:text-5xl">{s.mission_title}</h2>
          <p className="mt-5 text-base leading-relaxed text-ink/90 sm:text-lg">{s.mission_body}</p>
          <div className="mt-6"><Link href="/why-veterans" className="btn btn-gold">Why Veterans? <ArrowRight /></Link></div>
        </div>
        <Visual src={s.mission_image_url} className="lg:min-h-[400px]" />
      </section>

      {/* ABOUT IBOGAINE */}
      <section className="grid bg-paper-2 lg:grid-cols-2">
        <Visual src={s.about_image_url} className="order-2 lg:order-1 lg:min-h-[400px]" />
        <div className="order-1 mx-auto flex max-w-2xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-12 lg:order-2 lg:ml-0 lg:py-14 lg:pl-14 lg:pr-8">
          <p className="eyebrow">About Ibogaine</p>
          <h2 className="display mt-3 text-[2.1rem] leading-[1.1] sm:text-4xl text-navy-900 sm:text-5xl">{s.about_title}</h2>
          <p className="mt-5 text-base leading-relaxed text-ink/90 sm:text-lg">{s.about_body}</p>
          <p className="mt-4 border-l-2 border-gold-500 pl-4 text-sm text-muted">Ibogaine is a Schedule I substance in the U.S. and is not FDA-approved. This information is educational, not medical advice.</p>
          <div className="mt-6"><Link href="/about-ibogaine" className="btn btn-gold">Learn About Ibogaine <ArrowRight /></Link></div>
        </div>
      </section>

      {/* CONSORTIUM */}
      <section className="on-dark bg-navy-900 text-white" aria-labelledby="consortium-heading">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="eyebrow">The Consortium</p>
            <h2 id="consortium-heading" className="display mt-3 text-[2.1rem] leading-[1.1] sm:text-4xl sm:text-5xl">{s.consortium_title}</h2>
            <p className="mt-5 text-base leading-relaxed text-white/90 sm:text-lg">{s.consortium_body}</p>
            <div className="mt-6"><Link href="/consortium" className="btn btn-gold">Explore the Consortium <ArrowRight /></Link></div>
          </div>
          <ul className="grid grid-cols-2 gap-px bg-white/10 ring-1 ring-white/10 md:grid-cols-4">
            {areas.map((a) => {
              const Icon = AREA_ICONS[a.icon || "book"] || Book;
              return (
                <li key={a.id} className="bg-navy-900">
                  <Link href={`/consortium/${a.slug}`} className="group flex h-full flex-col items-center px-3 py-7 text-center transition hover:bg-navy-800">
                    <Icon className="text-gold-300 transition group-hover:scale-110" />
                    <span className="mt-3 text-[0.74rem] font-extrabold tracking-[0.14em] uppercase text-white">{a.title}</span>
                    <span className="mt-1.5 text-[0.8rem] leading-snug font-medium text-white/90">{a.eyebrow}</span>
                  </Link>
                </li>
              );
            })}
            {areas.length % 2 !== 0 && (
              <li className="flex items-center justify-center bg-navy-900 p-4">
                <Link href="/consortium" className="text-xs font-semibold tracking-[0.14em] uppercase text-gold-400 hover:text-gold-300">All focus areas →</Link>
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* PARTNERS */}
      {orgs.length > 0 && (
        <section className="bg-paper" aria-labelledby="partners-heading">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="eyebrow">Partners & Organizations</p>
              <h2 id="partners-heading" className="display mt-3 text-[2.1rem] leading-[1.1] sm:text-4xl text-navy-900 sm:text-5xl">{s.partners_title}</h2>
              <p className="mt-6 text-ink/90">{s.partners_body}</p>
              <div className="mt-6"><Link href="/partners" className="btn btn-gold">View Organizations <ArrowRight /></Link></div>
            </div>
            <ul className="grid gap-px self-center bg-line ring-1 ring-line sm:grid-cols-2">
              {orgs.slice(0, 4).map((o) => (
                <li key={o.id} className="flex flex-col gap-2 bg-paper p-6">
                  <span className="display text-xl text-navy-900">{o.name}</span>
                  <RelationshipBadge r={o.relationship} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* TIMELINE */}
      <section className="grid bg-paper-2 lg:grid-cols-2">
        <Visual src={s.timeline_image_url} className="lg:min-h-[320px]" />
        <div className="mx-auto flex max-w-2xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-12 lg:ml-0 lg:py-14 lg:pl-14 lg:pr-8">
          <p className="eyebrow">History & Timeline</p>
          <h2 className="display mt-3 text-[2.1rem] leading-[1.1] sm:text-4xl text-navy-900 sm:text-5xl">{s.timeline_title}</h2>
          <p className="mt-5 text-base leading-relaxed text-ink/90 sm:text-lg">{s.timeline_body}</p>
          <div className="mt-6"><Link href="/timeline" className="btn btn-gold">View the Timeline <ArrowRight /></Link></div>
        </div>
      </section>

      {/* NEWS — button only */}
      <section className="border-t border-line bg-paper" aria-labelledby="news-heading">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="eyebrow">News & Articles</p>
            <h2 id="news-heading" className="display mt-2 text-3xl text-navy-900">{s.news_title}</h2>
            {s.news_body && <p className="mt-2 text-ink/90">{s.news_body}</p>}
          </div>
          <Link href="/news?type=media_coverage" className="btn btn-gold shrink-0">In the News <ArrowRight /></Link>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="on-dark bg-navy-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="eyebrow">Stay Informed</p>
            <h2 className="display mt-2 text-3xl">{s.newsletter_title}</h2>
            <p className="mt-2 text-sm text-white/85">{s.newsletter_body}</p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
