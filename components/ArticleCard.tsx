import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { ARTICLE_TYPE_LABELS, formatDate } from "@/lib/data";
import { articleHref, isExternalArticle } from "@/lib/articles";
import { External } from "./Icons";

export default function ArticleCard({ a }: { a: Article }) {
  const external = isExternalArticle(a);
  const label = external ? a.source_name || "In the News" : ARTICLE_TYPE_LABELS[a.article_type];
  return (
    <article className="group relative flex h-full flex-col bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-1 ring-line/60 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden">
        {a.cover_image_url ? (
          <Image src={a.cover_image_url} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="neural-bg relative h-full" aria-hidden="true">
            <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#c6a052" strokeWidth="0.6">
              <path d="M-20 190 C 80 160, 120 90, 210 100 S 340 40, 420 25" />
              <path d="M-20 215 C 90 185, 150 135, 230 140 S 350 85, 420 75" opacity=".55" />
              <circle cx="210" cy="100" r="2" fill="#e2c98a" stroke="none" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow !text-[0.65rem]">{label}</p>
        <h3 className="display mt-2 text-xl leading-snug text-navy-900">
          {external ? (
            <a href={articleHref(a)} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 focus:outline-none">
              {a.title}<span className="sr-only"> (opens {a.source_name || "external site"})</span>
            </a>
          ) : (
            <Link href={articleHref(a)} className="after:absolute after:inset-0 focus:outline-none">{a.title}</Link>
          )}
        </h3>
        {a.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{a.excerpt}</p>}
        <p className="mt-auto flex items-center gap-1.5 pt-4 text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-muted">
          {formatDate(a.published_at)} {external && <External />}
        </p>
      </div>
    </article>
  );
}
