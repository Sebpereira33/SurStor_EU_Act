import { issueSession } from '../lib-upload-session.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') return res.status(405).end()
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return res.status(415).end()
  let credentials
  try { credentials = typeof req.body === 'string' ? JSON.parse(req.body) : req.body } catch { return res.status(400).end() }
  const {email, password} = credentials || {}
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password || email.length > 320 || password.length > 4096) return res.status(400).end()
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY
  if (!secret || !key || !process.env.SUPABASE_URL) return res.status(503).end()
  try {
    const auth = await fetch(new URL('/auth/v1/token?grant_type=password', process.env.SUPABASE_URL), {
      method: 'POST', headers: {apikey: key, 'Content-Type': 'application/json'},
      body: JSON.stringify({email, password}), redirect: 'error', signal: AbortSignal.timeout(8000)
    })
    if (!auth.ok) return res.status(auth.status === 429 ? 429 : auth.status >= 500 ? 503 : 401).end()
    const {user} = await auth.json()
    if (!user?.id || !user.email || user.is_anonymous) return res.status(401).end()
    return res.json(issueSession(user.id, secret))
  } catch { return res.status(503).end() }
}
