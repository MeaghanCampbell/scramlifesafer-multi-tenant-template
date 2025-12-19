import { createHmac } from 'node:crypto'

const SECRET = process.env.HONEYPOT_SECRET || 'dev-only-change-me'

export function signTimestampBucket(tsMs: number) {
  const minuteBucket = Math.floor(tsMs / 60000)
  return createHmac('sha256', SECRET).update(String(minuteBucket)).digest('hex')
}

export function expectedSigFor(tsMs: number) {
  return signTimestampBucket(tsMs)
}
