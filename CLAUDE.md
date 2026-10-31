# Vets for Ibogaine — project guide for Claude Code

Education/advocacy consortium website. **Independent of MediaBridge** — never reuse its Supabase project, env vars or Vercel project.

## Stack
- Next.js 15 (App Router, TypeScript, React 19) · Tailwind CSS v4 (tokens in `app/globals.css` `@theme`)
- Supabase project `zbmayuyrwbzlmkauqady` ("Vets For Ibogaine"): Postgres + Auth + Storage bucket `media`
- Vercel project `vets-for-ibogaine`. Work on `staging`, then fast-forward `preview` to it — Vercel builds the private preview from `preview` (https://vets-for-ibogaine-git-preview-media-bridge.vercel.app); git pushes don't always trigger a build, so start one from Vercel if needed. Branch `main` → production.
- Main working thread: the Claude session "Vets For Ibogaine — Website Builder (main thread)". Avoid parallel sessions pushing to the same branches. **Never push to `main`, promote, or touch DNS (GoDaddy, VetsForIbogaine.org) without Amy's explicit approval.**

## Structure
- `app/(site)/` public pages (ISR, `revalidate = 300`; admin saves call `revalidatePath("/", "layout")`)
- `app/admin/` dashboard. `(dash)/[entity]` is a generic CRUD driven by `lib/admin/entities.ts` — add a field there + a DB column and the form, validation and save all follow.
- `lib/data.ts` public reads via cookie-free anon client (`lib/supabase/public.ts`). Admin uses `lib/supabase/server.ts` (session cookies). Middleware only guards `/admin`.
- Content is Markdown (react-markdown + remark-gfm), styled by `.prose-vfi`.

## Security model
- Roles in `public.profiles.role`: admin / editor / viewer. New auth users get a role from `public.admin_allowlist` via trigger `on_auth_user_created`.
- RLS: public reads `status = 'published'` only; staff (admin/editor) insert/update; only admins delete. Inquiries/subscribers are insert-only for anon.
- Never expose a service-role key to the client. The app only uses the publishable (anon) key.

## Content rules (positioning — important)
- Vets for Ibogaine does **not** conduct clinical research, provide treatment, arrange treatment access, or endorse providers. Never write copy implying otherwise.
- Organizations: `relationship = confirmed_partner` only for formal partners; everything else is `resource_listing` and labeled "Informational Listing".
- Medical claims need a cited source. Always note ibogaine is Schedule I in the U.S. and not FDA-approved where risks/benefits are discussed.
- Brand: deep navy / metallic gold / warm white. Fonts: Libre Caslon Display (headings), Public Sans (body), Cinzel (wordmark). Mission framework: ACE — Advocacy • Collaboration • Education (tagline is editable in Settings). Seven consortium focus areas live in `pages` where `kind = 'consortium_area'`.

## Schema changes
Add a SQL file in `supabase/migrations/` and apply it to the Supabase project; keep `lib/types.ts` and `lib/admin/entities.ts` in sync.
