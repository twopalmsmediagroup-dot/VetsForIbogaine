"use client";
import { useState } from "react";

/** Two-step destructive button: first click arms it, second click submits. */
export default function ConfirmButton({ label = "Delete", confirmLabel = "Click again to permanently delete", className = "" }: { label?: string; confirmLabel?: string; className?: string }) {
  const [armed, setArmed] = useState(false);
  return armed ? (
    <span className="flex items-center gap-2">
      <button type="submit" className={`rounded bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800 ${className}`}>{confirmLabel}</button>
      <button type="button" onClick={() => setArmed(false)} className="text-sm text-slate-600 underline">Cancel</button>
    </span>
  ) : (
    <button type="button" onClick={() => setArmed(true)} className={`rounded px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 ${className}`}>{label}</button>
  );
}
