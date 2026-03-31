-- Game Campaign v1: board campaign, daily runs, missions, rewards, telemetry

create table if not exists public.game_campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Finance City',
  status text not null default 'active' check (status in ('active','completed','abandoned')),
  current_level int not null default 1 check (current_level > 0),
  board_position int not null default 0 check (board_position >= 0),
  coins int not null default 0,
  energy int not null default 3 check (energy >= 0),
  streak_days int not null default 0 check (streak_days >= 0),
  last_run_at timestamptz,
  state jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists game_campaigns_active_user_idx
  on public.game_campaigns(user_id)
  where status = 'active';

create index if not exists game_campaigns_user_status_idx
  on public.game_campaigns(user_id, status);

create table if not exists public.game_runs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.game_campaigns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  run_date date not null,
  events jsonb not null default '[]',
  result jsonb not null default '{}',
  reward_coins int not null default 0,
  created_at timestamptz not null default now(),
  unique(campaign_id, run_date)
);

create index if not exists game_runs_user_date_idx
  on public.game_runs(user_id, run_date desc);

create table if not exists public.game_missions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.game_campaigns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_date date not null,
  title text not null,
  description text not null,
  status text not null default 'active' check (status in ('active','completed','skipped')),
  mission_spec jsonb not null default '{}',
  reward_coins int not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, mission_date, title)
);

create index if not exists game_missions_user_date_idx
  on public.game_missions(user_id, mission_date desc);

create table if not exists public.game_rewards (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.game_campaigns(id) on delete cascade,
  run_id uuid references public.game_runs(id) on delete set null,
  mission_id uuid references public.game_missions(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  reward_type text not null check (reward_type in ('daily_run','mission','streak_bonus','level_up')),
  amount_coins int not null default 0,
  claimed_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists game_rewards_user_claimed_idx
  on public.game_rewards(user_id, claimed_at, created_at desc);

create table if not exists public.game_telemetry_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  campaign_id uuid references public.game_campaigns(id) on delete set null,
  run_id uuid references public.game_runs(id) on delete set null,
  event_name text not null,
  payload jsonb not null default '{}',
  latency_ms int,
  fps_bucket text,
  error_code text,
  created_at timestamptz not null default now()
);

create index if not exists game_telemetry_events_created_idx
  on public.game_telemetry_events(created_at desc);

create table if not exists public.game_test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  campaign_id uuid references public.game_campaigns(id) on delete set null,
  suite_name text not null,
  case_name text not null,
  status text not null check (status in ('pass','fail','skip')),
  duration_ms int,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists game_test_results_created_idx
  on public.game_test_results(created_at desc);

create or replace function public.update_game_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists game_campaigns_updated_at_trg on public.game_campaigns;
create trigger game_campaigns_updated_at_trg
  before update on public.game_campaigns
  for each row
  execute function public.update_game_updated_at();

alter table public.game_campaigns enable row level security;
alter table public.game_runs enable row level security;
alter table public.game_missions enable row level security;
alter table public.game_rewards enable row level security;
alter table public.game_telemetry_events enable row level security;
alter table public.game_test_results enable row level security;

create policy "Users can read own game_campaigns"
  on public.game_campaigns
  for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own game_campaigns"
  on public.game_campaigns
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own game_campaigns"
  on public.game_campaigns
  for update to authenticated
  using (user_id = auth.uid());

create policy "Users can read own game_runs"
  on public.game_runs
  for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own game_runs"
  on public.game_runs
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can read own game_missions"
  on public.game_missions
  for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own game_missions"
  on public.game_missions
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own game_missions"
  on public.game_missions
  for update to authenticated
  using (user_id = auth.uid());

create policy "Users can read own game_rewards"
  on public.game_rewards
  for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own game_rewards"
  on public.game_rewards
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own game_rewards"
  on public.game_rewards
  for update to authenticated
  using (user_id = auth.uid());

create policy "Users can read own game_telemetry_events"
  on public.game_telemetry_events
  for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own game_telemetry_events"
  on public.game_telemetry_events
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can read own game_test_results"
  on public.game_test_results
  for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own game_test_results"
  on public.game_test_results
  for insert to authenticated
  with check (user_id = auth.uid());
