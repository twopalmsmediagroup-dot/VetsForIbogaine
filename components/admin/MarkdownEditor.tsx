"use client";
import { useRef, useState } from "react";
import Markdown from "@/components/Markdown";

const TOOLS: { label: string; title: string; before: string; after?: string; line?: boolean }[] = [
  { label: "H", title: "Heading", before: "## ", line: true },
  { label: "B", title: "Bold", before: "**", after: "**" },
  { label: "I", title: "Italic", before: "*", after: "*" },
  { label: "• List", title: "Bulleted list", before: "- ", line: true },
  { label: "❝ Quote", title: "Quote", before: "> ", line: true },
  { label: "🔗 Link", title: "Link", before: "[", after: "](https://)" },
];

export default function MarkdownEditor({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const [value, setValue] = useState(defaultValue || "");
  const [preview, setPreview] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  function apply(t: (typeof TOOLS)[number]) {
    const el = ref.current; if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const sel = value.slice(s, e);
    let next: string, cursor: number;
    if (t.line) {
      const lineStart = value.lastIndexOf("\n", s - 1) + 1;
      next = value.slice(0, lineStart) + t.before + value.slice(lineStart);
      cursor = e + t.before.length;
    } else {
      next = value.slice(0, s) + t.before + (sel || "text") + (t.after || "") + value.slice(e);
      cursor = s + t.before.length + (sel || "text").length;
    }
    setValue(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(cursor, cursor); });
  }

  return (
    <div className="overflow-hidden rounded border border-slate-300 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        {!preview && TOOLS.map((t) => (
          <button key={t.label} type="button" title={t.title} onClick={() => apply(t)} className="rounded px-2.5 py-1 text-sm font-semibold text-slate-700 hover:bg-white hover:ring-1 hover:ring-slate-300">{t.label}</button>
        ))}
        <button type="button" onClick={() => setPreview((p) => !p)} className="ml-auto rounded px-3 py-1 text-sm font-medium text-blue-800 hover:bg-white">
          {preview ? "Back to editing" : "Preview"}
        </button>
      </div>
      <textarea ref={ref} name={name} value={value} onChange={(e) => setValue(e.target.value)} rows={16}
        className={`w-full resize-y p-4 font-mono text-sm leading-relaxed ${preview ? "hidden" : ""}`} />
      {preview && <div className="min-h-[200px] bg-[#f8f4ec] p-6"><Markdown>{value || "_Nothing to preview yet._"}</Markdown></div>}
    </div>
  );
}
