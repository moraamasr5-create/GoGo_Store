import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gogodesigns.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/order/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
