import { cn } from '@/utilities/ui'
import * as React from 'react'

const Textarea: React.FC<
  {
    ref?: React.Ref<HTMLTextAreaElement>
  } & React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className, ref, ...props }) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md text-base border border-primary-900 bg-white px-3 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
}

export { Textarea }
