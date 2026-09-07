-- Token-extra consume log. Grants stay on desk_billing_waffo (Waffo pack SKUs).
-- Server-side service role only.

create table if not exists public.desk_extra_usage (
  id uuid primary key default gen_random_uuid(),
  buyer_email text not null,
  extra_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists desk_extra_usage_email_idx
  on public.desk_extra_usage (buyer_email, created_at desc);

alter table public.desk_extra_usage enable row level security;

revoke all on table public.desk_extra_usage from anon, authenticated;
