import { withPayload } from '@payloadcms/next/withPayload'

const isDev = process.env.NODE_ENV === 'development'
const isPreview = process.env.VERCEL_ENV === 'preview'

const allowedDomains = process.env.ALLOWED_DOMAINS
  ? process.env.ALLOWED_DOMAINS.split(',').map(url => {
      try {
        return new URL(url.trim()).hostname
      } catch {
        return url.trim()
      }
    })
  : []

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['tenant-site-name'],
  images: {
    unoptimized: isPreview,
    remotePatterns: isDev
      ? [{ protocol: 'http', hostname: 'localhost', port: '3000' }]
      : [
          // Map all allowed domains to remote patterns
          ...allowedDomains.map(hostname => ({
            protocol: 'https',
            hostname: hostname,
          })),
          // Add Vercel blob storage
          { protocol: 'https', hostname: 'blob.vercel-storage.com' },
        ],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  }
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

