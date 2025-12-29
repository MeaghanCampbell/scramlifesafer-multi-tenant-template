import { NextResponse } from 'next/server'

export async function GET() {
  // relative URLs are fine inside sitemap index
  const body = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap><loc>/pages-sitemap.xml</loc></sitemap>
        <sitemap><loc>/posts-sitemap.xml</loc></sitemap>
    </sitemapindex>`

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
