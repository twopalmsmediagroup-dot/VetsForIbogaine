import Image from "next/image";
import { signIn, sendReset } from "../actions";
import Notice from "@/components/admin/Notice";

export default async function Login({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const input = "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-400/40";
  return (
    <main id="main" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-700 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(#e2c98a 1px, transparent 1px)", backgroundSize: "22px 22px" }} aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gold-400/30">
        <div className="flex flex-col items-center text-center">
          <Image src="/brand/brain-mark.png" alt="" width={541} height={600} className="h-16 w-auto" />
          <h1 className="mt-3 font-[family-name:var(--font-mark)] text-lg font-bold tracking-wide text-navy-900">VETS FOR <span className="gold-text">IBOGAINE</span></h1>
          <p className="text-sm text-slate-500">Website dashboard</p>
        </div>
        <div className="mt-6"><Notice sp={sp} /></div>
        {sp.reset ? (
          <form action={sendReset} className="space-y-4">
            <div><label htmlFor="email" className="mb-1 block text-sm font-semibold">Email</label><input id="email" name="email" type="email" required className={input} /></div>
            <button className="w-full rounded-lg bg-navy-900 shadow-sm py-2.5 text-sm font-semibold text-white hover:bg-navy-800">Send reset link</button>
            <a href="/admin/login" className="block text-center text-sm text-slate-600 underline">Back to sign in</a>
          </form>
        ) : (
          <form action={signIn} className="space-y-4">
            <div><label htmlFor="email" className="mb-1 block text-sm font-semibold">Email</label><input id="email" name="email" type="email" autoComplete="email" required className={input} /></div>
            <div><label htmlFor="password" className="mb-1 block text-sm font-semibold">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required className={input} /></div>
            <button className="w-full rounded-lg bg-navy-900 shadow-sm py-2.5 text-sm font-semibold text-white hover:bg-navy-800">Sign in</button>
            <a href="/admin/login?reset=1" className="block text-center text-sm text-slate-600 underline">Forgot password?</a>
          </form>
        )}
      </div>
    </main>
  );
}
