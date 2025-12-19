import { getPayload } from 'payload';
import configPromise from '@payload-config';
import type { Page } from '@/payload-types';
import { draftMode } from 'next/headers'

/**
 * Fetches a single page from the 'pages' collection by slug and audience.
 *
 * Uses draft mode to optionally retrieve unpublished content.
 *
 * @param slug - The slug of the page to fetch
 * @param audience - The audience to filter the page by
 * @returns A Promise resolving to the matched Page document or null if not found
 */
export async function fetchPageBySlug(slug: string): Promise<Page | null> {

    const { isEnabled: draftEnabled } = await draftMode()

    const payload = await getPayload({ config: configPromise });

    const page = await payload.find({
        collection: 'pages',
        draft: draftEnabled,
        limit: 1,
        overrideAccess: draftEnabled,
        where: {
            fullPath: { equals: slug },
        },
    });

    return page.docs[0] || null;
    
}
