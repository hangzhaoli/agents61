-- Prediction analyses (immutable) + cloud watchlist (service role only)

create table if not exists public.desk_prediction_analyses (
  id uuid primary key default gen_random_uuid(),
  user_email text,
  market_id text not null,
  analyzed_at timestamptz not null default now(),
  payload jsonb not null
);

create index if not exists desk_prediction_analyses_market_id_idx
  on public.desk_prediction_analyses (market_id);

create index if not exists desk_prediction_analyses_user_email_idx
  on public.desk_prediction_analyses (user_email);

create index if not exists desk_prediction_analyses_analyzed_at_idx
  on public.desk_prediction_analyses (analyzed_at desc);

alter table public.desk_prediction_analyses enable row level security;

revoke all on table public.desk_prediction_analyses from anon, authenticated;

create table if not exists public.desk_prediction_watchlist (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  market_id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_email, market_id)
);

create index if not exists desk_prediction_watchlist_user_email_idx
  on public.desk_prediction_watchlist (user_email);

alter table public.desk_prediction_watchlist enable row level security;

revoke all on table public.desk_prediction_watchlist from anon, authenticated;
