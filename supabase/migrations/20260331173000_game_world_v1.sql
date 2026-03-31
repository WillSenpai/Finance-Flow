-- Game World v1: 2D world vertical slice (single zone)

create table if not exists public.game_world_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  campaign_id uuid references public.game_campaigns(id) on delete set null,
  current_zone_code text not null default 'zone_alpha',
  xp int not null default 0 check (xp >= 0),
  completed_nodes jsonb not null default '[]'::jsonb,
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists game_world_profiles_campaign_idx
  on public.game_world_profiles(campaign_id);

create table if not exists public.game_world_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null references public.game_world_profiles(id) on delete cascade,
  campaign_id uuid references public.game_campaigns(id) on delete set null,
  run_date date not null default (now() at time zone 'utc')::date,
  zone_code text not null,
  status text not null default 'active' check (status in ('active', 'finished', 'abandoned')),
  reward_multiplier numeric(5,2) not null default 1.0,
  total_coins_delta int not null default 0,
  total_energy_delta int not null default 0,
  total_xp_delta int not null default 0,
  state jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create unique index if not exists game_world_runs_single_active_idx
  on public.game_world_runs(user_id)
  where status = 'active';

create index if not exists game_world_runs_user_date_idx
  on public.game_world_runs(user_id, run_date desc);

create table if not exists public.game_world_node_attempts (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.game_world_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  node_code text not null,
  attempt_no int not null default 1,
  outcome text not null check (outcome in ('success', 'fail', 'invalid')),
  coins_delta int not null default 0,
  energy_delta int not null default 0,
  xp_delta int not null default 0,
  duration_ms int,
  submitted_payload jsonb not null default '{}'::jsonb,
  result_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(run_id, node_code, attempt_no)
);

create index if not exists game_world_node_attempts_run_idx
  on public.game_world_node_attempts(run_id, created_at desc);

create or replace function public.update_game_world_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists game_world_profiles_updated_at_trg on public.game_world_profiles;
create trigger game_world_profiles_updated_at_trg
  before update on public.game_world_profiles
  for each row
  execute function public.update_game_world_updated_at();

alter table public.game_world_profiles enable row level security;
alter table public.game_world_runs enable row level security;
alter table public.game_world_node_attempts enable row level security;

create policy "Users can read own game_world_profiles"
  on public.game_world_profiles
  for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own game_world_profiles"
  on public.game_world_profiles
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own game_world_profiles"
  on public.game_world_profiles
  for update to authenticated
  using (user_id = auth.uid());

create policy "Users can read own game_world_runs"
  on public.game_world_runs
  for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own game_world_runs"
  on public.game_world_runs
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own game_world_runs"
  on public.game_world_runs
  for update to authenticated
  using (user_id = auth.uid());

create policy "Users can read own game_world_node_attempts"
  on public.game_world_node_attempts
  for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own game_world_node_attempts"
  on public.game_world_node_attempts
  for insert to authenticated
  with check (user_id = auth.uid());

