import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID, createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'
import { valid } from '../api/events.js'

test('two-account pilot, retry, revocation and database permissions', async()=>{
 const db=new PGlite()
 try {
 await db.exec("create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;")
 await db.exec(await readFile(new URL('../supabase/migrations/202611100001_usage_pilot.sql',import.meta.url),'utf8'))
 await db.exec(await readFile(new URL('../supabase/migrations/202611100002_public_email_workspaces.sql',import.meta.url),'utf8'))
 await db.exec('alter table auth.users add column is_anonymous boolean default false')
 await db.exec(await readFile(new URL('../supabase/migrations/202611110001_browser_workspaces.sql',import.meta.url),'utf8'))
 await db.exec(await readFile(new URL('../supabase/migrations/202611120001_password_reporting.sql',import.meta.url),'utf8'))
 await db.exec(await readFile(new URL('../supabase/migrations/202611200001_onboarding.sql',import.meta.url),'utf8'))
 await db.exec(await readFile(new URL('../supabase/migrations/202611250001_model_costs.sql',import.meta.url),'utf8'))
 const a=randomUUID(), b=randomUUID()
 await db.query("insert into auth.users values($1,null,null,true)",[a])
 await db.query("insert into auth.users values($1,'tester@example.invalid',now(),false)",[b])
 const pending=randomUUID();await db.query("insert into auth.users values($1,'pending@example.invalid',null)",[pending])
 async function asUser(id){await db.exec('reset role;set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id])}
 await asUser(pending);await assert.rejects(db.query('select public.surstor_open_workspace()'))
 for(const id of [a,b]){await asUser(id);await db.query('select public.surstor_open_workspace()')}
 await asUser(a)
 const key=(await db.query('select public.surstor_device(true) k')).rows[0].k
 const hash=createHash('sha256').update(key).digest('hex')
 const event={version:1,event_id:randomUUID(),occurred_at:new Date().toISOString(),provider:'local',model:'pilot',integration:'cli',usage_source:'harness_event',usage_status:'reported',input_tokens:12,output_tokens:3,cost:null}
 assert(valid(event));assert(!valid({...event,prompt:'private'}));assert(!valid({...event,cache_read_tokens:13}));assert(!valid({...event,usage_status:'unknown'}))
 const ingest=async(e)=>(await db.query('select public.surstor_ingest($1,$2::jsonb) status',[hash,JSON.stringify(e)])).rows[0].status
 await db.query('select public.surstor_open_workspace()') // returning users retain their device key
 await assert.rejects(ingest(event));await assert.rejects(db.query('select * from surstor_private.events'))
 await db.exec('reset role;set role service_role')
 assert.equal(await ingest(event),201);assert.equal(await ingest(event),200);assert.equal(await ingest({...event,output_tokens:9}),409)
 const summary=async()=>(await db.query('select public.surstor_summary(7) s')).rows[0].s
 await asUser(a);assert.equal((await summary()).groups[0].requests,1);assert.equal((await summary()).groups[0].input,12)
 await asUser(b);assert.deepEqual((await summary()).groups,[])
 await asUser(randomUUID());await assert.rejects(summary());await assert.rejects(db.query('select public.surstor_device(true)'))
 await asUser(a);await db.query('select public.surstor_device(false)');await db.exec('reset role;set role service_role');assert.equal(await ingest(event),401)
 await db.exec('reset role;set role anon');await assert.rejects(db.query('select public.surstor_open_workspace()'));await assert.rejects(summary());await assert.rejects(ingest(event))
 const byOwner=async(id)=>(await db.query('select public.surstor_ingest_owner($1,$2::jsonb) status',[id,JSON.stringify(event)])).rows[0].status
 await assert.rejects(byOwner(b))
 await asUser(a);await assert.rejects(byOwner(b))
 await db.exec('reset role;set role service_role')
 assert.equal(await byOwner(a),401);assert.equal(await byOwner(b),201);assert.equal(await byOwner(b),200)

 await asUser(b)
 const token=(await db.query("select public.surstor_create_token('test-device') token")).rows[0].token
 const digest=createHash('sha256').update(token).digest('hex')
 const devices=(await db.query('select public.surstor_tokens() list')).rows[0].list
 assert.equal(devices.length,1);assert.equal(devices[0].name,'test-device')
 await assert.rejects(db.query('select public.surstor_check_token($1)',[digest]))
 await asUser(a);assert.deepEqual((await db.query('select public.surstor_tokens() list')).rows[0].list,[])
 await db.query('select public.surstor_revoke_token($1)',[devices[0].id])
 await db.exec('reset role;set role service_role')
 assert.equal((await db.query('select public.surstor_check_token($1) ok',[digest])).rows[0].ok,true)
 const deviceIngest=async(e)=>(await db.query('select public.surstor_ingest($1,$2::jsonb) status',[digest,JSON.stringify(e)])).rows[0].status
 assert.equal(await deviceIngest({...event,cache_read_tokens:null,cache_write_tokens:null}),200)
 assert.equal(await deviceIngest({...event,output_tokens:99}),409)
 await asUser(a)
 assert.equal((await db.query('select public.surstor_delete_event($1) ok',[event.event_id])).rows[0].ok,true)
 await asUser(b)
 assert.equal((await db.query('select public.surstor_recent_events() list')).rows[0].list.length,1)
 assert.equal((await db.query('select public.surstor_delete_event($1) ok',[event.event_id])).rows[0].ok,true)
 assert.deepEqual((await summary()).groups,[])
 await db.exec('reset role;set role service_role')
 for(const [currency,kind,amount] of [['USD','provider_reported','0.1'],['USD','provider_reported','0.2'],['USD','estimated','0.4'],['EUR','provider_reported','0.5']]) {
   assert.equal(await deviceIngest({...event,event_id:randomUUID(),cost:{currency,kind,amount,pricing_version:kind==='estimated'?'test':null}}),201)
 }
 await asUser(b)
 const chart=(await summary()).model_costs
 assert.equal(chart.length,3)
 assert.equal(chart.find(c=>c.currency==='USD'&&c.kind==='provider_reported').amount,'0.3')
 assert.equal(chart.find(c=>c.currency==='USD'&&c.kind==='estimated').amount,'0.4')
 assert.equal(chart.find(c=>c.currency==='EUR').amount,'0.5')
 await asUser(a);assert.deepEqual((await summary()).model_costs,[])
 await asUser(b)

 await db.query('select public.surstor_revoke_token($1)',[devices[0].id])
 await db.exec('reset role;set role service_role')
 assert.equal((await db.query('select public.surstor_check_token($1) ok',[digest])).rows[0].ok,false)
 assert.equal(await deviceIngest(event),401)
 }finally{await db.close()}
})
