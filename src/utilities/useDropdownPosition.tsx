import { useEffect, useState, RefObject } from 'react'

export function useDropdownPosition(
  isOpen: boolean,
  dropdownRef: RefObject<HTMLElement | null>
) {
  const [xOffset, setXOffset] = useState('-50%')

  useEffect(() => {
    if (!isOpen) {
      setXOffset('-50%')
      return
    }

    const dropdown = dropdownRef.current
    const container = dropdown?.closest('nav')

    if (!dropdown || !container) return

    dropdown.style.left = '50%'
    dropdown.style.transform = 'translateX(-50%)'

    requestAnimationFrame(() => {
      const dropdownRect = dropdown.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      const overflowLeft = containerRect.left - dropdownRect.left
      const overflowRight = dropdownRect.right - containerRect.right

      if (overflowLeft > 0) {
        setXOffset(`calc(-50% + ${overflowLeft}px)`)
      } else if (overflowRight > 0) {
        setXOffset(`calc(-50% - ${overflowRight}px)`)
      } else {
        setXOffset('-50%')
      }
    })
  }, [dropdownRef, isOpen])

  return xOffset
}

