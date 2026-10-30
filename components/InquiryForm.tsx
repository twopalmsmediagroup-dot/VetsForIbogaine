"use client";
import { useActionState, useRef, useState } from "react";
import { submitInquiry, type FormState } from "@/app/actions";
import { browserClient } from "@/lib/supabase/browser";
import { ArrowRight } from "./Icons";

const field = "mt-1 w-full rounded-[2px] border border-line bg-white px-4 py-3 text-sm text-ink focus:border-gold-500";
const MAX_WORDS = 150;
const countWords = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

/** Shrinks a phone photo to max 1600px JPEG before upload. */
async function resizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return await new Promise<Blob>((res) => canvas.toBlob((b) => res(b ?? file), "image/jpeg", 0.85));
}

export default function InquiryForm({ defaultType = "general" }: { defaultType?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitInquiry, null);
  const [type, setType] = useState(defaultType);
  const [bio, setBio] = useState("");
  const [service, setService] = useState("");
  const [consent, setConsent] = useState(false);
  const [photoPath, setPhotoPath] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const isStory = type === "story";
  const words = countWords(bio);

  async function onPhoto(file: File) {
    setLocalError("");
    if (!file.type.startsWith("image/")) return setLocalError("Please choose a photo (JPG or PNG).");
    setUploading(true);
    try {
      const blob = await resizeImage(file);
      const path = `stories/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.jpg`;
      const { error } = await browserClient().storage.from("submissions").upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (error) throw error;
      setPhotoPath(path);
      setPreview(URL.createObjectURL(blob));
    } catch {
      setLocalError("The photo couldn't be uploaded. Please try a different photo.");
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!isStory) return;
    if (uploading) { e.preventDefault(); return setLocalError("Please wait for your photo to finish uploading."); }
    if (!bio.trim()) { e.preventDefault(); return setLocalError("Please add your short bio."); }
    if (words > MAX_WORDS) { e.preventDefault(); return setLocalError(`Please shorten your bio to ${MAX_WORDS} words or fewer.`); }
    if (!consent) { e.preventDefault(); return setLocalError("Please tick the permission box so we can share your story."); }
  }

  if (state?.ok) {
    return <div role="status" className="border-l-2 border-gold-500 bg-white p-6 text-navy-900">{state.message}</div>;
  }
  return (
    <form action={action} onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="i-type" className="text-sm font-semibold text-navy-900">I&apos;m reaching out to</label>
        <select id="i-type" name="inquiry_type" value={type} onChange={(e) => { setType(e.target.value); setLocalError(""); }} className={field}>
          <option value="story">Add my story (veterans)</option>
          <option value="join">Join the consortium</option>
          <option value="partner">Partner with Vets for Ibogaine</option>
          <option value="media">Make a media inquiry</option>
          <option value="general">Ask a general question</option>
        </select>
      </div>
      <div>
        <label htmlFor="i-name" className="text-sm font-semibold text-navy-900">{isStory ? "Name to display *" : "Name *"}</label>
        <input id="i-name" name="name" required autoComplete="name" className={field} />
        {isStory && <p className="mt-1 text-xs text-muted">Use the name you&apos;re comfortable sharing publicly, e.g. first name and last initial.</p>}
      </div>
      <div>
        <label htmlFor="i-email" className="text-sm font-semibold text-navy-900">Email *</label>
        <input id="i-email" name="email" type="email" required autoComplete="email" className={field} />
        {isStory && <p className="mt-1 text-xs text-muted">Never published. We may contact you before posting.</p>}
      </div>

      {isStory ? (
        <>
          <div className="sm:col-span-2">
            <label htmlFor="i-service" className="text-sm font-semibold text-navy-900">Service</label>
            <input id="i-service" name="service" value={service} onChange={(e) => setService(e.target.value)} maxLength={200} placeholder="e.g. U.S. Army · Iraq, 2004–2010" className={field} />
          </div>
          <div className="sm:col-span-2">
            <span className="text-sm font-semibold text-navy-900">Your photo</span>
            <input type="hidden" name="photo_path" value={photoPath} />
            <div className="mt-1 flex items-center gap-4 rounded-[2px] border border-dashed border-line bg-white p-4">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Your photo" className="h-24 w-20 rounded-[2px] object-cover" />
              ) : (
                <div className="flex h-24 w-20 items-center justify-center rounded-[2px] bg-paper-2 text-2xl text-muted" aria-hidden="true">+</div>
              )}
              <div>
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn btn-outline !px-4 !py-2 disabled:opacity-60">
                  {uploading ? "Uploading…" : preview ? "Change photo" : "Choose photo"}
                </button>
                <p className="mt-2 text-xs text-muted">A clear photo of you. Optional.</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onPhoto(f); e.target.value = ""; }} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <div className="flex items-baseline justify-between">
              <label htmlFor="i-bio" className="text-sm font-semibold text-navy-900">Your story — short bio *</label>
              <span className={`text-xs font-semibold ${words > MAX_WORDS ? "text-red-700" : "text-muted"}`} aria-live="polite">{words} / {MAX_WORDS} words</span>
            </div>
            <textarea id="i-bio" name="short_bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={7} maxLength={1500}
              placeholder="Who you are, your service, and what your experience with ibogaine was like — in your own words." className={field} />
          </div>
          <label className="flex items-start gap-3 text-sm text-ink/90 sm:col-span-2">
            <input type="checkbox" name="consent_share" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#0b1d36]" />
            <span>I give Vets for Ibogaine permission to publish my name, photo and story on its website. I confirm this is my own experience and that I own or have rights to this photo. I understand stories are reviewed before posting and I can ask for mine to be removed at any time.</span>
          </label>
        </>
      ) : (
        <>
          <div className="sm:col-span-2">
            <label htmlFor="i-org" className="text-sm font-semibold text-navy-900">Organization</label>
            <input id="i-org" name="organization" autoComplete="organization" className={field} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="i-msg" className="text-sm font-semibold text-navy-900">Message</label>
            <textarea id="i-msg" name="message" rows={6} maxLength={5000} className={field} />
          </div>
        </>
      )}

      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">Please don&apos;t share personal medical information beyond what you&apos;re comfortable publishing. We can&apos;t provide medical advice or treatment referrals.</p>
        <button type="submit" disabled={pending || uploading} className="btn btn-gold shrink-0 justify-center disabled:opacity-60">
          {pending ? "Sending…" : isStory ? "Submit my story" : "Send message"} <ArrowRight />
        </button>
      </div>
      {(localError || (state && !state.ok)) && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{localError || state?.message}</p>}
    </form>
  );
}
