"use client";
import { useEffect, useState } from "react";

/** Warns before leaving a form with unsaved edits, and shows an "Unsaved changes" hint in the save bar. */
export default function UnsavedGuard({ formId }: { formId: string }) {
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    const form = document.getElementById(formId);
    if (!form) return;
    const mark = () => setDirty(true);
    const clear = () => setDirty(false);
    form.addEventListener("input", mark);
    form.addEventListener("change", mark);
    form.addEventListener("submit", clear);
    return () => { form.removeEventListener("input", mark); form.removeEventListener("change", mark); form.removeEventListener("submit", clear); };
  }, [formId]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  return dirty
    ? <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700"><span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" aria-hidden="true" />Unsaved changes</span>
    : null;
}
