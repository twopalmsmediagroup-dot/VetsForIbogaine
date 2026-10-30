"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { serverClient, getStaffUser } from "@/lib/supabase/server";
import { ENTITIES, SETTINGS_GROUPS, slugify, type Field } from "@/lib/admin/entities";
import { importPreviewImage } from "@/lib/og";

function coerce(f: Field, fd: FormData): unknown {
  const raw = fd.get(f.name);
  switch (f.type) {
    case "checkbox": return raw === "on";
    case "number": { const n = Number(raw); return raw === null || raw === "" || Number.isNaN(n) ? (f.defaultValue ?? null) : Math.trunc(n); }
    case "date": return raw ? String(raw) : null;
    case "gallery": return fd.getAll(f.name).map((v) => String(v).trim()).filter((v) => /^https:\/\//.test(v));
    default: { const v = String(raw ?? "").trim(); return v === "" ? null : v; }
  }
}

async function requireStaff() {
  const user = await getStaffUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) redirect("/admin/login");
  return user;
}

async function requireAdmin(back: string) {
  const user = await requireStaff();
  if (user.role !== "admin") redirect(`${back}?error=${enc("Only administrators can do that.")}`);
  return user;
}

function enc(s: string) { return encodeURIComponent(s); }

export async function saveEntity(entityKey: string, id: string | null, formData: FormData) {
  await requireStaff();
  const entity = ENTITIES[entityKey];
  if (!entity) throw new Error("Unknown content type");
  const row: Record<string, unknown> = {};
  for (const f of entity.fields) row[f.name] = coerce(f, formData);

  const title = String(row[entity.titleField] ?? "");
  if (!title) redirect(`/admin/${entityKey}/${id ?? "new"}?error=${enc(`${entity.fields.find((f) => f.name === entity.titleField)?.label} is required.`)}`);
  if (entityKey === "articles" && row.article_type === "media_coverage" && !row.source_url && !row.body) {
    redirect(`/admin/${entityKey}/${id ?? "new"}?error=${enc("“In the News” items need a Source link (or article text).")}`);
  }
  if ("slug" in row) row.slug = slugify(String(row.slug || title)) || `item-${Date.now()}`;
  for (const f of entity.fields) if (f.type === "url" && row[f.name] && !/^https?:\/\//i.test(String(row[f.name]))) row[f.name] = `https://${row[f.name]}`;

  const supabase = await serverClient();
  // Outside coverage with no cover image: pull in the publisher's preview image.
  if (entityKey === "articles" && row.source_url && !row.cover_image_url) {
    row.cover_image_url = await importPreviewImage(supabase, String(row.source_url));
  }
  const res = id
    ? await supabase.from(entity.table).update(row).eq("id", id).select("id").single()
    : await supabase.from(entity.table).insert(row).select("id").single();

  if (res.error) {
    const msg = res.error.code === "23505" ? "That web address is already used by another item. Change the Web address field."
      : res.error.code === "23514" && res.error.message.includes("consent") ? "To publish this story, first tick “Written consent on file”."
      : res.error.message;
    redirect(`/admin/${entityKey}/${id ?? "new"}?error=${enc(msg)}`);
  }
  revalidatePath("/", "layout");
  redirect(`/admin/${entityKey}/${res.data!.id}?saved=1`);
}

export async function deleteEntity(entityKey: string, id: string) {
  await requireStaff();
  const entity = ENTITIES[entityKey];
  if (!entity) throw new Error("Unknown content type");
  const supabase = await serverClient();
  const { error, count } = await supabase.from(entity.table).delete({ count: "exact" }).eq("id", id);
  if (error || !count) redirect(`/admin/${entityKey}/${id}?error=${enc(error?.message || "Only administrators can delete items. Set it to Draft instead.")}`);
  revalidatePath("/", "layout");
  redirect(`/admin/${entityKey}?deleted=1`);
}

export async function saveSettings(formData: FormData) {
  await requireStaff();
  const row: Record<string, unknown> = {};
  for (const g of SETTINGS_GROUPS) for (const f of g.fields) row[f.name] = coerce(f, formData);
  const supabase = await serverClient();
  const { error } = await supabase.from("site_settings").update(row).eq("id", 1);
  if (error) redirect(`/admin/settings?error=${enc(error.message)}`);
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const supabase = await serverClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("[admin sign-in]", error.status, error.code, error.message);
    const msg =
      error.code === "invalid_credentials" ? "Incorrect email or password. Passwords are case-sensitive — check that your browser didn't autofill a different saved password."
      : error.code === "email_not_confirmed" ? "This account hasn't been confirmed yet. In Supabase, open the user and confirm the email."
      : `Sign-in failed: ${error.message}`;
    redirect(`/admin/login?error=${enc(msg)}`);
  }
  redirect("/admin");
}

