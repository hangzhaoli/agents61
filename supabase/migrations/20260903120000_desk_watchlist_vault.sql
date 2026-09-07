-- Agents61 desk sync: watchlist + strategy vault (server-side service role only)
-- RLS enabled with no anon policies — browser never talks to these tables directly.

create table if not exists public.desk_watchlist_items (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  client_id text not null,
  symbol text not null,
  name text not null,
  kind text not null check (kind in ('equity', 'crypto', 'private')),
  note text not null default '',
  alerts jsonb not null default '{}'::jsonb,
  added_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_email, symbol, kind),
  unique (user_email, client_id)
);

create table if not exists public.desk_strategy_vault (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  client_id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_email, client_id)
);

create index if not exists desk_watchlist_items_user_email_idx
  on public.desk_watchlist_items (user_email);

create index if not exists desk_strategy_vault_user_email_idx
  on public.desk_strategy_vault (user_email);

alter table public.desk_watchlist_items enable row level security;
alter table public.desk_strategy_vault enable row level security;

revoke all on table public.desk_watchlist_items from anon, authenticated;
revoke all on table public.desk_strategy_vault from anon, authenticated;
