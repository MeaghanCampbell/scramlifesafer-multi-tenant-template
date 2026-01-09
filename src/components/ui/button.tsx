import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-button text-base transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      variant: 'primary',
    },
    variants: {
      variant: {
        primary: 'bg-button-primary-bg hover:bg-button-primary-bg/90 text-button-primary-text py-2 px-6',
        secondary: 'text-button-secondary-text bg-button-secondary-bg hover:bg-button-secondary-bg/90 py-2 px-6',
        link: 'text-link items-start justify-start',
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
