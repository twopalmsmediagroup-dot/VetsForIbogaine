import { publicClient } from "./supabase/public";
import { SITE_URL } from "./data";

const TYPES: Record<string, string> = { join: "Join the consortium", partner: "Partnership", media: "Media", story: "Veteran story", general: "General" };

/**
 * Emails staff about a new contact-form message via Resend. Does nothing until RESEND_API_KEY is set;
 * never throws, so a mail problem can't break the form.
 */
export async function notifyNewInquiry(i: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    // NOTIFY_TO is an env var (not a site setting) because site_settings is publicly readable.
    let list = process.env.NOTIFY_TO;
    if (!list) {
      const { data: s } = await publicClient().from("site_settings").select("contact_email").eq("id", 1).maybeSingle();
      list = s?.contact_email ?? "";
    }
    const to = String(list).split(",").map((e) => e.trim()).filter(Boolean);
    if (!to.length) return;
    const type = TYPES[String(i.inquiry_type)] ?? "General";
    const name = String(i.name).replace(/[\r\n]+/g, " ");
    const text = [
      `New ${type.toLowerCase()} message from the website.`,
      "",
      `Name: ${name}`,
      `Email: ${i.email}`,
      i.organization && `Organization: ${i.organization}`,
      i.service && `Service: ${i.service}`,
      i.message && `\nMessage:\n${i.message}`,
      i.short_bio && `\nShort bio:\n${i.short_bio}`,
      "",
      `Reply to this email to answer ${name} directly, or open the inbox: ${SITE_URL}/admin/inbox`,
    ].filter(Boolean).join("\n");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || "Vets for Ibogaine <onboarding@resend.dev>",
        to, reply_to: String(i.email),
        subject: `New message: ${type} — ${name}`.slice(0, 200),
        text,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.error("[notify] Resend error", res.status, await res.text());
  } catch (err) {
    console.error("[notify] failed", err);
  }
}
