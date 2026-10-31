-- Anonymous story-photo uploads: only the exact name the contact form generates
-- (stories/<timestamp>-<random>.jpg). Bucket limits (8 MB, jpeg/png/webp) still apply.
drop policy if exists "public uploads story photos" on storage.objects;
create policy "public uploads story photos" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'submissions' and name ~ '^stories/[0-9]{10,16}-[a-z0-9]{4,12}\.jpg$');
