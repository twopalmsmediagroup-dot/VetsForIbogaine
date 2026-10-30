export default function PageHero({ eyebrow, title, summary }: { eyebrow?: string | null; title: string; summary?: string | null }) {
  return (
    <section className="on-dark neural-bg text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-14 lg:px-8">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display mt-3 max-w-3xl text-[2.1rem] leading-[1.1] sm:text-5xl md:text-6xl">{title}</h1>
        {summary && <p className="mt-4 max-w-2xl text-base sm:mt-5 sm:text-lg text-white/80">{summary}</p>}
      </div>
    </section>
  );
}
