begin;
create or replace function public.surstor_summary(days integer default 30) returns jsonb
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
  ), model_priced as (
    select m->>'provider' provider,m->>'model' model,m#>>'{cost,currency}' currency,m#>>'{cost,kind}' kind,
    sum((m#>>'{cost,amount}')::numeric)::text amount,count(*) requests
    from selected where m#>>'{cost,amount}' is not null group by 1,2,3,4
  )
  select jsonb_build_object('groups',coalesce((select jsonb_agg(to_jsonb(g) order by requests desc,model,tool,provider) from grouped g),'[]'),
    'costs',coalesce((select jsonb_agg(to_jsonb(p) order by currency,kind) from priced p),'[]'),
    'model_costs',coalesce((select jsonb_agg(to_jsonb(mp) order by provider,model,currency,kind) from model_priced mp),'[]'),
    'unpriced',(select count(*) from selected where m#>>'{cost,amount}' is null)) into result;
  return result;
end $$;
commit;
