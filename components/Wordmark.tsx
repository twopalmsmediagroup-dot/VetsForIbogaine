import Image from "next/image";
import Link from "next/link";

export default function Wordmark({ dark = false, tagline }: { dark?: boolean; tagline?: string | null }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5 min-[400px]:gap-3" aria-label="Vets for Ibogaine — home">
      <Image src="/brand/brain-mark.png" alt="" width={541} height={600} priority className="h-10 w-auto min-[360px]:h-11 sm:h-12" />
      <span className="flex min-w-0 flex-col leading-none whitespace-nowrap">
        <span className="font-[family-name:var(--font-mark)] text-[0.92rem] font-bold tracking-[0.04em] min-[360px]:text-[1rem] min-[400px]:text-[1.05rem] sm:text-[1.2rem]">
          <span className={dark ? "text-white" : "text-navy-900"}>VETS FOR </span>
          <span className="gold-text">IBOGAINE</span>
        </span>
        <span className={`mt-1.5 text-[0.44rem] font-semibold tracking-[0.14em] min-[360px]:text-[0.48rem] min-[360px]:tracking-[0.16em] min-[400px]:text-[0.5rem] min-[400px]:tracking-[0.2em] uppercase sm:text-[0.55rem] ${dark ? "text-white/70" : "text-navy-700"}`}>
          {tagline || "Advocacy • Collaboration • Education"}
        </span>
      </span>
    </Link>
  );
}
