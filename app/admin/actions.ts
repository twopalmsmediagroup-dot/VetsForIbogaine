"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { serverClient, getStaffUser } from "@/lib/supabase/server";
import { ENTITIES, SETTINGS_GROUPS, slugify, type Field } from "@/lib/admin/entities";

function coerce(f: Field, fd: FormData): unknown {
  const raw = fd.get(f.name);
  switch (f.type) {
    case "checkbox": return raw === "on";
    case "number": { const n = Number(raw); return raw === null || raw === "" || Number.isNaN(n) ? (f.defaultValue ?? null) : Math.trunc(n); }
    case "date": return raw ? String(raw) : null;
    default: { const v = String(raw ?? "").trim(); return v === "" ? null : v; }
  }
}

async function requireStaff() {
  const user = await getStaffUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) redirect("/admin/login");
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
  if ("slug" in row) row.slug = slugify(String(row.slug || title)) || `item-${Date.now()}`;
  for (const f of entity.fields) if (f.type === "url" && row[f.name] && !/^https?:\/\//i.test(String(row[f.name]))) row[f.name] = `https://${row[f.name]}`;

  const supabase = await serverClient();
  const res = id
    ? await supabase.from(entity.table).update(row).eq("id", id).select("id").single()
    : await supabase.from(entity.table).insert(row).select("id").single();

  if (res.error) {
    const msg = res.error.code === "23505" ? "That web address is already used by another item. Change the Web address field." : res.error.message;
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
  await supabase.from("inquiries").update({ handled }).eq("id", id);
  revalidatePath("/admin/inbox");
}

export async function deleteInquiry(id: string) {
  await requireStaff();
  const supabase = await serverClient();
  await supabase.from("inquiries").delete().eq("id", id);
  revalidatePath("/admin/inbox");
}

export async function addTeamMember(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = formData.get("role") === "admin" ? "admin" : "editor";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) redirect(`/admin/team?error=${enc("Enter a valid email.")}`);
  const supabase = await serverClient();
  const { error } = await supabase.from("admin_allowlist").upsert({ email, role });
  if (error) redirect(`/admin/team?error=${enc("Only administrators can manage the team.")}`);
  // If they already have an account, apply the role now.
  await supabase.from("profiles").update({ role }).eq("email", email);
  revalidatePath("/admin/team");
  redirect("/admin/team?saved=1");
}

export async function removeTeamMember(email: string) {
  const me = await requireStaff();
  if (me.email?.toLowerCase() === email.toLowerCase()) redirect(`/admin/team?error=${enc("You can't remove yourself.")}`);
  const supabase = await serverClient();
  await supabase.from("admin_allowlist").delete().eq("email", email);
  await supabase.from("profiles").update({ role: "viewer" }).eq("email", email);
  revalidatePath("/admin/team");
}
