import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: 'https://www.rewritepal.com/sitemap.xml',
    host: 'https://www.rewritepal.com',
  }
}
