export function normalizeHost(host?: string | null) {
    if (!host) return undefined
    let h = host.toLowerCase()
    h = h.replace(/:\d+$/, '')
    h = h.replace(/^www\./, '')
    return h // => sitename.com
}

export function tenantKeyFromDomain(domain: string) {
    return domain.replace(/\.[^/.]+$/, '') // sitename.com -> sitename
}
  