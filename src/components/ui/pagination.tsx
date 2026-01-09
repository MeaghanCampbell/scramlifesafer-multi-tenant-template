/**
 * Pagination (UI) Components
 * ------------------------
 * Provides modular, styled pagination components with support for:
 * - Navigation container
 * - Links with active state
 * - Previous/Next buttons
 * - Ellipsis for skipped pages
 * 
 * Uses Button variants and class merging for consistent styling.
 */

import { buttonVariants } from '@/components/ui/button'
import { cn } from 'src/utilities/ui'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import * as React from 'react'
import Link from 'next/link'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    role="navigation"
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul className={cn('flex flex-row items-center gap-1 cursor-pointer', className)} ref={ref} {...props} />
  ),
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => <li className={cn('list-none cursor-pointer', className)} ref={ref} {...props} />,
)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & React.ComponentProps<typeof Link>

const PaginationLink = ({ className, isActive, ...props }: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: 'link',
      }),
      className,
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

type PaginationPrevNextProps = PaginationLinkProps & {
  disabled?: boolean
}

const PaginationPrevious = ({
  className,
  disabled,
  ...props
}: PaginationPrevNextProps) => {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          buttonVariants({ variant: 'link' }),
          'gap-1 pl-2.5 flex items-center opacity-50 pointer-events-none',
          className,
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </span>
    )
  }

  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn('gap-1 pl-2.5 flex items-center', className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </PaginationLink>
  )
}
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  disabled,
  ...props
}: PaginationPrevNextProps) => {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          buttonVariants({ variant: 'link' }),
          'gap-1 pr-2.5 flex items-center opacity-50 pointer-events-none',
          className,
        )}
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </span>
    )
  }

  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn('gap-1 pr-2.5 flex items-center', className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
}
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}