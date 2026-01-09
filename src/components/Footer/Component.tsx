import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Footer as FooterType } from '@/payload-types'
import React from 'react'
import { Container } from '@/components/Container'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer({ domain }: { domain: string }) {
  const tenant = await getTenantByDomain(domain)
  if (!tenant) return null
  
  const footerData = await getCachedGlobal<FooterType>('footers', tenant.id, 1)()

  if(!footerData) return null

  const navItems = footerData?.navItems || []

  return (
    <Container className={`border-t border-slate-200 py-6`}>
        <footer className="gap-8 flex flex-col md:flex-row md:justify-between md:items-center">
            <Logo width={193} height={34} />
            <nav className="flex flex-col md:flex-row gap-4">
              {navItems.map(({ link }, i) => {
                return <CMSLink key={i} {...link} />
              })}
            </nav>
        </footer>
    </Container>
  )
}
