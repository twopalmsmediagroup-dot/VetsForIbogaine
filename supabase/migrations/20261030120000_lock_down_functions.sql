-- current_role_name() already existed in the live project but was never committed; record it here.
create or replace function public.current_role_name() returns text language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = (select auth.uid()) $$;

-- Trigger-only function: nobody should be able to call it through the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Only meaningful for signed-in users.
revoke execute on function public.current_role_name() from public, anon;

-- is_staff() / is_admin() stay executable by anon + authenticated on purpose:
-- the RLS policies call them, and they only ever report on the caller's own role.
