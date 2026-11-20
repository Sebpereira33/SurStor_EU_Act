import { fail } from '../lib-api.js'
import { issueSession } from '../lib-upload-session.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') return fail(res,405,'authentication_error','Use POST.')
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return fail(res,415,'authentication_error','Use Content-Type: application/json.')
  let credentials
  try { credentials = typeof req.body === 'string' ? JSON.parse(req.body) : req.body } catch { return fail(res,400,'authentication_error','Supply email and password as JSON strings.') }
  const {email, password} = credentials || {}
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password || email.length > 320 || password.length > 4096) return fail(res,400,'authentication_error','Supply email and password as JSON strings.')
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY
  if (!secret || !key || !process.env.SUPABASE_URL) return fail(res,503,'authentication_error','Sign-in is temporarily unavailable.')
  try {
    const auth = await fetch(new URL('/auth/v1/token?grant_type=password', process.env.SUPABASE_URL), {
      method: 'POST', headers: {apikey: key, 'Content-Type': 'application/json'},
      body: JSON.stringify({email, password}), redirect: 'error', signal: AbortSignal.timeout(8000)
    })
    if (!auth.ok) return fail(res,auth.status===429?429:auth.status>=500?503:401,'authentication_failed','Sign-in failed. Check credentials or retry later.')
    const {user} = await auth.json()
    if (!user?.id || !user.email || user.is_anonymous) return fail(res,401,'authentication_error','Email or password is incorrect.')
    return res.json(issueSession(user.id, secret))
  } catch { return fail(res,503,'authentication_error','Sign-in is temporarily unavailable.') }
}
