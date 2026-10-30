"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { VeteranStory } from "@/lib/types";

export default function StoriesCarousel({ stories }: { stories: VeteranStory[] }) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current; if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 16), behavior: "smooth" });
  };

  return (
    <div className="relative">
      {stories.length > 1 && (
        <div className="mb-4 flex justify-end gap-2">
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous stories" className="h-10 w-10 rounded-full bg-white text-xl text-navy-900 ring-1 ring-line hover:ring-navy-700">‹</button>
          <button type="button" onClick={() => scroll(1)} aria-label="More stories" className="h-10 w-10 rounded-full bg-white text-xl text-navy-900 ring-1 ring-line hover:ring-navy-700">›</button>
        </div>
      )}
      <ul ref={track} className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] sm:mx-0 sm:px-0" aria-label="Veteran stories">
        {stories.map((s) => (
          <li key={s.id} className="w-[82%] max-w-[340px] shrink-0 snap-start sm:w-[320px]">
            <article className="flex h-full flex-col bg-white ring-1 ring-line/70">
              <div className="relative aspect-[4/5] overflow-hidden bg-navy-900">
                {s.photo_url ? (
                  <Image src={s.photo_url} alt={`Photo of ${s.name}`} fill sizes="340px" className="object-cover" />
                ) : (
                  <div className="neural-bg flex h-full items-center justify-center">
                    <span className="display text-6xl text-gold-400/80">{s.name.trim().charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 via-navy-950/50 to-transparent p-4 pt-12 text-white">
                  <h3 className="display text-2xl leading-tight">{s.name}</h3>
                  {s.service && <p className="mt-1 text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-gold-300">{s.service}</p>}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                {s.quote && <p className="display text-lg leading-snug text-gold-700">“{s.quote.replace(/^["“]|["”]$/g, "")}”</p>}
                {s.short_bio && <p className={`text-sm leading-relaxed text-ink/80 ${s.quote ? "mt-3" : ""}`}>{s.short_bio}</p>}
                {s.full_story && (
                  <Link href={`/stories/${s.slug}`} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold tracking-[0.14em] uppercase text-navy-800 hover:text-gold-700">
                    Read full story →<span className="sr-only"> from {s.name}</span>
                  </Link>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
