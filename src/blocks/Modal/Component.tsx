'use client'

/**
 * Modal Block Component
 * ---------------------------
 *
 */

import React from 'react'
import type { ModalBlock as ModalBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { CMSLink } from '../../components/Link'
import { getBackgroundColor } from '@/utilities/getLayoutStyles'
import { X } from 'lucide-react'
import { closeModal } from '@/utilities/modal'

export const ModalBlock: React.FC<ModalBlockProps> = ({
  background,
  richText,
  links,
  targetId,
}) => {
  const backgroundColor = getBackgroundColor(background ?? '')

  const handleClose = () => {
    if (targetId) closeModal(targetId)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && targetId) {
      handleClose()
    }
  }

  return (
    <section id={targetId} className="relative z-200 opacity-0 pointer-events-none transition-opacity duration-300" role="dialog">
        <div className="fixed inset-0 bg-slate-500/75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0" onClick={handleBackdropClick}>
                <div className={`relative transform overflow-hidden rounded-xl ${backgroundColor} p-5 text-left shadow-xl transition-all sm:my-8 w-full max-w-2xl sm:p-6`}>
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>

                    <div className='pt-5 w-full flex flex-col justify-center'>
                        <div className="mb-6">
                            {richText && (
                                <RichText data={richText} />
                            )}
                        </div>
                        <div className="gap-4 flex items-center">
                            {(links || []).map((item, i) => (
                                item.link ? (
                                    <CMSLink key={i} {...item.link} />
                                ) : null
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}