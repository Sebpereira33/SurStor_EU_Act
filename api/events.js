import { createHash } from 'node:crypto'
import { fail } from '../lib-api.js'
import { sessionOwner } from '../lib-upload-session.js'
const required=['event_id','version','occurred_at','provider','model','integration','usage_source','usage_status','input_tokens','output_tokens']
const counts=['input_tokens','output_tokens','cache_read_tokens','cache_write_tokens']
const fields=new Set([...required,...counts,'cost','project_id'])
const uuid=v=>typeof v==='string' && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(v)
const ident=v=>typeof v==='string' && /^[a-z0-9][a-z0-9._:/-]{0,127}$/i.test(v) && !/sk-|gh[pousr]_|github_pat_|xox[baprs]-|AKIA|bearer|BEGIN.*KEY|:\/\/|\.\.|^[a-z]:\//i.test(v)
export function validationError(e) {
  const bad=(field,message)=>({field,message})
  if (!e || typeof e!=='object' || Array.isArray(e)) return bad('body','Must be one JSON object.')
  for (const field of required) if (!Object.hasOwn(e,field)) return bad(field,'Required field.')
  if (Object.keys(e).some(k=>!fields.has(k))) return bad('body','Contains an unsupported field. See the event contract.')
  if(e.version!==1) return bad('version','Must be the integer 1.')
  for(const field of ['event_id','project_id']) if((field==='event_id'||Object.hasOwn(e,field))&&!uuid(e[field])) return bad(field,'Must be a UUID.')
  for(const field of ['provider','model','integration']) if(!ident(e[field])) return bad(field,'Use 1–128 identifier characters: letters, digits, dot, underscore, colon, slash or hyphen. Paths and secrets are forbidden.')
  if(typeof e.occurred_at!=='string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,6})?(?:Z|[+-]\d\d:\d\d)$/.test(e.occurred_at) || !Number.isFinite(Date.parse(e.occurred_at)) || Date.parse(e.occurred_at)>Date.now()+300000) return bad('occurred_at','Use an ISO timestamp with timezone and up to six fractional digits, no more than five minutes in the future.')
  if(!['provider_response','harness_event','inference_server','manual'].includes(e.usage_source)) return bad('usage_source','Must be one of provider_response, harness_event, inference_server, manual.')
  if(!['reported','estimated','incomplete','unknown'].includes(e.usage_status)) return bad('usage_status','Must be one of reported, estimated, incomplete, unknown.')
  for(const field of counts) if(e[field]!=null && (!Number.isSafeInteger(e[field]) || e[field]<0 || e[field]>1e9)) return bad(field,'Must be null or an integer from 0 to 1000000000.')
  if(e.input_tokens!=null && (e.cache_read_tokens??0)+(e.cache_write_tokens??0)>e.input_tokens) return bad('input_tokens','Must include cache reads and writes; their sum cannot exceed input.')
  if(e.usage_status==='reported') for(const field of ['input_tokens','output_tokens']) if(e[field]==null) return bad(field,'Reported usage requires a count.')
  if(e.usage_status==='unknown' && counts.some(k=>e[k]!=null)) return bad('usage_status','Unknown usage requires null token counts.')
  const c=e.cost
  if(c!=null) {
    if(typeof c!=='object'||Array.isArray(c)||Object.keys(c).sort().join(',')!=='amount,currency,kind,pricing_version') return bad('cost','Must contain exactly amount, currency, kind and pricing_version.')
    if(typeof c.amount!=='string'||!/^\d{1,9}(\.\d{1,6})?$/.test(c.amount)) return bad('cost.amount','Must be a nonnegative decimal string with up to nine integer and six fractional digits.')
    if(typeof c.currency!=='string'||! /^[A-Z]{3}$/.test(c.currency)) return bad('cost.currency','Use three uppercase letters.')
    if(!['provider_reported','estimated'].includes(c.kind)) return bad('cost.kind','Must be provider_reported or estimated.')
    if(!ident(c.pricing_version)&&!(c.kind==='provider_reported'&&c.pricing_version===null)) return bad('cost.pricing_version','Use an identifier; null is allowed for provider-reported costs.')
  }
  return null
}
export function valid(e) { return validationError(e)===null }
export default async function handler(req,res) {
  res.setHeader('Cache-Control','private, no-store')
  if(req.method!=='POST') return fail(res,405,'method_not_allowed','Use POST.')
  const match=/^Bearer ([A-Za-z0-9._-]{1,256})$/.exec(req.headers.authorization || '')
  if(!match) return fail(res,401,'authentication_failed','The upload credential is invalid, expired or revoked.')
  if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||'')) return fail(res,415,'unsupported_media_type','Use Content-Type: application/json.')
  if(Number(req.headers['content-length'])>16384) return fail(res,413,'body_too_large','Maximum request size is 16384 bytes.')
  let event
  try { const body=typeof req.body==='string'?req.body:JSON.stringify(req.body); if(Buffer.byteLength(body)>16384) return fail(res,413,'body_too_large','Maximum request size is 16384 bytes.'); event=JSON.parse(body) } catch { return fail(res,422,'invalid_json','Send one valid JSON event.') }
  const invalid=validationError(event)
  if(invalid) return fail(res,422,'invalid_field',invalid.message,invalid.field)
  const secret=process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if(!secret || !process.env.SUPABASE_URL) return fail(res,503,'unavailable','Reporting is temporarily unavailable.')
  const headers={apikey:secret,'Content-Type':'application/json'}
  if(!secret.startsWith('sb_secret_')) headers.Authorization='Bearer '+secret
  try {
    const token = match[1]
    const legacy = /^(?:sst_)?[0-9a-f]{64}$/.test(token)
    const owner = legacy ? null : sessionOwner(token, secret)
    if (!legacy && !owner) return fail(res,401,'authentication_failed','The upload credential is invalid, expired or revoked.')
    const rpc = legacy ? 'surstor_ingest' : 'surstor_ingest_owner'
    const args = legacy ? {device_digest:createHash('sha256').update(token).digest('hex'),event} : {account:owner,event}
    const response=await fetch(new URL('/rest/v1/rpc/'+rpc,process.env.SUPABASE_URL),{method:'POST',headers,redirect:'error',signal:AbortSignal.timeout(8000),body:JSON.stringify(args)})
    if(!response.ok) return fail(res,503,'unavailable','Reporting is temporarily unavailable.')
    const code=await response.json()
    if(![200,201,401,409,429].includes(code)) return fail(res,503,'unavailable','Reporting is temporarily unavailable.')
    if(code===401) return fail(res,401,'authentication_failed','The upload credential is invalid or revoked.')
    if(code===409) return fail(res,409,'event_conflict','This event_id is already stored with different metadata.','event_id')
    if(code===429) return fail(res,429,'workspace_limit','The workspace event limit has been reached.')
    return res.status(code).json({accepted:true,duplicate:code===200})
  } catch { return fail(res,503,'unavailable','Reporting is temporarily unavailable.') }
}
