'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Minus, Plus, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { Product } from '@/types/database';
import { useCart } from '@/components/cart/CartContext';
import { Button } from '@/components/ui/Button';
import { formatPrice, getCategoryLabel } from '@/lib/utils';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, items } = useCart();
  const colors = Array.isArray(product.colors) ? product.colors : [];
  
  const [selectedColor, setSelectedColor] = useState<string>(colors.length > 0 ? colors[0] : '');
  const [customText, setCustomText] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const isOutOfStock = product.stock <= 0;
  const isInCart = items.some(item => item.product_id === product.id);

  const maxChars = product.personalization_max_chars ?? 50;
  const personalizationLabel = product.personalization_label || 'كتابة الأسماء أو عبارة الإهداء (تخصيص مجاني):';
  const categoryLabel = getCategoryLabel(product.category);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const customAttributes = product.allow_personalization && customText.trim().length > 0
      ? { custom_text: customText.trim() }
      : undefined;

    addItem(product, quantity, selectedColor || undefined, customAttributes);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  };

  const hasCustomText = customText.trim().length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
      
      {/* 1. Left Column: Gallery / Image with Subtle Live Overlay */}
      <div className="md:col-span-6 sticky top-20 sm:top-24">
        <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-sand-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={`${product.name_ar} - تحفة وديكور منزلي يدوي`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              <span>بدون صورة</span>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center">
              <span className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-sm shadow-md">
                نفذت الكمية حالياً
              </span>
            </div>
          )}

          {/* Subtle Live Personalization Overlay on Image */}
          {product.allow_personalization && hasCustomText && !isOutOfStock && (
            <div className="absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border border-white/60 dark:border-stone-700 text-center shadow-lg transition-all duration-300 pointer-events-none">
              <div className="text-[10px] font-bold text-brass-700 dark:text-brass-400 flex items-center justify-center gap-1 mb-0.5">
                <Sparkles className="w-3 h-3 text-brass-500" />
                <span>معاينة العبارة على القطعة</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-sand-100 break-words line-clamp-2 leading-relaxed">
                {customText}
              </p>
            </div>
          )}
        </div>

        {/* Handmade Notice Card */}
        <div className="mt-4 p-4 rounded-2xl bg-sand-100/80 dark:bg-stone-900 border border-sand-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-brass-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>صناعة يدوية بتركيز ودقة:</strong> كل قطعة تُصب يدوياً بتشطيب ناعم وألوان متناسقة لتضفي لمسة راقية ودافئة على منزلك ✨
          </p>
        </div>
      </div>

      {/* 2. Right Column: Product Details & Purchase Form */}
      <div className="md:col-span-6 flex flex-col space-y-6">
        
        {/* Title & Category */}
        <div>
          <span className="inline-block px-3 py-1 text-xs font-bold bg-sand-200 dark:bg-stone-800 text-stone-800 dark:text-brass-400 rounded-full mb-3">
            {categoryLabel}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight mb-2">
            {product.name_ar}
          </h1>
          {product.name_en && (
            <p className="text-xs text-stone-500 dark:text-stone-400 font-mono" dir="ltr">
              {product.name_en}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="py-3 sm:py-4 border-y border-stone-200/80 dark:border-stone-800 flex flex-wrap items-baseline gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl font-black text-stone-950 dark:text-white font-mono whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
          <span className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400">
            (عربون 50% لتأكيد حجز وتنفيذ القطعة)
          </span>
        </div>

        {/* Description */}
        <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed space-y-2">
          {product.description_ar && <p>{product.description_ar}</p>}
          <p className="text-stone-500 dark:text-stone-400 text-xs">
            قطعة ديكورية مصنوعة يدوياً بتشطيب ناعم ومظهر راقٍ وألوان هادئة تناسب الديكورات العصرية والبسيطة، وتجمع بين القيمة الجمالية والعملية ✨
          </p>
        </div>

        {/* Technical Specifications */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs">
          {product.dimensions && (
            <div>
              <span className="text-stone-400 dark:text-stone-500 block mb-0.5">الأبعاد والمقاس</span>
              <span className="font-mono font-bold text-stone-800 dark:text-stone-200" dir="ltr">{product.dimensions}</span>
            </div>
          )}
          {product.weight_approx && (
            <div>
              <span className="text-stone-400 dark:text-stone-500 block mb-0.5">الوزن التقريبي</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">{product.weight_approx}</span>
            </div>
          )}
          <div>
            <span className="text-stone-400 dark:text-stone-500 block mb-0.5">طريقة الصنع</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">صب ومعالجة يدوية كاملة</span>
          </div>
          <div>
            <span className="text-stone-400 dark:text-stone-500 block mb-0.5">الملمس والسطح</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">ناعم ومحمي بطبقة عزل</span>
          </div>
        </div>

        {/* Colors Selector (if any) */}
        {colors.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                اللون / التموج المفضل:
              </label>
              <span className="text-[11px] text-stone-400 font-medium">ألوان هادية ومودرن</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-stone-900 dark:bg-brass-500 text-white dark:text-stone-950 shadow-sm ring-2 ring-stone-900 dark:ring-brass-400 ring-offset-2 dark:ring-offset-stone-950 scale-102'
                        : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Personalization Section & Live Preview (Only if allow_personalization is true) */}
        {product.allow_personalization && (
          <div className="p-4 sm:p-5 rounded-2xl bg-sand-100/70 dark:bg-stone-900/90 border border-sand-300/80 dark:border-stone-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="product-personalization-text"
                className="text-xs font-bold text-stone-900 dark:text-brass-400 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-brass-600 dark:text-brass-400 shrink-0" />
                <span>{personalizationLabel}</span>
              </label>
              <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500" dir="ltr">
                {customText.length} / {maxChars}
              </span>
            </div>

            <input
              id="product-personalization-text"
              type="text"
              value={customText}
              maxLength={maxChars}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="مثال: منى & أحمد أو عبارة إهداء خاصة..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 transition-all shadow-xs"
            />

            {/* Live Personalization Preview Card */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-stone-950 border border-sand-300/90 dark:border-stone-800 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-[11px] border-b border-sand-200/80 dark:border-stone-800/80 pb-2">
                <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brass-500" />
                  <span>معاينة حية لتنسيق النقش</span>
                </span>
                {selectedColor && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-sand-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">
                    اللون: <strong>{selectedColor}</strong>
                  </span>
                )}
              </div>

              {/* Visual Canvas / Preview Box with reserved height to eliminate CLS */}
              <div className="min-h-[58px] rounded-lg bg-sand-50/90 dark:bg-stone-900/80 border border-dashed border-sand-300 dark:border-stone-700 flex items-center justify-center p-3 text-center transition-colors">
                {hasCustomText ? (
                  <div className="space-y-1 max-w-full">
                    <span className="inline-block px-3 py-1 rounded-md bg-white/90 dark:bg-stone-800/90 text-stone-900 dark:text-sand-100 font-extrabold text-xs sm:text-sm tracking-wide border border-sand-300/70 dark:border-stone-700 shadow-xs break-words">
                      {customText}
                    </span>
                  </div>
                ) : (
                  <span className="text-stone-400 dark:text-stone-500 text-xs select-none">
                    اكتب العبارة لتظهر المعاينة هنا ✨
                  </span>
                )}
              </div>

              {/* Trust Disclaimer */}
              <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-normal text-center">
                ✨ معاينة تصورية لتنسيق العبارة — يتم ضبط الخط والموضع بتوازن أثناء التنفيذ.
              </p>
            </div>
          </div>
        )}

        {/* Stock availability indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-stone-600 dark:text-stone-400">حالة القطعة:</span>
          {isOutOfStock ? (
            <span className="font-bold text-rose-600 dark:text-rose-400">نفذت الكمية حالياً</span>
          ) : (
            <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>متاحة للتنفيذ بأمر الله 🌸 ({product.stock} قطع متوفرة)</span>
            </span>
          )}
        </div>

        {/* Quantity Selector & Add Button */}
        {!isOutOfStock && (
          <div className="flex items-center gap-3 pt-2">
            
            {/* Quantity Controls */}
            <div className="flex items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-1 shadow-xs min-h-[48px]">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 transition-colors"
                aria-label="تقليل الكمية"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="w-10 text-center font-mono font-black text-sm text-stone-900 dark:text-white select-none">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                disabled={quantity >= product.stock}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 transition-colors"
                aria-label="زيادة الكمية"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="lg"
              className="flex-1"
              leftIcon={justAdded ? <Check className="w-4 h-4 text-emerald-300" /> : <ShoppingBag className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
            >
              {justAdded ? 'تمت الإضافة للسلة! ✨' : 'أضيفي للسلة'}
            </Button>

          </div>
        )}

        {/* Cart quick link if already added */}
        {isInCart && (
          <div className="pt-1">
            <Link href="/cart" className="block">
              <Button variant="secondary" size="md" className="w-full" rightIcon={<ArrowLeft className="w-4 h-4" />}>
                الذهاب إلى السلة للمعاينة وتأكيد الطلب
              </Button>
            </Link>
          </div>
        )}

        {/* Set Building & Customization Microcopy */}
        <div className="p-4 rounded-2xl bg-sand-50 dark:bg-stone-900 border border-sand-200/80 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 space-y-2">
          <p className="font-bold text-stone-900 dark:text-white">
            اختاري، ركّبي، واعملي ستايلك بنفسك ✨
          </p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
            تقدري تقتني قطعة واحدة أو تكوّني الطقم اللي يعجبك حسب ذوقك واحتياجك وتنسقيه مع بيتك.
          </p>
          <p className="text-[11px] text-brass-700 dark:text-brass-400 font-medium pt-1.5 border-t border-sand-200/60 dark:border-stone-800">
            ومتاح تنفيذ أي ألوان والأشكال اللي معروضة حالياً متاحة بأمر الله. لو حابة استفسار ابعتي لنا خاص 🙋‍♀️💜
          </p>
        </div>

      </div>

    </div>
  );
}
