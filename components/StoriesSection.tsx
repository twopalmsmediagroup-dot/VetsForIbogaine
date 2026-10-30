import Link from "next/link";
import { getStories } from "@/lib/data";
import StoriesCarousel from "./StoriesCarousel";

export default async function StoriesSection() {
  const stories = await getStories();
  return (
    <section id="stories" aria-labelledby="stories-h" className="scroll-mt-24 border-t border-line bg-paper-2">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <p className="eyebrow">In Their Words</p>
        <h2 id="stories-h" className="display mt-2 text-3xl text-navy-900 sm:text-4xl">Veteran Stories</h2>
        <p className="mt-3 max-w-2xl text-ink/80">Veterans who have undergone ibogaine treatment share their experiences, in their own words.</p>
        <div className="mt-6">
          {stories.length ? <StoriesCarousel stories={stories} /> : (
            <p className="bg-white p-6 text-ink/80 ring-1 ring-line">Stories are coming soon.</p>
          )}
        </div>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-xs leading-relaxed text-muted">
            These are personal accounts shared with permission. Individual experiences vary and are not medical advice or evidence of safety or effectiveness. Ibogaine is a Schedule I substance in the U.S. and is not FDA-approved. Vets for Ibogaine does not arrange treatment or endorse providers.
          </p>
          <Link href="/contact?type=story" className="btn btn-outline shrink-0 justify-center">Add My Story</Link>
        </div>
      </div>
    </section>
  );
}
