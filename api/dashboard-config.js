export default function handler(req, res) {
  res.setHeader('Cache-Control','private, no-store')
  if (req.method !== 'GET') return res.status(405).end()
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY
  let publishable = key?.startsWith('sb_publishable_')
  if (!publishable && key) {
    try { publishable = JSON.parse(Buffer.from(key.split('.')[1], 'base64url')).role === 'anon' } catch { /* unsuitable key */ }
  }
  if (!url?.startsWith('https://') || !publishable) return res.status(503).json({available:false})
  return res.json({url, key})
}
