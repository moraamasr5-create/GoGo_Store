import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getActiveProducts } from '@/lib/supabase';
import SetBuilderClient from './SetBuilderClient';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gogodesigns.com';

export const metadata: Metadata = {
  title: 'كوّني طقمك بنفسك | تنسيق قطع الديكور المنزلي',
  description: 'اختاري القطع التي تحبينها من الصواني والمباخر والشمعدانات وقواعد الأكواب ونسّقيها معاً في طلب واحد بألوان ونقوش على ذوقك وبأعلى جودة.',
  alternates: {
    canonical: '/set-builder',
  },
  openGraph: {
    title: 'كوّني طقمك بنفسك | Gogo Designs',
    description: 'اختاري القطع التي تحبينها ونسّقيها معاً في طلب واحد.',
    url: `${siteUrl}/set-builder`,
    type: 'website',
  },
};

export default async function SetBuilderPage() {
  const allProducts = await getActiveProducts({ limit: 100 });

  // Separate bases (trays and large decor) and accents (candle holders, coasters, planters, decor)
  const baseProducts = allProducts.filter(
    p => (p.category === 'trays' || p.category === 'decor') && p.stock > 0
  );

  const accentProducts = allProducts.filter(
    p => (p.category === 'candle_holders' || p.category === 'coasters' || p.category === 'planters' || p.category === 'decor') && p.stock > 0
  );

  // Breadcrumb Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: `${siteUrl}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'كوّني طقمك',
        item: `${siteUrl}/set-builder`,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-5 sm:py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-stone-500 dark:text-stone-400 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
        <Link href="/" className="hover:text-stone-900 dark:hover:text-white shrink-0">الرئيسية</Link>
        <span>/</span>
        <span className="text-stone-900 dark:text-stone-200 font-bold truncate">كوّني طقمك</span>
      </nav>

      {/* Main Set Builder Interactive Interface */}
      <SetBuilderClient
        baseProducts={baseProducts}
        accentProducts={accentProducts}
      />

    </div>
  );
}