export async function sendReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const h = await headers();
  const origin = h.get("origin") || `https://${h.get("host")}`;
  const supabase = await serverClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/admin/auth/callback?next=/admin/account` });
  redirect(`/admin/login?info=${enc("If that email has an account, a reset link is on its way.")}`);
}

export async function signOut() {
  const supabase = await serverClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updatePassword(formData: FormData) {
  const pw = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");
  if (pw.length < 10) redirect(`/admin/account?error=${enc("Use at least 10 characters.")}`);
  if (pw !== confirm) redirect(`/admin/account?error=${enc("The two passwords don't match.")}`);
  const supabase = await serverClient();
  const { error } = await supabase.auth.updateUser({ password: pw });
  if (error) redirect(`/admin/account?error=${enc(error.message)}`);
  redirect("/admin/account?saved=1");
}

export async function setInquiryHandled(id: string, handled: boolean) {
  await requireStaff();
  const supabase = await serverClient();
  const { error } = await supabase.from("inquiries").update({ handled }).eq("id", id);
  if (error) redirect(`/admin/inbox?error=${enc(error.message)}`);
  revalidatePath("/admin/inbox");
}

export async function deleteInquiry(id: string) {
  await requireAdmin("/admin/inbox");
  const supabase = await serverClient();
  const { error, count } = await supabase.from("inquiries").delete({ count: "exact" }).eq("id", id);
  if (error || !count) redirect(`/admin/inbox?error=${enc(error?.message || "That message couldn't be deleted.")}`);
  revalidatePath("/admin/inbox");
}

export async function addTeamMember(formData: FormData) {
  await requireAdmin("/admin/team");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = formData.get("role") === "admin" ? "admin" : "editor";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) redirect(`/admin/team?error=${enc("Enter a valid email.")}`);
  const supabase = await serverClient();
  const { error } = await supabase.from("admin_allowlist").upsert({ email, role });
  if (error) redirect(`/admin/team?error=${enc(error.message)}`);
  // If they already have an account, apply the role now.
  const { error: pErr } = await supabase.from("profiles").update({ role }).eq("email", email);
  if (pErr) redirect(`/admin/team?error=${enc(pErr.message)}`);
  revalidatePath("/admin/team");
  redirect("/admin/team?saved=1");
}

export async function removeTeamMember(email: string) {
  const me = await requireAdmin("/admin/team");
  if (me.email?.toLowerCase() === email.toLowerCase()) redirect(`/admin/team?error=${enc("You can't remove yourself.")}`);
  const supabase = await serverClient();
  const { error } = await supabase.from("admin_allowlist").delete().eq("email", email);
  if (error) redirect(`/admin/team?error=${enc(error.message)}`);
  const { error: pErr } = await supabase.from("profiles").update({ role: "viewer" }).eq("email", email);
  if (pErr) redirect(`/admin/team?error=${enc(pErr.message)}`);
  revalidatePath("/admin/team");
}

export async function fetchMissingThumbnails() {
  await requireStaff();
  const supabase = await serverClient();
  const { data } = await supabase.from("articles").select("id, source_url").not("source_url", "is", null).is("cover_image_url", null).limit(25);
  let added = 0;
  for (const a of data ?? []) {
    const url = await importPreviewImage(supabase, a.source_url as string);
    if (url) {
      const { error } = await supabase.from("articles").update({ cover_image_url: url }).eq("id", a.id);
      if (!error) added++;
    }
  }
  revalidatePath("/", "layout");
  const total = data?.length ?? 0;
  const msg = total === 0 ? "Every article with a source link already has a thumbnail."
    : `Added ${added} of ${total} thumbnail${total === 1 ? "" : "s"}.${added < total ? " Some sites don't provide a preview image — upload one manually for those." : ""}`;
  redirect(`/admin/articles?info=${encodeURIComponent(msg)}`);
}

/** Turns a "story" contact submission into a draft Veteran Story (copying the photo into the public media bucket). */
export async function createStoryFromInquiry(inquiryId: string) {
  await requireStaff();
  const supabase = await serverClient();
  const { data: q } = await supabase.from("inquiries").select("*").eq("id", inquiryId).single();
  if (!q) redirect(`/admin/inbox?error=${enc("Submission not found.")}`);

  let photo_url: string | null = null;
  if (q.photo_path) {
    const { data: blob } = await supabase.storage.from("submissions").download(q.photo_path);
    if (blob) {
      const path = `stories/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;
      const { error } = await supabase.storage.from("media").upload(path, blob, { contentType: blob.type || "image/jpeg", cacheControl: "31536000" });
      if (!error) photo_url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
    }
  }
  const base = slugify(q.name) || "story";
  const { data: story, error } = await supabase.from("veteran_stories").insert({
    name: q.name, service: q.service, short_bio: q.short_bio, photo_url,
    consent_on_file: !!q.consent_share, status: "draft",
    slug: `${base}-${Math.random().toString(36).slice(2, 6)}`,
  }).select("id").single();
  if (error || !story) redirect(`/admin/inbox?error=${enc("Couldn't create the story: " + (error?.message ?? "unknown error"))}`);
  await supabase.from("inquiries").update({ handled: true }).eq("id", inquiryId);
  revalidatePath("/admin/inbox");
  redirect(`/admin/stories/${story!.id}?info=${enc("Draft created from the submission. Review it, then set Visibility to Published and Save.")}`);
}
