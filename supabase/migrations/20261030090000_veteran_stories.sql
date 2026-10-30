create table public.veteran_stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  service text,
  photo_url text,
  quote text,
  short_bio text,
  full_story text,
  consent_on_file boolean not null default false,
  sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_requires_consent check (status <> 'published' or consent_on_file)
);
create trigger t_stories_upd before update on public.veteran_stories for each row execute function public.set_updated_at();
alter table public.veteran_stories enable row level security;
create policy "public reads published" on public.veteran_stories for select to anon, authenticated
  using ((status = 'published' and consent_on_file) or (select public.is_staff()));
create policy "staff inserts" on public.veteran_stories for insert to authenticated with check ((select public.is_staff()));
create policy "staff updates" on public.veteran_stories for update to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "admin deletes" on public.veteran_stories for delete to authenticated using ((select public.is_admin()));

alter table public.inquiries drop constraint if exists inquiries_inquiry_type_check;
alter table public.inquiries add constraint inquiries_inquiry_type_check check (inquiry_type in ('join','partner','media','story','general'));
