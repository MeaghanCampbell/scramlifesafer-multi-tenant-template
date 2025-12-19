import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded text-base font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      variant: 'primary',
    },
    variants: {
      variant: {
        primary: 'bg-primary-500 hover:bg-primary-500/90 py-2 px-6',
        secondary: 'text-slate-100 bg-secondary-dark hover:bg-secondary-dark/90 py-2 px-6',
        link: 'text-secondary-dark items-start justify-start',
      },
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  className,
  variant,
  ref,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ className, variant }))} ref={ref} {...props} />
}

export { Button, buttonVariants }
