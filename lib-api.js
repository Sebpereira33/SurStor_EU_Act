export function fail(res, status, code, message, field) {
  return res.status(status).json({error:{code, ...(field ? {field} : {}), message}})
}
export function serviceHeaders() {
  const secret=process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret || !process.env.SUPABASE_URL) return null
  return {apikey:secret,'Content-Type':'application/json',...(!secret.startsWith('sb_secret_') ? {Authorization:'Bearer '+secret} : {})}
}
export async function rpc(name, args, headers) {
  return fetch(new URL('/rest/v1/rpc/'+name,process.env.SUPABASE_URL),{
    method:'POST',headers,redirect:'error',signal:AbortSignal.timeout(8000),body:JSON.stringify(args)
  })
}
