import React from 'react';
import { Metadata } from 'next';
import { FileText, Shield, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'الشروط والأحكام | Gogo Designs',
  description: 'الشروط والأحكام المنظمة لطلبات الشراء، تنفيذ القطع المخصصة، وسياسة السداد في متجر Gogo Designs.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-6 sm:py-12 md:py-16 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2.5 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200/80 dark:bg-stone-800 text-brass-700 dark:text-brass-300 text-xs font-bold shadow-xs">
          <FileText className="w-3.5 h-3.5 text-brass-500" />
          <span>الاتفاقية وشروط التعامل</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
          الشروط والأحكام
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
          توضح هذه الشروط حقوق والتزامات كل من العميل ومتجر Gogo Designs لضمان تجربة شراء شفافة وموثوقة.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-6 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brass-500" />
            <span>1. طبيعة المنتجات المصنوعة يدوياً</span>
          </h2>
          <p>
            جميع القطع المعروضة في المتجر مصنوعة ومصبوبة يدوياً، ولذلك قد توجد اختلافات طفيفة جداً وطبيعية في تموجات الألوان أو الفقاعات الدقيقة على السطح، وهو ما يعكس أصالة الحرفة اليدوية ولا يُعد عيباً في الصناعة.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-stone-100 dark:border-stone-800">
          <h2 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brass-500" />
            <span>2. تأكيد الطلبات وسداد العربون</span>
          </h2>
          <p>
            يُعد الطلب مؤكداً فقط بعد تحويل عربون بنسبة 50% من إجمالي قيمة المنتجات ورفع إيصال التحويل، حيث يبدأ تجهيز وصب القطع خصيصاً بناءً على هذا التأكيد.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-stone-100 dark:border-stone-800">
          <h2 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brass-500" />
            <span>3. التعديل والإلغاء</span>
          </h2>
          <p>
            يمكن للعميل طلب تعديل الألوان أو إلغاء الطلب واسترداد العربون كاملاً خلال <strong>12 ساعة</strong> من تقديم الطلب فقط، وقبل بدء مرحلة خلط وصب القطع.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-stone-100 dark:border-stone-800">
          <h2 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brass-500" />
            <span>4. القطع المنقوشة بأسماء مخصصة</span>
          </h2>
          <p>
            القطع التي تم نقشها بأسماء أو عبارات خاصة بناءً على طلب العميل لا يمكن استرجاعها بعد التنفيذ إلا في حال وجود خطأ إملائي من جانبنا مخالف لما هو مكتوب في نموذج الطلب.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-stone-100 dark:border-stone-800">
          <h2 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brass-500" />
            <span>5. الاستلام والمعاينة</span>
          </h2>
          <p>
            يلتزم العميل بمعاينة الطرد وسلامة القطع في حضور مندوب شركة الشحن وسداد المبلغ المتبقي، وفي حال وجود كسر يتم توثيقه بالصورة فوراً لاتخاذ إجراءات الاستبدال الفوري.
          </p>
        </section>

      </div>

    </div>
  );
}
