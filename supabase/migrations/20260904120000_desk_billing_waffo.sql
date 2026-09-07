-- Waffo Pancake billing ledger: webhook events → entitlement source of truth.
-- Server-side service role only. RLS enabled with no anon policies — the
-- browser never talks to this table; /api/billing/waffo/* routes do.

create table if not exists public.desk_billing_waffo (
  id uuid primary key default gen_random_uuid(),
  delivery_id text not null unique,          -- webhook delivery id (idempotent dedup)
  mode text not null default 'prod',         -- 'test' | 'prod'
  event_type text not null,                  -- order.completed, subscription.activated, ...
  buyer_email text not null,
  sku text,                                  -- a61_sku from checkout metadata / external ref
  interval text,                             -- monthly | yearly
  order_id text,
  order_status text,
  amount text,
  currency text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists desk_billing_waffo_email_idx
  on public.desk_billing_waffo (buyer_email, created_at desc);

alter table public.desk_billing_waffo enable row level security;

revoke all on table public.desk_billing_waffo from anon, authenticated;
