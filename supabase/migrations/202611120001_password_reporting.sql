begin;
-- Only the reporting server can select a workspace by its authenticated owner.
create or replace function public.surstor_ingest_owner(account uuid, event jsonb) returns integer
language plpgsql security definer set search_path='' as $$
declare digest text;
begin
  if not exists (select 1 from auth.users where id=account and email_confirmed_at is not null and not is_anonymous) then return 401; end if;
  insert into surstor_private.pilot(owner) values(account) on conflict(owner) do nothing;
  select device_hash into digest from surstor_private.pilot where owner=account for update;
  if digest is null then
    digest := encode(sha256(convert_to(gen_random_uuid()::text,'UTF8')),'hex');
    update surstor_private.pilot set device_hash=digest where owner=account;
  end if;
  return public.surstor_ingest(digest,event);
end $$;
revoke all on function public.surstor_ingest_owner(uuid,jsonb) from public,anon,authenticated;
grant execute on function public.surstor_ingest_owner(uuid,jsonb) to service_role;
commit;
