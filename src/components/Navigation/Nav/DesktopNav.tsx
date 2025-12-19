'use client'

import React, { useState } from 'react'
import type { Navigation as NavigationType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { ChevronDown } from 'lucide-react'
import { CTASection } from './CTASection'
import { Dropdowns } from './Dropdown'

type DesktopNavProps = {
  data: NavigationType
  className: string
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ data, className }) => {

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const navItems = data?.navItems || []

  return (
    <nav className={className}>

      <div className='mr-6 flex gap-4 items-center'>

        {navItems.map((item, i) => {
          const { type } = item

          if (type === 'link') {
            return (
              <CMSLink
                key={item.id ?? i}
                {...item.link?.link}
                className="py-3"
                appearance="link"
              />
            )
          }

          if (type === 'dropdown') {
            const isOpen = openIndex === i

            return (
              <div
                key={i}
                className="relative"
                onMouseEnter={() => setOpenIndex(i)}
                onMouseLeave={() => setOpenIndex(null)}
              >                
                <button
                  type="button"
                  className="inline-flex items-center gap-1 py-3 font-semibold cursor-pointer text-secondary-dark"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span>{item.dropdown?.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <Dropdowns
                  isOpen={isOpen}
                  item={item}
                />
              </div>
            )
          }

          return null
        })}

        {/* Optional Search Section */}
        {/* <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link> */}

      </div>

      <CTASection cta={data.cta} />
    </nav>
  )

}


