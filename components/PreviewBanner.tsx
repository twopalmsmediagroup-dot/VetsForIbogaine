"use client";
import { usePathname } from "next/navigation";

/** Shown only while draft preview is on, so staff never mistake a preview for the live site. */
export default function PreviewBanner() {
  const pathname = usePathname();
  return (
    <div role="status" className="relative z-[60] flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-amber-400 px-4 py-2 text-center text-sm font-semibold text-navy-950">
      <span>Preview mode — drafts are visible to you only.</span>
      <a href={`/exit-preview?path=${encodeURIComponent(pathname)}`} className="underline">Exit preview</a>
    </div>
  );
}
