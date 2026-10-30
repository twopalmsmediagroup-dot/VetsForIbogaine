"use client";
import { useActionState } from "react";
import { submitInquiry, type FormState } from "@/app/actions";
import { ArrowRight } from "./Icons";

const field = "mt-1 w-full rounded-[2px] border border-line bg-white px-4 py-3 text-sm text-ink focus:border-gold-500";

export default function InquiryForm({ defaultType = "general" }: { defaultType?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitInquiry, null);
  if (state?.ok) {
    return <div role="status" className="border-l-2 border-gold-500 bg-white p-6 text-navy-900">{state.message}</div>;
  }
  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="i-name" className="text-sm font-semibold text-navy-900">Name *</label>
        <input id="i-name" name="name" required autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="i-email" className="text-sm font-semibold text-navy-900">Email *</label>
        <input id="i-email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="i-org" className="text-sm font-semibold text-navy-900">Organization</label>
        <input id="i-org" name="organization" autoComplete="organization" className={field} />
      </div>
      <div>
        <label htmlFor="i-type" className="text-sm font-semibold text-navy-900">I'm reaching out about</label>
        <select id="i-type" name="inquiry_type" defaultValue={defaultType} className={field}>
          <option value="join">Joining the consortium</option>
          <option value="partner">Partnering with us</option>
          <option value="media">Media inquiry</option>
          <option value="story">Sharing my story (veterans)</option>
          <option value="general">General question</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="i-msg" className="text-sm font-semibold text-navy-900">Message</label>
        <textarea id="i-msg" name="message" rows={6} maxLength={5000} className={field} />
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">Please don't share personal medical information. We can't provide medical advice or treatment referrals.</p>
        <button type="submit" disabled={pending} className="btn btn-gold justify-center disabled:opacity-60">{pending ? "Sending…" : "Send message"} <ArrowRight /></button>
      </div>
      {state && !state.ok && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{state.message}</p>}
    </form>
  );
}
