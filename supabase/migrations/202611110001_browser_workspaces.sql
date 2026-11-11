begin;
-- Bind each workspace to the authenticated browser or an existing verified account.
create or replace function public.surstor_open_workspace() returns void
language plpgsql security definer set search_path='' as $$
declare account uuid := auth.uid();
begin
  if account is null or not exists (
    select 1 from auth.users where id=account and (is_anonymous or email_confirmed_at is not null)
  ) then raise exception 'Workspace session required' using errcode='42501'; end if;
  insert into surstor_private.pilot(owner) values(account) on conflict(owner) do nothing;
end $$;
revoke all on function public.surstor_open_workspace() from public, anon, authenticated, service_role;
grant execute on function public.surstor_open_workspace() to authenticated;
commit;
