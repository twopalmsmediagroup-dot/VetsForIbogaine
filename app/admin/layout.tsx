import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "Dashboard", template: "%s · VFI Dashboard" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-100 font-sans text-slate-900">{children}</div>;
}
