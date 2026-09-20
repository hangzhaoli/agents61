-- Durable Prediction Markets paper-trading ledger (internal only).

create table if not exists public.desk_prediction_paper_ledger (
  id text primary key default 'default',
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.desk_prediction_paper_ledger enable row level security;

revoke all on table public.desk_prediction_paper_ledger from anon, authenticated;
