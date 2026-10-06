import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gogodesigns.com';

  // 1. Static & Trust pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/set-builder`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products?category=gift_sets`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products?category=ready_sets`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products?collection=ramadan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products?filter=unfinished`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. Dynamic Product pages from Supabase
  try {
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at, created_at')
      .eq('is_active', true);

    const productPages: MetadataRoute.Sitemap = (products || []).map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(p.created_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return staticPages;
  }
}
