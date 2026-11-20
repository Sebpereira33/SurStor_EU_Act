begin;
create table if not exists surstor_private.upload_tokens (
 id uuid primary key default gen_random_uuid(), owner uuid not null references surstor_private.pilot(owner),
 name text not null, digest text unique not null, created_at timestamptz not null default now(),
 last_used_at timestamptz, revoked_at timestamptz
);
alter table surstor_private.upload_tokens enable row level security;
revoke all on surstor_private.upload_tokens from public,anon,authenticated;
create or replace function public.surstor_tokens() returns jsonb language sql security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'name',name,'created_at',created_at,'last_used_at',last_used_at,'revoked_at',revoked_at) order by created_at desc),'[]') from surstor_private.upload_tokens where owner=auth.uid();
$$;
create or replace function public.surstor_create_token(label text) returns text language plpgsql security definer set search_path='' as $$
declare token text;
begin
 perform public.surstor_open_workspace();
 if label is null or length(trim(label)) not between 1 and 80 then raise exception 'Use a name between 1 and 80 characters'; end if;
 perform 1 from surstor_private.pilot where owner=auth.uid() for update;
 if (select count(*) from surstor_private.upload_tokens where owner=auth.uid() and revoked_at is null)>=20 then raise exception 'Revoke an existing token before creating another'; end if;
 token := 'sst_' || replace(gen_random_uuid()::text||gen_random_uuid()::text,'-','');
 insert into surstor_private.upload_tokens(owner,name,digest) values(auth.uid(),trim(label),encode(sha256(convert_to(token,'UTF8')),'hex'));
 return token;
end $$;
create or replace function public.surstor_revoke_token(token_id uuid) returns void language sql security definer set search_path='' as $$
 update surstor_private.upload_tokens set revoked_at=coalesce(revoked_at,now()) where id=token_id and owner=auth.uid();
$$;
create or replace function surstor_private.canonical_event(e jsonb) returns jsonb language sql immutable set search_path='' as $$
 select jsonb_strip_nulls(e) || jsonb_build_object('occurred_at',extract(epoch from (e->>'occurred_at')::timestamptz)) ||
 case when e->'cost' is not null and e->'cost'<>'null'::jsonb then jsonb_build_object('cost',(e->'cost')||jsonb_build_object('amount',(e#>>'{cost,amount}')::numeric)) else '{}'::jsonb end;
$$;
create or replace function public.surstor_ingest(device_digest text, event jsonb) returns integer
language plpgsql security definer set search_path='' as $$
declare account uuid; existing jsonb; device_id uuid;
begin
 select id,owner into device_id,account from surstor_private.upload_tokens where digest=device_digest and revoked_at is null for update;
 if account is null then select owner into account from surstor_private.pilot where device_hash=device_digest; end if;
 if account is null then return 401; end if;
 perform 1 from surstor_private.pilot where owner=account for update;
 if device_id is not null then update surstor_private.upload_tokens set last_used_at=now() where id=device_id; end if;
 select metadata into existing from surstor_private.events where owner=account and id=(event->>'event_id')::uuid;
 if found then return case when surstor_private.canonical_event(existing)=surstor_private.canonical_event(event) then 200 else 409 end; end if;
 if (select count(*) from surstor_private.events where owner=account)>=100000 then return 429; end if;
 insert into surstor_private.events values(account,(event->>'event_id')::uuid,(event->>'occurred_at')::timestamptz,event);
 return 201;
end $$;
create or replace function public.surstor_check_token(device_digest text) returns boolean language sql security definer set search_path='' as $$
 select exists(select 1 from surstor_private.upload_tokens where digest=device_digest and revoked_at is null)
 or exists(select 1 from surstor_private.pilot where device_hash=device_digest);
$$;
create or replace function public.surstor_recent_events() returns jsonb language sql security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'occurred_at',occurred_at,'model',metadata->>'model','integration',metadata->>'integration') order by occurred_at desc),'[]') from (select * from surstor_private.events where owner=auth.uid() order by occurred_at desc limit 50) e;
$$;
create or replace function public.surstor_delete_event(event_id uuid) returns boolean language plpgsql security definer set search_path='' as $$
begin
 delete from surstor_private.events where owner=auth.uid() and id=event_id;
 return found;
end $$;
revoke all on function public.surstor_tokens(),public.surstor_create_token(text),public.surstor_revoke_token(uuid),public.surstor_recent_events(),public.surstor_delete_event(uuid),public.surstor_check_token(text) from public,anon,authenticated,service_role;
grant execute on function public.surstor_tokens(),public.surstor_create_token(text),public.surstor_revoke_token(uuid),public.surstor_recent_events(),public.surstor_delete_event(uuid) to authenticated;
grant execute on function public.surstor_check_token(text) to service_role;
commit;
