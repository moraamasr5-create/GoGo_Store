'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  ShoppingBag, 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  SlidersHorizontal,
  Layers,
  Heart,
  ShieldCheck,
  X
} from 'lucide-react';
import { Product } from '@/types/database';
import { useCart } from '@/components/cart/CartContext';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface SetBuilderClientProps {
  baseProducts: Product[];
  accentProducts: Product[];
}

interface SelectedBaseItem {
  product: Product;
  selectedColor?: string;
  customText?: string;
}

interface SelectedAccentItem {
  id: string; // unique selection key
  product: Product;
  quantity: number;
  selectedColor?: string;
  customText?: string;
}

export default function SetBuilderClient({ baseProducts, accentProducts }: SetBuilderClientProps) {
  const { addItem } = useCart();

  // State
  const [selectedBase, setSelectedBase] = useState<SelectedBaseItem | null>(
    baseProducts.length > 0 ? { product: baseProducts[0], selectedColor: baseProducts[0].colors?.[0] || '' } : null
  );
  const [selectedAccents, setSelectedAccents] = useState<SelectedAccentItem[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);

  // Toggle/Select Base Piece
  const handleSelectBase = (product: Product) => {
    if (selectedBase?.product.id === product.id) {
      // already selected, keep it or swap
      return;
    }
    setSelectedBase({
      product,
      selectedColor: product.colors?.[0] || '',
      customText: '',
    });
  };

  // Accent Management
  const isAccentSelected = (productId: string) => {
    return selectedAccents.some(item => item.product.id === productId);
  };

  const toggleAccent = (product: Product) => {
    const existingIndex = selectedAccents.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      setSelectedAccents(prev => prev.filter((_, idx) => idx !== existingIndex));
    } else {
      setSelectedAccents(prev => [
        ...prev,
        {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity: 1,
          selectedColor: product.colors?.[0] || '',
          customText: '',
        },
      ]);
    }
  };

  const updateAccentQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setSelectedAccents(prev => prev.filter((_, idx) => idx !== index));
      return;
    }
    setSelectedAccents(prev => {
      const updated = [...prev];
      const maxStock = updated[index].product.stock;
      updated[index].quantity = Math.min(newQty, maxStock);
      return updated;
    });
  };

  const updateAccentColor = (index: number, color: string) => {
    setSelectedAccents(prev => {
      const updated = [...prev];
      updated[index].selectedColor = color;
      return updated;
    });
  };

  const updateAccentCustomText = (index: number, text: string) => {
    setSelectedAccents(prev => {
      const updated = [...prev];
      updated[index].customText = text;
      return updated;
    });
  };

  // Calculations for display ONLY
  const baseCount = selectedBase ? 1 : 0;
  const accentsCount = selectedAccents.reduce((acc, item) => acc + item.quantity, 0);
  const totalItemsCount = baseCount + accentsCount;

  const basePrice = selectedBase ? selectedBase.product.price : 0;
  const accentsPrice = selectedAccents.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const displayTotal = basePrice + accentsPrice;

  // Add all coordinated pieces as independent Cart Lines
  const handleAddSetToCart = () => {
    if (totalItemsCount === 0) {
      toast.error('يرجى اختيار قطعة واحدة على الأقل لتكوين طقمك');
      return;
    }

    // 1. Add base piece
    if (selectedBase) {
      const customAttributes = selectedBase.product.allow_personalization && selectedBase.customText?.trim()
        ? { custom_text: selectedBase.customText.trim() }
        : undefined;

      addItem(
        selectedBase.product,
        1,
        selectedBase.selectedColor || undefined,
        customAttributes
      );
    }

    // 2. Add all accents
    for (const accent of selectedAccents) {
      const customAttributes = accent.product.allow_personalization && accent.customText?.trim()
        ? { custom_text: accent.customText.trim() }
        : undefined;

      addItem(
        accent.product,
        accent.quantity,
        accent.selectedColor || undefined,
        customAttributes
      );
    }

    setIsAddedToCart(true);
    toast.success(`تمت إضافة قطع الطقم (${totalItemsCount} قطع) إلى السلة بنجاح! ✨`);
  };

  // Filter accent products
  const filteredAccents = accentProducts.filter(p => {
    if (activeCategoryFilter === 'all') return true;
    return p.category === activeCategoryFilter;
  });

  return (
    <div className="space-y-6 sm:space-y-10">
      
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200/80 dark:bg-stone-800 text-brass-700 dark:text-brass-300 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-brass-500" />
          <span>تنسيق يدوي حسب ذوقك</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
          كوّني طقمك 🌸
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          اختاري القطع التي تحبينها ونسّقيها معًا في طلب واحد. كل قطعة تُصب وتُشطب يدوياً بأعلى معايير الجودة والأناقة.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left / Main Column: Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          
          {/* STEP 1: Base Piece (القطعة الأساسية) */}
          <section className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 text-xs font-mono font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
                  القطعة الأساسية (صينية أو فازة كبرى)
                </h2>
              </div>
              <span className="text-[11px] text-stone-400 font-medium">اختاري قطعة واحدة</span>
            </div>

            {/* Base pieces horizontal/grid list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
              {baseProducts.map((product) => {
                const isSelected = selectedBase?.product.id === product.id;
                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelectBase(product)}
                    className={`cursor-pointer group p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all text-right flex flex-col justify-between ${
                      isSelected
                        ? 'bg-sand-100/90 dark:bg-stone-800 border-stone-900 dark:border-brass-500 shadow-sm ring-2 ring-stone-900/10 dark:ring-brass-400/20'
                        : 'bg-stone-50/50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden bg-sand-200 dark:bg-stone-800">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name_ar}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-103"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">صورة</div>
                        )}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">
                          {product.name_ar}
                        </h3>
                        <p className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300 mt-0.5">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Customization Options for Selected Base */}
            {selectedBase && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-sand-100/70 dark:bg-stone-800/60 border border-sand-200 dark:border-stone-700 space-y-3 pt-3">
                <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white">
                  <span>تخصيص: {selectedBase.product.name_ar}</span>
                  <span className="text-[11px] text-brass-700 dark:text-brass-400 font-mono">{formatPrice(selectedBase.product.price)}</span>
                </div>

                {/* Color Selector */}
                {selectedBase.product.colors && selectedBase.product.colors.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300 block">
                      اللون المفضل:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedBase.product.colors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedBase(prev => prev ? { ...prev, selectedColor: color } : null)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            selectedBase.selectedColor === color
                              ? 'bg-stone-900 dark:bg-brass-500 text-white dark:text-stone-950 shadow-xs'
                              : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personalization text input */}
                {selectedBase.product.allow_personalization && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <label className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-brass-600 dark:text-brass-400" />
                        <span>كتابة الاسم أو عبارة الإهداء:</span>
                      </label>
                      <span className="font-mono text-stone-400">
                        {(selectedBase.customText || '').length} / {selectedBase.product.personalization_max_chars || 50}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={selectedBase.customText || ''}
                      maxLength={selectedBase.product.personalization_max_chars || 50}
                      onChange={(e) => setSelectedBase(prev => prev ? { ...prev, customText: e.target.value } : null)}
                      placeholder="مثال: منى & أحمد أو عبارة إهداء خاصة..."
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400"
                    />
                  </div>
                )}
              </div>
            )}
          </section>

          {/* STEP 2: Accents & Additions (الإضافات المتناسقة) */}
          <section className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 text-xs font-mono font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
                  إضافات الطقم (مباخر، شمعدانات، كوسترات)
                </h2>
              </div>
              
              {/* Category Quick Filter */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'candle_holders', label: 'مباخر وشمعدان' },
                  { id: 'coasters', label: 'كوسترات' },
                  { id: 'decor', label: 'تحف وفازات' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategoryFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                      activeCategoryFilter === tab.id
                        ? 'bg-stone-900 dark:bg-brass-500 text-white dark:text-stone-950 shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accents grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
              {filteredAccents.map((product) => {
                const isSelected = isAccentSelected(product.id);
                return (
                  <div
                    key={product.id}
                    className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all text-right flex flex-col justify-between ${
                      isSelected
                        ? 'bg-sand-100/90 dark:bg-stone-800 border-stone-900 dark:border-brass-500 shadow-sm'
                        : 'bg-stone-50/50 dark:bg-stone-950 border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden bg-sand-200 dark:bg-stone-800">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name_ar}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">صورة</div>
                        )}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">
                          {product.name_ar}
                        </h3>
                        <p className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300 mt-0.5">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleAccent(product)}
                      className={`mt-2.5 w-full py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                          : 'bg-stone-900 dark:bg-brass-500 text-white dark:text-stone-950 shadow-xs'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <X className="w-3 h-3" />
                          <span>إزالة من الطقم</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>إضافة للطقم</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Customization Details for Selected Accents */}
            {selectedAccents.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                <h3 className="text-xs font-bold text-stone-900 dark:text-white">
                  تنسيق خيارات الإضافات المختارة:
                </h3>
                {selectedAccents.map((accent, idx) => (
                  <div
                    key={accent.id}
                    className="p-3 rounded-xl bg-sand-100/70 dark:bg-stone-800/60 border border-sand-200 dark:border-stone-700 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 dark:text-white">{accent.product.name_ar}</span>
                      
                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => updateAccentQuantity(idx, accent.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-xs">
                          {accent.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateAccentQuantity(idx, accent.quantity + 1)}
                          disabled={accent.quantity >= accent.product.stock}
                          className="w-6 h-6 flex items-center justify-center rounded text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Color selector */}
                    {accent.product.colors && accent.product.colors.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-stone-500">اللون:</span>
                        <div className="flex flex-wrap gap-1">
                          {accent.product.colors.map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => updateAccentColor(idx, color)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                accent.selectedColor === color
                                  ? 'bg-stone-900 dark:bg-brass-500 text-white dark:text-stone-950'
                                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right Column: Set Summary & Add to Cart (Sticky Sidebar) */}
        <div className="lg:col-span-4 sticky top-20 sm:top-24 space-y-4">
          
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-3.5">
            <h3 className="text-xs sm:text-sm font-black text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-2.5 flex items-center justify-between">
              <span>ملخص طقمك المنسق</span>
              <span className="font-mono text-xs text-stone-500">{totalItemsCount} قطع</span>
            </h3>

            {/* Selected Items Breakdown */}
            <div className="space-y-2 text-xs max-h-60 overflow-y-auto pr-1">
              {selectedBase ? (
                <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800/80">
                  <div className="min-w-0 pr-1">
                    <p className="font-bold text-stone-900 dark:text-white truncate">{selectedBase.product.name_ar}</p>
                    <span className="text-[10px] text-stone-400">
                      أساسي • {selectedBase.selectedColor ? `لون ${selectedBase.selectedColor}` : 'لون قياسي'}
                    </span>
                    {selectedBase.customText && (
                      <p className="text-[10px] text-brass-700 dark:text-brass-400 font-medium truncate">
                        ✨ نقش: {selectedBase.customText}
                      </p>
                    )}
                  </div>
                  <span className="font-mono font-bold text-stone-900 dark:text-white shrink-0">
                    {formatPrice(selectedBase.product.price)}
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-stone-400 italic py-1">لم تختاري قطعة أساسية بعد.</p>
              )}

              {selectedAccents.map(accent => (
                <div key={accent.id} className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800/80">
                  <div className="min-w-0 pr-1">
                    <p className="font-bold text-stone-900 dark:text-white truncate">{accent.product.name_ar}</p>
                    <span className="text-[10px] text-stone-400">
                      {accent.quantity} × {formatPrice(accent.product.price)} {accent.selectedColor ? `(${accent.selectedColor})` : ''}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-stone-900 dark:text-white shrink-0">
                    {formatPrice(accent.product.price * accent.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Display Total */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
                <span>إجمالي قيمة المعروضات:</span>
                <span className="font-mono font-black text-stone-900 dark:text-white text-sm sm:text-base">
                  {formatPrice(displayTotal)}
                </span>
              </div>
              <p className="text-[10px] text-stone-400 leading-normal">
                كل قطعة تُضاف كبند مستقل في السلة ببياناتها ولونها المختار.
              </p>
            </div>

            {/* Primary Action Button */}
            <Button
              onClick={handleAddSetToCart}
              variant="primary"
              size="lg"
              disabled={totalItemsCount === 0}
              className="w-full shadow-md h-11 sm:h-12 text-xs sm:text-sm font-bold"
              rightIcon={<ShoppingBag className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
            >
              أضيفي الطقم للسلة ({totalItemsCount} قطع)
            </Button>

            {/* Cart Link if added */}
            {isAddedToCart && (
              <Link href="/cart" className="block pt-1">
                <Button variant="secondary" size="md" className="w-full text-xs" rightIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                  الانتقال للسلة ومعاينة الطلب
                </Button>
              </Link>
            )}

            <div className="flex items-center gap-1.5 text-[10px] text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>صناعة يدوية فاخرة وتشطيب ناعم يشبه السيراميك ✨</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
