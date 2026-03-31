-- Game World v1 performance and security hardening

create index if not exists game_world_runs_profile_idx
  on public.game_world_runs(profile_id);

create index if not exists game_world_runs_campaign_idx
  on public.game_world_runs(campaign_id);

create index if not exists game_world_node_attempts_user_idx
  on public.game_world_node_attempts(user_id, created_at desc);

create or replace function public.update_game_world_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
