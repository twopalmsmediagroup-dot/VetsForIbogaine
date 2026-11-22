/** Editorial page header: white, navy title, short accent rule (inner pages). */
export default function PageHero({ eyebrow, title, summary }: { eyebrow?: string | null; title: string; summary?: string | null }) {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 md:py-14 lg:px-8">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display mt-3 max-w-4xl text-[2.2rem] text-navy-900 sm:text-5xl md:text-6xl">{title}</h1>
        <span className="title-rule mt-6" aria-hidden="true" />
        {summary && <p className="mt-6 max-w-2xl text-base text-muted sm:text-lg">{summary}</p>}
      </div>
    </section>
  );
}
