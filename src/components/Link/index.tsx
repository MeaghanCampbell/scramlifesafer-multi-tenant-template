/**
 * CMSLink Component
 * -----------------
 * Renders a dynamic link or button based on Payload link data.
 * Supports internal and external URLs, audience-based routing, and cookie setting.
 */

'use client'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { openModal } from '@/utilities/modal'
import { useRouter } from 'next/navigation'
import type { Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  mobileLabel?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  type?: 'custom' | 'reference' | null
  url?: string | null
  targetId?: string | null | undefined
  behavior?: 'navigate' | 'openTarget' | null
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {

  const router = useRouter()

  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    mobileLabel,
    reference,
    url,
    targetId,
    onClick,
    behavior
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (onClick) onClick(event)

      if (behavior === 'openTarget' && targetId) {
        event.preventDefault()
        openModal(targetId) 
        return
      }

    if (behavior === 'navigate') {
      const parts = href.split('/').filter(Boolean)
      const firstPart = parts[0]
    
      const validAudiences = ['new-drivers', 'fleets', 'compliance']
      if (validAudiences.includes(firstPart)) {
        event.preventDefault()
    
        document.cookie = 'audience=; path=/; max-age=0'
        document.cookie = `audience=${firstPart}; path=/; max-age=31536000; secure; samesite=lax;`
    
        router.push(href)
        router.refresh()
      }
    }
  }

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps} onClick={handleClick}>
         {mobileLabel ? (
          <>
            <span className="block sm:hidden">{mobileLabel}</span>
            <span className="hidden sm:block">{label}</span>
          </>
        ) : (
          <span>{label && label}</span>
        )}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} variant={appearance}>
      <Link className={cn(className)} href={href || url || ''} {...newTabProps} onClick={handleClick}>
        {mobileLabel ? (
          <>
            <span className="block sm:hidden">{mobileLabel}</span>
            <span className="hidden sm:block">{label}</span>
          </>
        ) : (
          <span>{label && label}</span>
        )}
        {children && children}
      </Link>
    </Button>
  )
}
