import React, { useRef } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { useDropdownPosition } from '@/utilities/useDropdownPosition'

type NavItem = NonNullable<HeaderType['navItems']>[number]

export function Dropdowns({
  isOpen,
  item,
}: {
  isOpen: boolean
  item: NavItem
}) {
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const xOffset = useDropdownPosition(isOpen, dropdownRef)

  return (
    <div
      ref={dropdownRef}
      className={`
        absolute top-full z-50 mt-1
        transition-all duration-200
        ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}
        bg-white shadow-lg border border-slate-200 py-4 rounded
        max-w-[calc(100vw-2rem)] w-max min-w-[16rem]
      `}
      style={{
        left: '50%',
        transform: `translateX(${xOffset})`,
      }}
    >
      <div className="px-6">

        <ul className="flex flex-col">
          {item.dropdown?.items?.map((dropdownItem, k) => (
            <li
              key={k}
              className="transition py-2 list-none ml-0 group"
            >
              <CMSLink
                {...dropdownItem.link}
                appearance="link"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
