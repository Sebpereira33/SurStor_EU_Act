import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID, createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'
import { valid } from '../api/events.js'

test('two-account pilot, retry, revocation and database permissions', async()=>{
 const db=new PGlite()
 try {
 await db.exec("create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;")
 await db.exec(await readFile(new URL('../supabase/migrations/202611100001_usage_pilot.sql',import.meta.url),'utf8'))
 const a=randomUUID(), b=randomUUID()
 for(const id of [a,b]){await db.query('insert into auth.users values($1)',[id]);await db.query('insert into surstor_private.pilot(owner) values($1)',[id])}
 async function asUser(id){await db.exec('reset role;set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id])}
 await asUser(a)
 const key=(await db.query('select public.surstor_device(true) k')).rows[0].k
 const hash=createHash('sha256').update(key).digest('hex')
 const event={version:1,event_id:randomUUID(),occurred_at:new Date().toISOString(),provider:'local',model:'pilot',integration:'cli',usage_source:'harness_event',usage_status:'reported',input_tokens:12,output_tokens:3,cost:null}
 assert(valid(event));assert(!valid({...event,prompt:'private'}));assert(!valid({...event,cache_read_tokens:13}));assert(!valid({...event,usage_status:'unknown'}))
 const ingest=async(e)=>(await db.query('select public.surstor_ingest($1,$2::jsonb) status',[hash,JSON.stringify(e)])).rows[0].status
 await assert.rejects(ingest(event));await assert.rejects(db.query('select * from surstor_private.events'))
 await db.exec('reset role;set role service_role')
 assert.equal(await ingest(event),201);assert.equal(await ingest(event),200);assert.equal(await ingest({...event,output_tokens:9}),409)
 const summary=async()=>(await db.query('select public.surstor_summary(7) s')).rows[0].s
 await asUser(a);assert.equal((await summary()).groups[0].requests,1);assert.equal((await summary()).groups[0].input,12)
 await asUser(b);assert.deepEqual((await summary()).groups,[])
 await asUser(randomUUID());await assert.rejects(summary());await assert.rejects(db.query('select public.surstor_device(true)'))
 await asUser(a);await db.query('select public.surstor_device(false)');await db.exec('reset role;set role service_role');assert.equal(await ingest(event),401)
 await db.exec('reset role;set role anon');await assert.rejects(summary());await assert.rejects(ingest(event))
 }finally{await db.close()}
})
