'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Plus, 
  Check, 
  Star, 
  Sparkles, 
  Heart, 
  Gift, 
  Layers, 
  Palette, 
  Moon 
} from 'lucide-react';
import { Product } from '@/types/database';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import { useCart } from '@/components/cart/CartContext';

interface ProductCardProps {
  product: Product;
  featuredBadge?: string;
  priority?: boolean;
}

export default function ProductCard({ product, featuredBadge, priority = false }: ProductCardProps) {
  const { addItem, items } = useCart();
  const isOutOfStock = product.stock <= 0;
  const isInCart = items.some(item => item.product_id === product.id);
  const [isLiked, setIsLiked] = useState(false);

  // Smart commercial badge with structured icon & label
  const getBadgeConfig = () => {
    if (featuredBadge) {
      return { label: featuredBadge, icon: null };
    }
    if (product.allow_personalization) {
      return { label: 'قابل للتخصيص', icon: Sparkles };
    }
    if (product.category === 'gift_sets') {
      return { label: 'طقم هدايا', icon: Gift };
    }
    if (product.category === 'ready_sets') {
      return { label: 'طقم ديكور', icon: Layers };
    }
    if (product.is_unfinished) {
      return { label: 'بدون فنش', icon: Palette };
    }
    if (product.collection === 'ramadan') {
      return { label: 'رمضان', icon: Moon };
    }
    if (product.stock <= 3 && product.stock > 0) {
      return { label: 'قطع محدودة', icon: null };
    }
    return null;
  };

  const badgeConfig = getBadgeConfig();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
  };

  return (
    <div className="group relative flex flex-col h-full rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs hover:shadow-md hover:border-brass-500/40 dark:hover:border-brass-400/40 transition-all duration-300 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. PRODUCT IMAGE (THE HERO)                                               */}
      {/* ========================================================================= */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full bg-sand-100/70 dark:bg-stone-800/80 overflow-hidden block shrink-0"
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name_ar}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 dark:text-stone-500 bg-sand-100 dark:bg-stone-800">
            <span className="text-xs font-semibold">بدون صورة</span>
          </div>
        )}

        {/* Subtle Ambient Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges & Actions Overlay */}
        <div className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 left-2 sm:left-2.5 z-10 flex items-center justify-between pointer-events-none">
          {badgeConfig ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-stone-900/95 backdrop-blur-md text-stone-800 dark:text-sand-100 rounded-full border border-stone-200/80 dark:border-stone-700/80 shadow-xs pointer-events-auto">
              {badgeConfig.icon && <badgeConfig.icon className="w-3 h-3 text-brass-600 dark:text-brass-400" />}
              <span>{badgeConfig.label}</span>
            </span>
          ) : <span />}

          {/* Favorite Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md flex items-center justify-center text-stone-400 hover:text-rose-500 dark:hover:text-rose-400 shadow-xs border border-stone-200/80 dark:border-stone-700/80 transition-all duration-200 pointer-events-auto active:scale-90"
            aria-label="إعجاب بالقطعة"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-950/65 backdrop-blur-[1px] flex items-center justify-center z-20">
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] sm:text-xs font-bold shadow-md tracking-wide">
              نفذت الكمية حالياً
            </span>
          </div>
        )}
      </Link>

      {/* ========================================================================= */}
      {/* 2. CARD CONTENT & METRICS                                                 */}
      {/* ========================================================================= */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3 bg-white dark:bg-stone-900">
        
        <div>
          {/* Category & Craft Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 mb-1 font-semibold">
            <span className="truncate">{getCategoryLabel(product.category)}</span>
            <div className="flex items-center gap-0.5 text-brass-600 dark:text-brass-400 font-bold font-mono shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-brass-500 text-brass-500" />
              <span>4.9</span>
            </div>
          </div>

          {/* Product Title (Balanced Height) */}
          <Link 
            href={`/product/${product.slug}`} 
            className="block group-hover:text-brass-600 dark:group-hover:text-brass-400 transition-colors"
          >
            <h3 className="font-extrabold text-stone-900 dark:text-sand-100 text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-center">
              {product.name_ar}
            </h3>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 3. PRICE & RESPONSIVE CTA                                                 */}
        {/* ========================================================================= */}
        <div className="pt-2 sm:pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-1.5 sm:gap-2">
          
          {/* Price */}
          <div className="flex flex-col min-w-0 shrink-0">
            <span className="text-[8px] sm:text-[9px] uppercase font-bold text-stone-400 dark:text-stone-500 leading-none mb-0.5">
              السعر
            </span>
            <span className="text-xs sm:text-sm md:text-base font-black text-stone-950 dark:text-white font-mono tracking-tight whitespace-nowrap">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Add to Cart CTA */}
          {isOutOfStock ? (
            <span className="h-8 sm:h-9 px-2 sm:px-2.5 text-[10px] sm:text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center justify-center cursor-not-allowed">
              غير متوفر
            </span>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`h-8 sm:h-9 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 active:scale-95 shadow-xs shrink-0 min-h-[36px] ${
                isInCart
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-brass-400'
              }`}
              title={isInCart ? 'في السلة' : 'أضف للطلب'}
              aria-label={`أضف ${product.name_ar} للسلة`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">في السلة</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-brass-400 dark:text-stone-950 shrink-0" />
                  <span className="hidden sm:inline">اختيار</span>
                </>
              )}
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

