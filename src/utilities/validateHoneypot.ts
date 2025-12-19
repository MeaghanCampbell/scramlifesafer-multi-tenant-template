import { expectedSigFor } from './honeypotSign'

type HP = { contact_website?: string; hp_ts?: string; hp_sig?: string }


export function validateHoneypot(body: Record<string, unknown>) {

  const { contact_website, hp_ts, hp_sig } = body as HP

  if (typeof contact_website === 'string' && contact_website.trim()) {
    return { ok: false, reason: 'honeypot-filled' }
  }

  if (!hp_ts) return { ok: false, reason: 'missing-timestamp' }
  const ts = Number(hp_ts)
  if (!Number.isFinite(ts)) return { ok: false, reason: 'bad-timestamp' }

  const age = Date.now() - ts
  if (age < 2000) return { ok: false, reason: 'too-fast' }
  if (age > 2 * 60 * 60 * 1000) return { ok: false, reason: 'too-old' }

  if (!hp_sig || typeof hp_sig !== 'string') return { ok: false, reason: 'missing-sig' }
  if (expectedSigFor(ts) !== hp_sig) return { ok: false, reason: 'sig-mismatch' }

  return { ok: true as const }
  
}
