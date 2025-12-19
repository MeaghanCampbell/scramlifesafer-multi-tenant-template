import clsx from 'clsx'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  width: number
  height: number
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, width, height } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    <Link href="/">
      <Image
        alt="site-name Logo"
        width={width}
        height={height}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
        src="/site-name-logo.svg"
      />
    </Link>
  )
}
