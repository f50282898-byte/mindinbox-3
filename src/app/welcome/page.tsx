'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  ArrowLeft, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useStore } from '@/store/useStore';

const QUESTIONS = [
  {
    id: 1,
    text: "كيف تتعامل مع صمت الليل الطويل؟",
    options: [
      "أتأمل في اتساع الكون وأراقب",
      "أواجه أفكاري المظلمة وأحللها",
      "أبحث عن السلام الداخلي والهدوء",
      "أبني خططاً لمعارك الغد"
    ]
  },
  {
    id: 2,
    text: "عندما تنهار ثوابتك، ماذا يتبقى؟",
    options: [
      "القوانين الطبيعية الباردة",
      "إرادتي المحضة لا غير",
      "القيم النبيلة التي اخترتها",
      "القدرة على إعادة بناء كل شيء"
    ]
  },
  {
    id: 3,
    text: "ما هو أثمن ما يمكن أن يمتلكه العقل؟",
    options: [
      "الرؤية المحايدة للأشياء",
      "الجرأة على تحطيم الأوهام",
      "الحكمة لتفهم تناقضات البشر",
      "الهيمنة على الانفعالات"
    ]
  }
];

export default function WelcomeLeadMagnet() {
  const [step, setStep] = useState(0); // 0, 1, 2 = questions, 3 = result
  const [answers, setAnswers] = useState<string[]>([]);
  const router = useRouter();
  const { setDisplayName } = useStore();

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setStep(prev => prev + 1);
  };

  const handleAuth = async () => {
    if (!auth) return;
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user && result.user.displayName) {
        setDisplayName(result.user.displayName);
      }
      // Usually here you'd save the test results (answers/persona) to Firestore for this user.
      router.push('/');
    } catch (err) {
      console.error('Auth Error:', err);
      // Fallback to auth page if popup fails
      router.push('/auth');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4" dir="rtl">
      
      {/* Dynamic Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-pure)] shadow-[0_0_8px_var(--gold-pure)] unlock-pulse" />
          <span className="font-serif text-[10px] tracking-widest text-[var(--gold-muted)] uppercase">
            اختبار الهوية الفلسفية
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[var(--text-primary)]">
          العَقْلُ فِي <span className="text-[var(--gold-pure)] italic">الصُّنْدُوقِ</span>
        </h1>
      </motion.div>

      <div className="w-full max-w-xl relative">
        <AnimatePresence mode="wait">
          
          {/* ── Questions ── */}
          {step < 3 && (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 md:p-10 rounded-3xl text-center"
            >
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[var(--text-primary)] mb-8 leading-relaxed">
                {QUESTIONS[step].text}
              </h2>
              
              <div className="space-y-4">
                {QUESTIONS[step].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="w-full p-4 rounded-xl glass border-[var(--glass-border)] text-sm md:text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--gold-border)] transition-all flex items-center justify-between group"
                  >
                    <span>{opt}</span>
                    <ArrowLeft size={16} className="text-[var(--gold-muted)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </button>
                ))}
              </div>
              
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {[0, 1, 2].map((dot) => (
                  <div 
                    key={dot}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${step === dot ? 'bg-[var(--gold-pure)] scale-150' : 'bg-white/10'}`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── The Hook (Result) ── */}
          {step === 3 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden glass-gold shadow-[0_0_80px_rgba(212,175,55,0.15)]"
            >
              <div className="p-8 md:p-12 text-center pb-32">
                <p className="text-[10px] uppercase tracking-widest text-[var(--gold-muted)] mb-4 font-serif">
                  تحليل الشفرة الفلسفية
                </p>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)] mb-6">
                  أنت <span className="gold-gradient-text">"المراقب الكوني"</span>
                </h2>
                
                {/* Visible Hook text */}
                <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed font-serif">
                  لقد أظهرت إجاباتك ميلاً نادراً للانفصال العاطفي عن الفوضى. أنت لا تنفعل مع الأحداث، بل ترتفع فوقها لتراقبها كأنها ظواهر طبيعية حتمية.
                </p>
                
                {/* Abstract visualization or spacing */}
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-[var(--gold-pure)] to-transparent mx-auto my-8 opacity-50" />
                
                {/* Blurred text */}
                <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed font-serif blur-sm select-none opacity-50">
                  في أعماقك، هناك خوف خفي من فقدان السيطرة، ولهذا السبب تفضل المراقبة على المشاركة. خوارزمياتنا رصدت أنك تمتلك قدرة تحليلية تشبه فلاسفة الرواقية، لكنك تحتاج إلى تفريغ نفسي مكثف لتحويل هذه المراقبة الباردة إلى حكمة عملية. المجلس السري هو مكانك الطبيعي.
                </p>
              </div>

              {/* The Call to Action overlay */}
              <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[var(--bg-void)] via-[var(--bg-void)] to-transparent flex items-end justify-center pb-8 px-6 backdrop-blur-xl">
                <button
                  onClick={handleAuth}
                  className="w-full max-w-sm py-4 rounded-xl gold-gradient text-black font-bold text-sm md:text-base shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-3 group"
                >
                  <KeyRound size={18} className="group-hover:scale-110 transition-transform" />
                  <span>احفظ هويتك الفلسفية واكتشف ذاتك</span>
                </button>
              </div>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    </div>
  );
}


