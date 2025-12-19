import React from 'react'
import { Logo } from '@/components/Logo/Logo'
import { DesktopNav } from './Nav/DesktopNav'
import { MobileNav } from './Nav/MobileNav'
import { Container } from '@/components/Container'
import { getTenantFromHeaders } from '@/utilities/getTenantFromHeaders'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Navigation as NavigationType } from '@/payload-types'

export async function Navigation() {
  const tenant = await getTenantFromHeaders()
  if (!tenant) return null
  const navigationData = await getCachedGlobal<NavigationType>(
    'navigations',
    tenant.id,
    1,
  )()  
  if (!navigationData) return null

  return (
    <Container backgroundColor='bg-white' className="relative z-20">
      <header className="py-4 lg:py-6 flex flex-row-reverse lg:flex-row justify-between items-center">
        <Logo loading="eager" priority="high" width={193} height={34} />
        <DesktopNav className='hidden lg:flex' data={navigationData} />
        <MobileNav className='lg:hidden' data={navigationData} />
      </header>
    </Container>
  )
}
