/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  let processedUrl = url
  
  // If URL has http/https protocol, extract just the pathname
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url)
      processedUrl = urlObj.pathname
    } catch (e) {
      console.error('Error parsing media URL:', e)
      processedUrl = url
    }
  }

  // Add cache tag if provided
  if (cacheTag && cacheTag !== '') {
    const encodedTag = encodeURIComponent(cacheTag)
    return `${processedUrl}?${encodedTag}`
  }

  return processedUrl
}