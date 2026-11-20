import { createHash } from 'node:crypto'
import { fail,serviceHeaders,rpc } from '../lib-api.js'
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store')
  if(req.method!=='POST') return fail(res,405,'method_not_allowed','Use POST.')
  const match=/^Bearer ((?:sst_)?[0-9a-f]{64})$/.exec(req.headers.authorization||'')
  if(!match) return fail(res,401,'authentication_failed','Supply a valid upload token.')
  const headers=serviceHeaders()
  if(!headers) return fail(res,503,'unavailable','Reporting is temporarily unavailable.')
  try {
    const response=await rpc('surstor_check_token',{device_digest:createHash('sha256').update(match[1]).digest('hex')},headers)
    if(!response.ok) return fail(res,503,'unavailable','Could not check the connection.')
    if(await response.json()!==true) return fail(res,401,'authentication_failed','The upload token is invalid or revoked.')
    return res.json({connected:true,scope:'usage:write',message:'Upload token valid. Connection OK.'})
  } catch { return fail(res,503,'unavailable','Could not check the connection.') }
}
