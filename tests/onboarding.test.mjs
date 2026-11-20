import test from 'node:test'
import assert from 'node:assert/strict'
import handler, {validationError} from '../api/events.js'
import {randomUUID} from 'node:crypto'
const event=()=>({version:1,event_id:randomUUID(),occurred_at:new Date().toISOString(),provider:'local',model:'example',integration:'test',usage_source:'manual',usage_status:'reported',input_tokens:10,output_tokens:2})
test('safe field errors for malformed usage',()=>{
 for(const [change,field] of [[{usage_source:'private-secret'},'usage_source'],[{prompt:'private-secret'},'body'],[{cache_read_tokens:20},'input_tokens'],[{occurred_at:new Date(Date.now()+600000).toISOString()},'occurred_at'],[{cost:{amount:1}},'cost']]) {
  const error=validationError({...event(),...change})
  assert.equal(error.field,field)
  assert(!JSON.stringify(error).includes('private-secret'))
 }
})
test('response distinguishes stored duplicate and conflict',async()=>{
 const oldFetch=globalThis.fetch
 const oldURL=process.env.SUPABASE_URL, oldKey=process.env.SUPABASE_SECRET_KEY
 process.env.SUPABASE_URL='https://example.invalid'
 process.env.SUPABASE_SECRET_KEY='sb_secret_test'
 try {
  for(const code of [201,200,409,401,429]) {
   globalThis.fetch=async()=>({ok:true,json:async()=>code})
   const response={status(value){this.code=value;return this},json(value){this.body=value;return this},setHeader(){}}
   await handler({method:'POST',headers:{authorization:'Bearer sst_'+'a'.repeat(64),'content-type':'application/json'},body:event()},response)
   assert.equal(response.code,code)
   if(code===200) assert.deepEqual(response.body,{accepted:true,duplicate:true})
   if(code===409) assert.equal(response.body.error.code,'event_conflict')
  }
 } finally {
  globalThis.fetch=oldFetch
  if(oldURL===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldURL
  if(oldKey===undefined)delete process.env.SUPABASE_SECRET_KEY;else process.env.SUPABASE_SECRET_KEY=oldKey
 }
})
