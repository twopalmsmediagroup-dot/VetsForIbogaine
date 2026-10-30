alter table public.pages add column if not exists gallery text[] not null default '{}';
-- Seeded an 'about-us' page (kind 'page') with a starter bio; edit it in the dashboard.
