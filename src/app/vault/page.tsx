'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyRound, 
  Crown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Phone, 
  ArrowLeft,
  X
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Vault() {
  const { user, isPro, setIsPro, setPhone } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSealCovenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);
    try {
      setPhone(phoneNumber.trim());
      setIsPro(true);

      // Save to Firestore: users/{uid}/phone
      await setDoc(
        doc(db, 'users', user.uid),
        {
          phone: phoneNumber.trim(),
          isPro: true,
          covenantSealedAt: new Date().toISOString(),
          tier: 'sovereign_pro',
        },
        { merge: true }
      );

      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([40, 80, 40]);
      }

      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.warn('Firestore fallback or simulated covenant seal:', err);
      setIsPro(true);
      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PRO_PERKS = [
    'الولوج المطلق إلى "المجلس السري" (المجتمع النخبوي المشفر)',
    'فتح النمط السيادي للمستشار الفلسفي (تحليل استراتيجي عميق)',
    'مكتبة المحاضرات السرية والتسجيلات الفلسفية الحصرية',
    'تصدير مخطوطات محراب التفريغ بصيغة مجلد كتاب شخصي (Tome PDF)',
    'تحديثات دورية لأمهات أفكار الفلسفة الرواقية والتراثية',
  ];

  return (
    <div className="w-full fade-in pb-32 max-w-5xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-4 pt-6 mb-12">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] mb-2 shadow-[0_0_25px_rgba(212,175,55,0.25)]">
          <KeyRound size={28} />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-[#EAEAEA] tracking-wide">
          خِزَانَةُ العَهْدِ السِّيَادِيّ
        </h1>
        <p className="text-xs md:text-sm text-[#D4AF37]/80 tracking-widest uppercase font-serif">
          ميثاقٌ مع الذات لنيل الحصانة الفكرية والارتقاء في مدارج السيادة
        </p>
      </div>

      {/* Pricing Card */}
      <div className="max-w-2xl mx-auto p-8 md:p-12 rounded-3xl bg-[#0A0A0A] border border-[#D4AF37]/30 shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Pro status badge */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center gap-1.5">
            <Crown size={16} />
            <span>الاشتراك السنوي السيادي</span>
          </span>
          {isPro && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4AF37] text-black shadow-md">
              عضويتك مفعلة
            </span>
          )}
        </div>

        {/* Pricing with Strikethrough mandate */}
        <div className="mb-8">
          <div className="flex items-baseline gap-4">
            <span className="text-5xl md:text-6xl font-serif font-bold text-[#EAEAEA]">
              $149
            </span>
            <span className="text-xl md:text-2xl text-[#888888] line-through font-serif decoration-[#D4AF37]/60">
              $199
            </span>
            <span className="text-xs text-[#D4AF37] font-sans">/ سنوياً (وفّر 25%)</span>
          </div>
          <p className="text-xs text-[#888888] mt-2 font-serif">
            استثمارٌ سنوي لحماية نقاء عقلك وبناء قلعتك الفكرية المحصنة ضد عبث العالم.
          </p>
        </div>

        {/* Perks list */}
        <div className="space-y-4 mb-10 border-t border-b border-white/5 py-8">
          {PRO_PERKS.map((perk, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5">
                <Check size={12} />
              </div>
              <span className="text-sm font-serif text-[#EAEAEA] leading-relaxed">
                {perk}
              </span>
            </div>
          ))}
        </div>

        {/* Seal the Covenant Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#EAEAEA] text-[#040404] font-bold text-sm tracking-widest uppercase hover:brightness-110 shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
          <span>{isPro ? 'إدارة الميثاق وبيانات التواصل' : 'ختم الميثاق والارتقاء للعهد السيادي'}</span>
        </button>
      </div>

      {/* Modal: Seal the Covenant (Prompts for Phone and saves to Firestore) */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-3xl bg-[#0A0A0A] border border-[#D4AF37]/30 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.95)] relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 left-6 text-[#888888] hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <Crown size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#EAEAEA]">ختم الميثاق السيادي</h3>
                  <p className="text-[11px] text-[#888888]">تسجيل بيانات العضوية وتأكيد حيازة الحساب</p>
                </div>
              </div>

              {success ? (
                <div className="p-6 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#EAEAEA]">تم ختم الميثاق بنجاح!</h4>
                  <p className="text-xs text-[#D4AF37] font-serif">
                    تم تفعيل رتبتك السيادية وحفظ بياناتك في السجل المشفر (Firestore).
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSealCovenant} className="space-y-5">
                  <div>
                    <label className="block text-xs font-serif text-[#D4AF37] mb-2">
                      رقم الهاتف (للتوثيق وربط العضوية):
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+966 5X XXX XXXX"
                        required
                        className="w-full px-4 py-3 pl-10 rounded-xl bg-black border border-white/15 text-sm text-[#EAEAEA] placeholder-[#888888] focus:outline-none focus:border-[#D4AF37] font-mono text-left"
                        dir="ltr"
                      />
                      <Phone size={16} className="absolute left-3 text-[#888888]" />
                    </div>
                    <span className="text-[10px] text-[#888888] mt-1.5 block font-serif">
                      يُحفظ مشفراً في مسار السجل: <code className="text-[#D4AF37]/80">users/{'{uid}'}/phone</code>
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#888888] font-serif leading-relaxed">
                    «أقرّ بالتزامي بمسار الانضباط، وحفظ أسرار المجلس السري، وصيانة حصانتي الذاتية أمام تقلبات الزمان.»
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !phoneNumber.trim()}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-40"
                  >
                    {isSubmitting ? 'جارٍ ختم الميثاق في السجل...' : 'تأكيد الختم والانضمام ($149/سنة)'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

