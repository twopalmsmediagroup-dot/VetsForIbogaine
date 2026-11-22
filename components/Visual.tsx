import Image from "next/image";

/**
 * Shows an uploaded photo. With no photo it renders a quiet navy panel with fine linework,
 * leaving the space ready for a photo uploaded in Settings.
 * Empty panels are hidden on small screens so phones don't scroll past blank blocks.
 */
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
    <div className={`neural-bg relative overflow-hidden hidden lg:block ${className}`} aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(#e2c98a 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#c6a052" strokeWidth="0.6">
        <path d="M-20 240 C 80 200, 120 120, 210 130 S 340 60, 420 40" />
        <path d="M-20 270 C 90 230, 150 170, 230 175 S 350 110, 420 95" opacity=".6" />
        <path d="M-20 205 C 70 175, 110 80, 190 85 S 330 20, 420 -10" opacity=".35" />
        <circle cx="210" cy="130" r="2" fill="#e2c98a" stroke="none" />
        <circle cx="230" cy="175" r="1.5" fill="#e2c98a" stroke="none" opacity=".7" />
        <circle cx="340" cy="62" r="1.5" fill="#e2c98a" stroke="none" opacity=".7" />
      </svg>
    </div>
  );
}
