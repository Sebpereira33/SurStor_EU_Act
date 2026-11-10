begin;
create schema if not exists surstor_private;
revoke all on schema surstor_private from public, anon, authenticated;
create table surstor_private.pilot (
  owner uuid primary key references auth.users(id) on delete cascade,
  device_hash text unique
);
create table surstor_private.events (
  owner uuid not null references surstor_private.pilot(owner) on delete cascade,
  id uuid not null, occurred_at timestamptz not null, metadata jsonb not null,
  primary key(owner,id)
);
create index on surstor_private.events(owner,occurred_at);
alter table surstor_private.events enable row level security;
alter table surstor_private.pilot enable row level security;
revoke all on all tables in schema surstor_private from public, anon, authenticated;

-- No caller-supplied owner. Only explicitly enrolled users can manage a key.
create function public.surstor_device(enable boolean) returns text
language plpgsql security definer set search_path='' as $$
declare token text;
begin
  if enable then token := replace(gen_random_uuid()::text||gen_random_uuid()::text,'-',''); end if;
  update surstor_private.pilot set device_hash=encode(sha256(convert_to(token,'UTF8')),'hex') where owner=auth.uid();
  if not found then raise exception 'Pilot membership required' using errcode='42501'; end if;
  return token;
end $$;

-- Called ONLY by the server after it has validated the event and hashed the bearer token.
create function public.surstor_ingest(device_digest text, event jsonb) returns integer
language plpgsql security definer set search_path='' as $$
declare account uuid; existing jsonb;
begin
  select owner into account from surstor_private.pilot where device_hash=device_digest for update;
  if not found then return 401; end if;
  select metadata into existing from surstor_private.events where owner=account and id=(event->>'event_id')::uuid;
  if found then return case when existing=event then 200 else 409 end; end if;
  if (select count(*) from surstor_private.events where owner=account)>=100000 then return 429; end if;
  insert into surstor_private.events values(account,(event->>'event_id')::uuid,(event->>'occurred_at')::timestamptz,event);
  return 201;
end $$;

create function public.surstor_summary(days integer default 30) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare account uuid:=auth.uid(); result jsonb;
begin
  if not exists(select 1 from surstor_private.pilot where owner=account) then
    raise exception 'Pilot membership required' using errcode='42501';
  end if;
  if days is null or days not in (7,30) then raise exception 'Unsupported period'; end if;
  with selected as (
    select metadata m from surstor_private.events
    where owner=account and occurred_at >= now()-make_interval(days=>days) and occurred_at <= now()
  ), grouped as (
    select m->>'model' model,m->>'provider' provider,m->>'integration' tool,count(*) requests,
    sum((m->>'input_tokens')::bigint) input,sum((m->>'output_tokens')::bigint) output
    from selected group by 1,2,3
  ), priced as (
    select m#>>'{cost,currency}' currency,m#>>'{cost,kind}' kind,sum((m#>>'{cost,amount}')::numeric)::text amount
    from selected where m#>>'{cost,amount}' is not null group by 1,2
  )
  select jsonb_build_object('groups',coalesce((select jsonb_agg(to_jsonb(g) order by requests desc,model,tool,provider) from grouped g),'[]'),
    'costs',coalesce((select jsonb_agg(to_jsonb(p) order by currency,kind) from priced p),'[]'),
    'unpriced',(select count(*) from selected where m#>>'{cost,amount}' is null)) into result;
  return result;
end $$;
revoke all on function public.surstor_summary(integer), public.surstor_device(boolean), public.surstor_ingest(text,jsonb) from public, anon, authenticated, service_role;
grant execute on function public.surstor_summary(integer), public.surstor_device(boolean) to authenticated;
grant execute on function public.surstor_ingest(text,jsonb) to service_role;
commit;
