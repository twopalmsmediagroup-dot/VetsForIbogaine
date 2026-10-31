"use client";
import Link from "next/link";

/** Shown inside the site header/footer if a page fails to load (e.g. the database is briefly unreachable). */
export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="display mt-3 text-4xl text-navy-900 sm:text-5xl">This page didn&apos;t load.</h1>
      <p className="mt-4 max-w-md text-muted">It&apos;s likely a brief hiccup on our side. Please try again in a moment.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn btn-gold justify-center">Try again</button>
        <Link href="/" className="btn btn-outline justify-center">Back to home</Link>
      </div>
    </section>
  );
}
