import Image from "next/image";
import { signIn, sendReset } from "../actions";
import Notice from "@/components/admin/Notice";

export default async function Login({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const input = "w-full rounded border border-slate-300 px-3 py-2.5 text-sm";
  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-[#0b1d36] px-4 py-12">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <Image src="/brand/brain-mark.png" alt="" width={541} height={600} className="h-16 w-auto" />
          <h1 className="mt-3 font-[family-name:var(--font-mark)] text-lg font-bold tracking-wide text-[#0b1d36]">VETS FOR IBOGAINE</h1>
          <p className="text-sm text-slate-500">Website dashboard</p>
        </div>
        <div className="mt-6"><Notice sp={sp} /></div>
        {sp.reset ? (
          <form action={sendReset} className="space-y-4">
            <div><label htmlFor="email" className="mb-1 block text-sm font-semibold">Email</label><input id="email" name="email" type="email" required className={input} /></div>
            <button className="w-full rounded bg-[#0b1d36] py-2.5 text-sm font-semibold text-white hover:bg-[#12294a]">Send reset link</button>
            <a href="/admin/login" className="block text-center text-sm text-slate-600 underline">Back to sign in</a>
          </form>
        ) : (
          <form action={signIn} className="space-y-4">
            <div><label htmlFor="email" className="mb-1 block text-sm font-semibold">Email</label><input id="email" name="email" type="email" autoComplete="email" required className={input} /></div>
            <div><label htmlFor="password" className="mb-1 block text-sm font-semibold">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required className={input} /></div>
            <button className="w-full rounded bg-[#0b1d36] py-2.5 text-sm font-semibold text-white hover:bg-[#12294a]">Sign in</button>
            <a href="/admin/login?reset=1" className="block text-center text-sm text-slate-600 underline">Forgot password?</a>
          </form>
        )}
      </div>
    </main>
  );
}
