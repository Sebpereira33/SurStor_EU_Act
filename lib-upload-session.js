import { createHmac, timingSafeEqual } from 'node:crypto'

const lifetime = 3600
function signature(payload, secret) {
  return createHmac('sha256', secret).update('surstor-upload-v1:' + payload).digest('base64url')
}
export function issueSession(owner, secret) {
  const payload = owner + '.' + (Math.floor(Date.now() / 1000) + lifetime)
  return {access_token: payload + '.' + signature(payload, secret), token_type: 'Bearer', expires_in: lifetime}
}
export function sessionOwner(token, secret) {
  const match = /^([0-9a-f-]{36})\.([0-9]{10})\.([A-Za-z0-9_-]{43})$/.exec(token)
  if (!match || Number(match[2]) <= Date.now() / 1000) return null
  const expected = signature(match[1] + '.' + match[2], secret)
  return timingSafeEqual(Buffer.from(match[3]), Buffer.from(expected)) ? match[1] : null
}
