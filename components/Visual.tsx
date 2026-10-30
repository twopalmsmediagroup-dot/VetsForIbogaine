import Image from "next/image";

/** Shows an uploaded photo, or an on-brand navy panel with the brain mark when none is set. */
export default function Visual({
  src, alt = "", priority = false, className = "", sizes = "(min-width: 1024px) 50vw, 100vw",
}: { src?: string | null; alt?: string; priority?: boolean; className?: string; sizes?: string }) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
    );
  }
  return (
    <div className={`neural-bg relative flex items-center justify-center overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(#e2c98a 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <Image src="/brand/brain-mark.png" alt="" width={541} height={600} className="relative w-[38%] max-w-[260px] h-auto drop-shadow-[0_0_40px_rgba(214,180,100,0.35)]" />
    </div>
  );
}
