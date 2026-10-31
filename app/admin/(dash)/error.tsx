"use client";

export default function DashError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg rounded-lg bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-sm text-slate-600">This screen couldn&apos;t load. Your saved work is safe — try again, and if it keeps happening, sign out and back in.</p>
      {error.digest && <p className="mt-2 text-xs text-slate-400">Reference: {error.digest}</p>}
      <button type="button" onClick={reset} className="mt-6 rounded bg-[#0b1d36] px-4 py-2 text-sm font-semibold text-white">Try again</button>
    </div>
  );
}
