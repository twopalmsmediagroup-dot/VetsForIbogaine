import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-3 text-5xl text-navy-900">Page not found</h1>
      <p className="mt-4 text-muted">The page you're looking for doesn't exist or has moved.</p>
      <Link href="/" className="btn btn-gold mt-8">Back to home</Link>
    </main>
  );
}
