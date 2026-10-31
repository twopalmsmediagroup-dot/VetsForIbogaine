-- Anonymous story-photo uploads: only the exact name the contact form generates
-- (stories/<timestamp>-<random>.jpg). Bucket limits (8 MB, jpeg/png/webp) still apply.
alter policy "public uploads story photos" on storage.objects
  with check (bucket_id = 'submissions' and name ~ '^stories/[0-9]{10,16}-[a-z0-9]{4,12}\.jpg$');
