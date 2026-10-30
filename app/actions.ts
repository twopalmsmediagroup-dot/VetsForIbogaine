"use server";
import { publicClient } from "@/lib/supabase/public";

export type FormState = { ok: boolean; message: string } | null;

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("company")) return { ok: true, message: "Thank you for subscribing." }; // honeypot
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) return { ok: false, message: "Please enter a valid email address." };
  const { error } = await publicClient().from("subscribers").insert({ email });
  if (error && error.code !== "23505") return { ok: false, message: "Something went wrong. Please try again." };
  return { ok: true, message: "Thank you — you're on the list." };
}

export async function submitInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("company")) return { ok: true, message: "Thank you. We'll be in touch." }; // honeypot
  const name = String(formData.get("name") || "").trim().slice(0, 200);
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const organization = String(formData.get("organization") || "").trim().slice(0, 200) || null;
  const typeRaw = String(formData.get("inquiry_type") || "general");
  const inquiry_type = ["join", "partner", "media", "story", "general"].includes(typeRaw) ? typeRaw : "general";
  const message = String(formData.get("message") || "").trim().slice(0, 5000) || null;
  if (!name) return { ok: false, message: "Please enter your name." };
  if (!EMAIL.test(email)) return { ok: false, message: "Please enter a valid email address." };

  const row: Record<string, unknown> = { name, email, organization, inquiry_type, message };
  if (inquiry_type === "story") {
    const short_bio = String(formData.get("short_bio") || "").trim();
    const words = short_bio ? short_bio.split(/\s+/).length : 0;
    if (!short_bio) return { ok: false, message: "Please add your short bio." };
    if (words > 150) return { ok: false, message: "Please shorten your bio to 150 words or fewer." };
    if (formData.get("consent_share") !== "on") return { ok: false, message: "Please tick the permission box so we can share your story." };
    const photo = String(formData.get("photo_path") || "");
    row.short_bio = short_bio.slice(0, 1500);
    row.service = String(formData.get("service") || "").trim().slice(0, 200) || null;
    row.photo_path = /^stories\/[A-Za-z0-9._-]+$/.test(photo) ? photo : null;
    row.consent_share = true;
    row.organization = null;
  }
  const { error } = await publicClient().from("inquiries").insert(row);
  if (error) return { ok: false, message: "Something went wrong. Please try again." };
  return {
    ok: true,
    message: inquiry_type === "story"
      ? "Thank you for sharing your story. We review every submission before posting and may reach out by email first."
      : "Thank you. Your message has been received and we'll be in touch.",
  };
}
