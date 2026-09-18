'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Crown,
  Lock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useStore } from '@/store/useStore';

type Tier = 'quarterly' | 'semi' | 'annual';

const TIERS = {
  quarterly: { id: 'quarterly', price: 19.99, title: 'اشتراك ربع سنوي (دفع شهري)', label: '$19.99 / شهر' },
  semi: { id: 'semi', price: 49.99, title: 'اشتراك نصف سنوي', label: '$49.99 إجمالي' },
  annual: { id: 'annual', price: 149.99, title: 'اشتراك سنوي', label: '$149.99 إجمالي' },
};

export default function VaultCheckoutPage() {
  const router = useRouter();
  const { user, isPro, setIsPro, setPhone } = useStore();
  const [selectedTier, setSelectedTier] = useState<Tier>('semi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = async () => {
    setIsSubmitting(true);

    try {
      setIsPro(true);
      await setDoc(
        doc(db, 'users', user.uid),
        {
          isPro: true,
          covenantSealedAt: new Date().toISOString(),
          tier: selectedTier,
        },
        { merge: true }
      );

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/vault');
      }, 1800);
    } catch (err) {
      console.warn('Checkout fallback activated:', err);
      setIsPro(true);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/vault');
      }, 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-16" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-3xl border border-[var(--gold-border)] bg-black/80 backdrop-blur-3xl p-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] text-black shadow-[0_0_30px_rgba(212,175,55,0.35)]">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-reem-kufi)' }}>
            تم ختم العهد السيادي
          </h1>
          <p className="mt-4 text-sm leading-8 text-[var(--gold-muted)]">
            أهلاً بك في طبقة النخبة. سيتم توجيهك إلى ملاذك الآمن الآن.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10" dir="rtl">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => router.push('/vault')}
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--gold-pure)] hover:brightness-125 transition-all"
        >
          <ArrowLeft size={16} />
          <span className="font-serif">العودة للخلف</span>
        </button>

        <div className="flex flex-col gap-10">
          
          {/* THE LOSS AVERSION STACK */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-red-900/30 bg-red-950/10 backdrop-blur-md p-8 shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-red-500" size={24} />
              <h2 className="text-2xl font-bold text-red-50" style={{ fontFamily: 'var(--font-reem-kufi)' }}>
                ماذا تخسر إن غادرت الآن؟
              </h2>
            </div>
            
            <div className="space-y-4 font-serif text-sm">
              <div className="flex justify-between items-center text-red-300/50 relative">
                <span className="relative z-10">جلسات استشارية تقليدية</span>
                <span className="relative z-10">$300/شهر</span>
                <div className="absolute inset-0 top-1/2 w-full h-[1px] bg-red-500 z-20 transform -translate-y-1/2 rotate-1" />
              </div>
              <div className="flex justify-between items-center text-red-300/50 relative">
                <span className="relative z-10">فوضى الملاحظات المتناثرة والضياع الفكري</span>
                <span className="relative z-10">هدر الوقت والطاقة</span>
                <div className="absolute inset-0 top-1/2 w-full h-[1px] bg-red-500 z-20 transform -translate-y-1/2 -rotate-1" />
              </div>
              
              <div className="pt-4 mt-4 border-t border-red-900/30 flex justify-between items-center">
                <span className="text-[var(--gold-pure)] font-bold text-lg">حماية عقلك وارتقاؤه:</span>
                <span className="text-[var(--gold-pure)] font-bold text-lg px-4 py-1 bg-[var(--gold-pure)]/10 rounded-lg border border-[var(--gold-pure)]/30">
                  يبدأ من $19.99 فقط
                </span>
              </div>
            </div>
          </motion.section>

          {/* THE 3-TIER DISPLAY */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-6 flex items-center justify-center gap-3">
              <Crown size={28} className="text-[var(--gold-pure)]" />
              <h1 className="text-3xl font-bold text-[var(--gold-pure)] text-shadow-gold" style={{ fontFamily: 'var(--font-reem-kufi)' }}>
                ميثاق العهد السيادي
              </h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {(Object.keys(TIERS) as Tier[]).map((key) => {
                const tier = TIERS[key];
                const isSelected = selectedTier === key;
                const isWise = key === 'semi';

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedTier(key)}
                    className={`relative p-6 rounded-2xl border text-right transition-all duration-300 flex flex-col ${
                      isSelected 
                        ? 'bg-[var(--gold-pure)]/10 border-[var(--gold-pure)] shadow-[0_0_30px_rgba(212,175,55,0.2)] scale-105'
                        : 'bg-black/60 border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    {isWise && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[var(--gold-pure)] text-black px-4 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-[0_0_10px_var(--gold-pure)]">
                        الخيار الأحكم
                      </div>
                    )}
                    <h3 className="font-serif text-lg text-[var(--text-primary)] mb-2">{tier.title}</h3>
                    <div className="text-2xl font-bold text-[var(--gold-pure)] mt-auto pt-4 font-mono">
                      {tier.label}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="group relative flex items-center justify-center gap-3 w-full max-w-md bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] px-6 py-5 rounded-2xl text-black font-bold shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                ) : (
                  <Lock size={18} />
                )}
                <span className="text-lg" style={{ fontFamily: 'var(--font-reem-kufi)' }}>
                  {isSubmitting ? 'جارٍ الختم...' : 'أبرم العهد الآن'}
                </span>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 border-2 border-white/40 transition-opacity pointer-events-none" />
              </button>
            </div>

          </motion.section>

          {/* THE LUXURY GUARANTEE */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-4"
          >
            <p className="text-[#888] text-xs max-w-lg mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-reem-kufi)' }}>
              ميثاق الشرف السيادي: إن لم تتسع آفاق عقلك خلال 30 يوماً، يُسترد استثمارك بنقرة.
            </p>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
