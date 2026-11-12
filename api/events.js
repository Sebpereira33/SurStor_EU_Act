import { createHash } from 'node:crypto'
import { sessionOwner } from '../lib-upload-session.js'
const required=['event_id','version','occurred_at','provider','model','integration','usage_source','usage_status','input_tokens','output_tokens']
const counts=['input_tokens','output_tokens','cache_read_tokens','cache_write_tokens']
const fields=new Set([...required,...counts,'cost','project_id'])
const uuid=v=>typeof v==='string' && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(v)
const ident=v=>typeof v==='string' && /^[a-z0-9][a-z0-9._:/-]{0,127}$/i.test(v) && !/sk-|gh[pousr]_|github_pat_|xox[baprs]-|AKIA|bearer|BEGIN.*KEY|:\/\/|\.\.|^[a-z]:\//i.test(v)
export function valid(e) {
  if (!e || typeof e!=='object' || Array.isArray(e) || !required.every(k=>Object.hasOwn(e,k)) || Object.keys(e).some(k=>!fields.has(k))) return false
  if(e.version!==1 || !uuid(e.event_id) || ('project_id' in e && !uuid(e.project_id)) || ![e.provider,e.model,e.integration].every(ident)) return false
  if(typeof e.occurred_at!=='string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,6})?(?:Z|[+-]\d\d:\d\d)$/.test(e.occurred_at) || !Number.isFinite(Date.parse(e.occurred_at)) || Date.parse(e.occurred_at)>Date.now()+300000) return false
  if(!['provider_response','harness_event','inference_server','manual'].includes(e.usage_source) || !['reported','estimated','incomplete','unknown'].includes(e.usage_status)) return false
  if(!counts.every(k=>e[k]==null || (Number.isSafeInteger(e[k]) && e[k]>=0 && e[k]<=1e9))) return false
  if(e.input_tokens!=null && (e.cache_read_tokens??0)+(e.cache_write_tokens??0)>e.input_tokens) return false
  if(e.usage_status==='reported' && (e.input_tokens==null || e.output_tokens==null) || e.usage_status==='unknown' && counts.some(k=>e[k]!=null)) return false
  const c=e.cost
  return c==null || (typeof c==='object' && Object.keys(c).sort().join(',')==='amount,currency,kind,pricing_version' && typeof c.amount==='string' && /^\d{1,9}(\.\d{1,6})?$/.test(c.amount) && typeof c.currency==='string' && /^[A-Z]{3}$/.test(c.currency) && ['provider_reported','estimated'].includes(c.kind) && (ident(c.pricing_version) || c.kind==='provider_reported' && c.pricing_version===null))
}
export default async function handler(req,res) {
  res.setHeader('Cache-Control','private, no-store')
  if(req.method!=='POST') return res.status(405).end()
  const match=/^Bearer ([A-Za-z0-9._-]{1,256})$/.exec(req.headers.authorization || '')
  if(!match) return res.status(401).end()
  if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||'')) return res.status(415).end()
  if(Number(req.headers['content-length'])>16384) return res.status(413).end()
  let event
  try { const body=typeof req.body==='string'?req.body:JSON.stringify(req.body); if(Buffer.byteLength(body)>16384) return res.status(413).end(); event=JSON.parse(body) } catch { return res.status(422).end() }
  if(!valid(event)) return res.status(422).end()
  const secret=process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if(!secret || !process.env.SUPABASE_URL) return res.status(503).end()
  const headers={apikey:secret,'Content-Type':'application/json'}
  if(!secret.startsWith('sb_secret_')) headers.Authorization='Bearer '+secret
  try {
    const token = match[1]
    const legacy = /^[0-9a-f]{64}$/.test(token)
    const owner = legacy ? null : sessionOwner(token, secret)
    if (!legacy && !owner) return res.status(401).end()
    const rpc = legacy ? 'surstor_ingest' : 'surstor_ingest_owner'
    const args = legacy ? {device_digest:createHash('sha256').update(token).digest('hex'),event} : {account:owner,event}
    const response=await fetch(new URL('/rest/v1/rpc/'+rpc,process.env.SUPABASE_URL),{method:'POST',headers,redirect:'error',signal:AbortSignal.timeout(8000),body:JSON.stringify(args)})
    if(!response.ok) return res.status(503).end()
    const code=await response.json()
    if(![200,201,401,409,429].includes(code)) return res.status(503).end()
    return res.status(code).json({accepted:code===200 || code===201})
  } catch { return res.status(503).end() }
}
