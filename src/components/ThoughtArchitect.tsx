'use client';

import { useState } from 'react';
import {  Layers, ArrowRight, Check, BookOpen } from 'lucide-react';

interface StructuredFramework {
  title: string;
  thesis: string;
  antithesis: string;
  sovereignVerdict: string;
}

export default function ThoughtArchitect() {
  const [rawThought, setRawThought] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<'stoic' | 'hegelian' | 'cartesian'>('stoic');
  const [structuredResult, setStructuredResult] = useState<StructuredFramework | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleSynthesize = () => {
    if (!rawThought.trim()) return;
    setIsSynthesizing(true);

    setTimeout(() => {
      let result: StructuredFramework;

      if (selectedFramework === 'stoic') {
        result = {
          title: 'إعادة الهيكلة وفق ميزان الثنائية الرواقية',
          thesis: 'ما يقع خارج سلطانك (المعطيات الخارجية): تقلبات الأوضاع، آراء المحيطين، وتصرفات الغير التي لا حيلة لك في ردها.',
          antithesis: 'ما يقع داخل حصنك (السلطان المحض): حكمك الذهني، نقاء ضميرك، وزاوية استجابتك الصارمة أمام هذا العارض.',
          sovereignVerdict: 'القرار السيادي: تخلَّ عن رغبة تطويع ما لا تملك، ووجّه كامل طاقتك لإتقان واجبك اللحظي برباطة جأش.',
        };
      } else if (selectedFramework === 'hegelian') {
        result = {
          title: 'التركيب الجدلي الثلاثي (المسار الهيغلي)',
          thesis: 'الأطروحة الأصلية: رغبتك في تحقيق الاستقرار التام والاطمئنان الدائم دون معارك وجودية.',
          antithesis: 'نقيض الأطروحة: حتمية الصراع والعشوائية التي تفرضها نواميس الحياة المعاصرة.',
          sovereignVerdict: 'التركيب السيادي الأسمى: الاستقرار ليس غياب العاصفة، بل هو القدرة على التوازن والسيادة في قلب الاضطراب ذاته.',
        };
      } else {
        result = {
          title: 'منهج الشك والتأسيس اليقيني (الغزالي / ديكارت)',
          thesis: 'الظن الشائع: التوهم بأن هذا القلق نابع من خطورة الموقف الخارجي ذاته.',
          antithesis: 'تفكيك الشك: تجريد كل الافتراضات المسبقة، واختبار مدى صحة المخاوف عبر محاكمة منطقية صارمة.',
          sovereignVerdict: 'اليقين التأسيسي: لا حقيقة مطلقة لما تتوجس منه إلا في مخيلتك؛ ابدأ من نقطة الصفر وارفض كل خوف بلا برهان.',
        };
      }

      setStructuredResult(result);
      setIsSynthesizing(false);
    }, 1200);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/20 shadow-[0_15px_35px_rgba(0,0,0,0.6)] relative overflow-hidden" dir="rtl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
        <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
          <Layers size={18} />
        </div>
        <div>
          <h3 className="font-serif text-lg text-[#EAEAEA] font-semibold">طور أفكارك (هندسة المعنى)</h3>
          <p className="text-[11px] text-[#888888]">حوّل الخواطر المشوشة إلى أطر فلسفية محكمة تدعم اتخاذ القرار</p>
        </div>
      </div>

      {/* Framework tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: 'stoic', label: 'الفرز الرواقي' },
          { id: 'hegelian', label: 'الجدل الهيغلي' },
          { id: 'cartesian', label: 'الشك المنهجي' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFramework(f.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedFramework === f.id
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
                : 'bg-white/5 text-[#888888] hover:text-[#EAEAEA]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-4">
        <textarea
          value={rawThought}
          onChange={(e) => setRawThought(e.target.value)}
          placeholder="دوّن الفكرة أو المعضلة المشوشة التي تدور في خلدك الآن دون تكلف..."
          rows={3}
          className="w-full p-4 rounded-xl bg-black border border-white/10 text-xs text-[#EAEAEA] placeholder-[#888888] focus:outline-none focus:border-[#D4AF37]/50 font-serif leading-relaxed"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSynthesize}
            disabled={!rawThought.trim() || isSynthesizing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-xs font-bold hover:brightness-110 disabled:opacity-40 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-pure)] shadow-[0_0_8px_var(--gold-pure)]" />
            <span>{isSynthesizing ? 'جارٍ صياغة الإطار الفلسفي...' : 'هندسة الفكرة'}</span>
          </button>
        </div>
      </div>

      {/* Result Display */}
      {structuredResult && (
        <div className="mt-6 p-5 rounded-xl bg-[#050505] border border-[#D4AF37]/30 animate-fadeIn space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <BookOpen size={15} className="text-[#D4AF37]" />
            <span className="text-xs font-serif font-bold text-[#D4AF37]">
              {structuredResult.title}
            </span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed font-serif">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-[#888888] block text-[10px] uppercase font-sans mb-1">المنطلق الأول:</span>
              <p className="text-[#EAEAEA]">{structuredResult.thesis}</p>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-[#888888] block text-[10px] uppercase font-sans mb-1">المعاينة النقدية:</span>
              <p className="text-[#EAEAEA]">{structuredResult.antithesis}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30">
              <span className="text-[#D4AF37] block text-[10px] font-bold font-sans mb-1">المحصلة السيادية:</span>
              <p className="text-[#EAEAEA] font-semibold">{structuredResult.sovereignVerdict}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


