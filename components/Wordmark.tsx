import Image from "next/image";
import Link from "next/link";

export default function Wordmark({ dark = false, tagline }: { dark?: boolean; tagline?: string | null }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Vets for Ibogaine — home">
      <Image src="/brand/brain-mark.png" alt="" width={541} height={600} priority className="h-11 w-auto sm:h-12" />
      <span className="flex flex-col leading-none">
        <span className="font-[family-name:var(--font-mark)] text-[1.05rem] font-bold tracking-[0.04em] sm:text-[1.2rem]">
          <span className={dark ? "text-white" : "text-navy-900"}>VETS FOR </span>
          <span className="gold-text">IBOGAINE</span>
        </span>
        <span className={`mt-1.5 text-[0.5rem] font-semibold tracking-[0.2em] uppercase sm:text-[0.55rem] ${dark ? "text-white/70" : "text-navy-700"}`}>
          {tagline || "Advocacy • Collaboration • Education"}
        </span>
      </span>
    </Link>
  );
}
