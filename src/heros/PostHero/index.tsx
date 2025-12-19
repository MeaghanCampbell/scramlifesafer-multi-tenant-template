import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'
import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, publishedAt, title, meta } = post

  return (
    <div className="relative -mt-[10.4rem] flex items-end justify-start text-white">

    <div className="z-40 max-w-2xl mx-auto mb-8 px-4 w-full">
        <div className="flex justify-start flex-row space-x-3 font-medium uppercase text-sm mb-6">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category

                const titleToUse = categoryTitle || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <React.Fragment key={index}>
                    {titleToUse}
                    {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>

          <h1 className="mb-4 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          <p className='mb-8'>{meta?.description}</p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {publishedAt && ( <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time> )}
          </div>
        </div>
      <div className="min-h-[80vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
