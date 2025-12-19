'use client'

import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { usePathname, useSearchParams } from 'next/navigation'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']
const STATIC_FIELDS: Record<string, string> = {
  brand: 'brand',
  influencer_group: 'Client',
  communications_consent: 'true',
}

const readCookieValues = (keys: readonly string[]) => {
  const parsed: Record<string, string> = {}

  for (const part of document.cookie.split('; ')) {
    const eq = part.indexOf('=')
    if (eq === -1) continue

    const key = part.slice(0, eq)
    if (!keys.includes(key)) continue

    const value = part.slice(eq + 1)
    parsed[key] = decodeURIComponent(value)
  }

  return parsed
}

export const GlobalHiddenFields: React.FC = () => {

  const [hiddenFields, setHiddenFields] = useState<Record<string, string>>({})
  const { register, setValue } = useFormContext()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const parsedCookies = readCookieValues([...UTM_KEYS, 'audience', '_ga', 'gclid', 'enrollmentcode'])

    const gclid = searchParams.get('gclid') || parsedCookies.gclid || undefined
    const enrollmentCode = searchParams.get('enrollmentcode') || parsedCookies.enrollmentcode || undefined
    const gaClientId = parsedCookies._ga ? parsedCookies._ga.slice(6) : undefined

    const finalFields: Record<string, string> = {
      ...STATIC_FIELDS,
      ...Object.fromEntries(
        UTM_KEYS.filter((key) => parsedCookies[key]).map((key) => [key, parsedCookies[key]])
      ),
      ...(enrollmentCode ? { enrollmentcode: enrollmentCode } : {}),
      ...(gclid ? { gclid } : {}),
      ...(gaClientId ? { ga_client_id: gaClientId } : {}),
    }

    setHiddenFields(finalFields)

    Object.entries(finalFields).forEach(([name, value]) => {
      setValue(name, value, { shouldDirty: false, shouldValidate: false, shouldTouch: false })
    })

  }, [pathname, register, searchParams, setValue])

  return (
    <>
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" {...register(name)} defaultValue={value} />
      ))}
    </>
  )
}
