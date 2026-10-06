import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getProductBySlug } from '@/lib/supabase';
import { getCategoryLabel } from '@/lib/utils';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 60;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gogodesigns.com';

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: 'المنتج غير متوفر',
      description: 'المنتج المطلوب غير موجود أو تم إيقافه.',
    };
  }

  const categoryLabel = getCategoryLabel(product.category);
  const title = `${product.name_ar} | ${categoryLabel}`;
  const description = product.description_ar || `${product.name_ar} - قطعة ديكورية فاخرة مصنوعة ومصبوبة يدوياً بتشطيب ناعم وألوان هادئة تضيف لمسة راقية لمنزلك.`;
  const canonicalUrl = `/product/${product.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${canonicalUrl}`,
      images: product.image_url ? [{ url: product.image_url, width: 800, height: 800, alt: product.name_ar }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Schema.org Product Structured Data
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_ar,
    description: product.description_ar || `${product.name_ar} - قطعة ديكور يدوية فاخرة`,
    image: product.image_url ? [product.image_url] : [],
    brand: {
      '@type': 'Brand',
      name: 'Gogo Designs',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/product/${product.slug}`,
      priceCurrency: 'EGP',
      price: product.price,
      priceValidUntil: '2027-12-31',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  // Schema.org BreadcrumbList Structured Data
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
        name: 'المنتجات',
        item: `${siteUrl}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name_ar,
        item: `${siteUrl}/product/${product.slug}`,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-8 md:py-12">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-stone-500 dark:text-stone-400 mb-4 sm:mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
        <Link href="/" className="hover:text-stone-900 dark:hover:text-white shrink-0">الرئيسية</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-stone-900 dark:hover:text-white shrink-0">المنتجات</Link>
        <span>/</span>
        <span className="text-stone-900 dark:text-stone-200 font-bold truncate">{product.name_ar}</span>
      </nav>

      {/* Product Detail Interactive View (Image Gallery + Live Preview + Details + Cart CTA) */}
      <ProductDetailClient product={product} />

    </div>
  );
}
