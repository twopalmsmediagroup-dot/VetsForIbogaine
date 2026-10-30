-- Applied to Supabase project zbmayuyrwbzlmkauqady on 2026-10-30.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, full_name text,
  role text not null default 'viewer' check (role in ('admin','editor','viewer')),
  created_at timestamptz not null default now()
);
create table public.admin_allowlist (
  email text primary key,
  role text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, coalesce((select a.role from public.admin_allowlist a where lower(a.email) = lower(new.email)), 'viewer'));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select role in ('admin','editor') from public.profiles where id = (select auth.uid())), false) $$;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select role = 'admin' from public.profiles where id = (select auth.uid())), false) $$;
create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;

create table public.pages (
  id uuid primary key default gen_random_uuid(), slug text not null unique,
  kind text not null default 'page' check (kind in ('page','consortium_area','legal')),
  title text not null, eyebrow text, summary text, body text, hero_image_url text, icon text,
  sort_order int not null default 0, status text not null default 'draft' check (status in ('draft','published')),
  seo_title text, seo_description text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.articles (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, excerpt text, body text,
  cover_image_url text, author text,
  article_type text not null default 'editorial' check (article_type in ('editorial','research_summary','media_coverage','announcement')),
  area_slug text, source_name text, source_url text, references_md text, featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published')), published_at date default current_date,
  seo_description text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.resources (
  id uuid primary key default gen_random_uuid(), title text not null, description text, url text,
  resource_type text not null default 'other' check (resource_type in ('study','report','guide','policy','video','other')),
  area_slug text, citation text, published_date date, sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.organizations (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, description text, website text, logo_url text,
  org_type text not null default 'other' check (org_type in ('research','treatment','advocacy','policy','government','funder','media','other')),
  relationship text not null default 'resource_listing' check (relationship in ('confirmed_partner','resource_listing')),
  area_slug text, location text, featured boolean not null default false, sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.timeline_entries (
  id uuid primary key default gen_random_uuid(), year int not null, date_label text, title text not null, description text, era text,
  source_name text, source_url text, image_url text, sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  hero_eyebrow text, hero_title text, hero_highlight text, hero_body text, hero_image_url text,
  mission_title text, mission_body text, mission_image_url text, about_title text, about_body text, about_image_url text,
  consortium_title text, consortium_body text, partners_title text, partners_body text,
  timeline_title text, timeline_body text, timeline_image_url text, news_title text, news_body text,
  newsletter_title text, newsletter_body text, footer_tagline text, contact_email text, donate_url text,
  linkedin_url text, instagram_url text, youtube_url text, x_url text,
  support_message text, advocacy_text text, collaboration_text text, education_text text, tagline text, disclaimer_short text,
  updated_at timestamptz not null default now()
);
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254),
  created_at timestamptz not null default now()
);
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) <= 200),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254),
  organization text check (length(organization) <= 200),
  inquiry_type text not null default 'general' check (inquiry_type in ('join','partner','media','general')),
  message text check (length(message) <= 5000), handled boolean not null default false,
  created_at timestamptz not null default now()
);

create trigger t_pages_upd before update on public.pages for each row execute function public.set_updated_at();
create trigger t_articles_upd before update on public.articles for each row execute function public.set_updated_at();
create trigger t_resources_upd before update on public.resources for each row execute function public.set_updated_at();
create trigger t_orgs_upd before update on public.organizations for each row execute function public.set_updated_at();
create trigger t_timeline_upd before update on public.timeline_entries for each row execute function public.set_updated_at();
create trigger t_settings_upd before update on public.site_settings for each row execute function public.set_updated_at();
create index articles_status_date on public.articles (status, published_at desc);
create index articles_area on public.articles (area_slug);
create index resources_area on public.resources (area_slug);
create index orgs_area on public.organizations (area_slug);
create index timeline_year on public.timeline_entries (year, sort_order);

alter table public.profiles enable row level security;
alter table public.admin_allowlist enable row level security;
alter table public.pages enable row level security;
alter table public.articles enable row level security;
alter table public.resources enable row level security;
alter table public.organizations enable row level security;
alter table public.timeline_entries enable row level security;
alter table public.site_settings enable row level security;
alter table public.subscribers enable row level security;
alter table public.inquiries enable row level security;

create policy "own profile or admin reads" on public.profiles for select to authenticated using (id = (select auth.uid()) or (select public.is_admin()));
create policy "admin updates profiles" on public.profiles for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin manages allowlist" on public.admin_allowlist for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
do $$ declare t text; begin
  foreach t in array array['pages','articles','resources','organizations','timeline_entries'] loop
    execute format('create policy "public reads published" on public.%I for select to anon, authenticated using (status = ''published'' or (select public.is_staff()))', t);
    execute format('create policy "staff inserts" on public.%I for insert to authenticated with check ((select public.is_staff()))', t);
    execute format('create policy "staff updates" on public.%I for update to authenticated using ((select public.is_staff())) with check ((select public.is_staff()))', t);
    execute format('create policy "admin deletes" on public.%I for delete to authenticated using ((select public.is_admin()))', t);
  end loop; end $$;
create policy "public reads settings" on public.site_settings for select to anon, authenticated using (true);
create policy "staff updates settings" on public.site_settings for update to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "anyone subscribes" on public.subscribers for insert to anon, authenticated with check (true);
create policy "staff reads subscribers" on public.subscribers for select to authenticated using ((select public.is_staff()));
create policy "admin deletes subscribers" on public.subscribers for delete to authenticated using ((select public.is_admin()));
create policy "anyone submits inquiry" on public.inquiries for insert to anon, authenticated with check (handled = false);
create policy "staff reads inquiries" on public.inquiries for select to authenticated using ((select public.is_staff()));
create policy "staff updates inquiries" on public.inquiries for update to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "admin deletes inquiries" on public.inquiries for delete to authenticated using ((select public.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media','media', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','application/pdf']);
create policy "staff uploads media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and (select public.is_staff()));
create policy "staff updates media" on storage.objects for update to authenticated using (bucket_id = 'media' and (select public.is_staff()));
create policy "staff deletes media" on storage.objects for delete to authenticated using (bucket_id = 'media' and (select public.is_staff()));
