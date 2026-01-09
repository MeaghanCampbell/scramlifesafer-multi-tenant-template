import { cn } from '@/utilities/ui'
import * as React from 'react'

const Input: React.FC<
  {
    ref?: React.Ref<HTMLInputElement>
  } & React.InputHTMLAttributes<HTMLInputElement>
> = ({ type, className, ref, ...props }) => {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md text-base border border-primary-900 bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    />
  )
}

export { Input }
