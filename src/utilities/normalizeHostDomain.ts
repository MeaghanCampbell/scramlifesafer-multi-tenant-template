const ENV_PREFIXES = ['staging']

export function normalizeHost(host?: string | null) {
    if (!host) return undefined
    let h = host.toLowerCase()
    h = h.replace(/:\d+$/, '')
    h = h.replace(/^www\./, '')
    return h // => sitename.com
}

export function tenantKeyFromDomain(domain: string) {
    const parts = domain.split('.')
  
    // sitename.com
    if (parts.length === 2) {
      return parts[0]
    }
  
    // staging.sitename.com
    if (parts.length === 3 && ENV_PREFIXES.includes(parts[0])) {
      return parts[1]
    }
  
    // fallback: remove TLD only
    return domain.replace(/\.[^/.]+$/, '')
  }