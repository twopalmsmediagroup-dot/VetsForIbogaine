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
  const inquiry_type = ["join", "partner", "media", "general"].includes(typeRaw) ? typeRaw : "general";
  const message = String(formData.get("message") || "").trim().slice(0, 5000) || null;
  if (!name) return { ok: false, message: "Please enter your name." };
  if (!EMAIL.test(email)) return { ok: false, message: "Please enter a valid email address." };
  const { error } = await publicClient().from("inquiries").insert({ name, email, organization, inquiry_type, message });
  if (error) return { ok: false, message: "Something went wrong. Please try again." };
  return { ok: true, message: "Thank you. Your message has been received and we'll be in touch." };
}
