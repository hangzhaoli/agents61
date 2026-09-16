-- Prediction Markets saves / favorites (service role only)

create table if not exists public.desk_prediction_saves (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  client_id text not null,
  market_id text not null,
  favorited boolean not null default false,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_email, client_id),
  unique (user_email, market_id)
);

create index if not exists desk_prediction_saves_user_email_idx
  on public.desk_prediction_saves (user_email);

alter table public.desk_prediction_saves enable row level security;

revoke all on table public.desk_prediction_saves from anon, authenticated;
