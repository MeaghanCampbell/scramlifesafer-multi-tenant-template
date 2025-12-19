'use client'

import React from 'react'
import type { Navigation as NavigationType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { CTASection } from './CTASection'
import { Menu } from 'lucide-react'

type DesktopNavProps = {
  data: NavigationType
  className: string
}

export const MobileNav: React.FC<DesktopNavProps> = ({ data, className }) => {
  const navItems = data?.navItems || []

  return (
    <nav className={`${className}`}>

        <Menu />

        {/* This is where you can add components or build out your mobile nav experience */}
        
    </nav>
  )
}
