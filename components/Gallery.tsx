"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, close, step]);

  if (!images.length) return null;
  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {images.map((src, i) => (
          <li key={src}>
            <button type="button" onClick={() => setOpen(i)} className="group relative block aspect-square w-full overflow-hidden bg-navy-900" aria-label={`Open photo ${i + 1} of ${images.length}`}>
              <Image src={src} alt="" fill sizes="(min-width:1024px) 22vw, (min-width:640px) 33vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
            </button>
          </li>
        ))}
      </ul>
      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={`${title} photo ${open + 1} of ${images.length}`} className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-4" onClick={close}>
          <div className="relative h-full max-h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={images[open]} alt="" fill sizes="100vw" className="object-contain" />
          </div>
          <button type="button" onClick={close} className="absolute top-4 right-4 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/20">Close ✕</button>
          {images.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-2xl text-white hover:bg-white/20 sm:left-6">‹</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-2xl text-white hover:bg-white/20 sm:right-6">›</button>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">{open + 1} / {images.length}</p>
            </>
          )}
        </div>
      )}
    </>
  );
}
