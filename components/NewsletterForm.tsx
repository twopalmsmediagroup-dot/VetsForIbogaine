"use client";
import { useActionState } from "react";
import { subscribe, type FormState } from "@/app/actions";
import { ArrowRight } from "./Icons";

export default function NewsletterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, null);
  return (
    <form action={action} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input id="nl-email" name="email" type="email" required autoComplete="email" placeholder="Your email address"
          className="min-w-0 flex-1 rounded-[2px] border border-white/20 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70" />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <button type="submit" disabled={pending} className="btn btn-gold justify-center disabled:opacity-60">
          {pending ? "Subscribing…" : "Subscribe"} <ArrowRight />
        </button>
      </div>
      <p className="mt-2 text-xs text-white/60" role="status" aria-live="polite">
        {state ? <span className={state.ok ? "text-gold-300" : "text-red-300"}>{state.message}</span> : "We respect your privacy. Unsubscribe at any time."}
      </p>
    </form>
  );
}
