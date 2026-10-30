alter table public.inquiries
  add column if not exists service text check (length(service) <= 200),
  add column if not exists short_bio text check (length(short_bio) <= 1500),
  add column if not exists photo_path text check (photo_path ~ '^stories/[A-Za-z0-9._-]+$'),
  add column if not exists consent_share boolean not null default false;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('submissions', 'submissions', false, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "public uploads story photos" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'submissions' and (storage.foldername(name))[1] = 'stories');
create policy "staff reads submissions" on storage.objects for select to authenticated
  using (bucket_id = 'submissions' and (select public.is_staff()));
create policy "staff deletes submissions" on storage.objects for delete to authenticated
  using (bucket_id = 'submissions' and (select public.is_staff()));
