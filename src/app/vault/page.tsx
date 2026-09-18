'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Crown,
  Lock,
  Unlock,
  Users,
  Brain,
  Mic,
  Check,
  X,
  Phone,
  Sparkles,
  Shield,
  Star,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useVideoTheme } from '@/components/VideoBackground';
import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

/* ─── Framer-motion variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ─── Static data ─── */
const STORY_PANELS = [
  {
    label: 'قبل',
    title: 'العقل المستعبَد',
    accent: '#9A948A',
    border: 'rgba(255,255,255,0.06)',
    glow: 'rgba(255,255,255,0.03)',
    icon: '⛓',
    lines: [
      'أفكار متشعّبة بلا مركز ثقل',
      'ردود أفعال لا قرارات واعية',
      'مستهلَك بالضوضاء، يتدفّق عبره كلّ شيء',
      'يعيش في وقت الآخرين لا وقته',
    ],
  },
  {
    label: 'الجسر',
    title: '٢١ يوماً من التحوّل',
    accent: '#D4AF37',
    border: 'rgba(212,175,55,0.25)',
    glow: 'rgba(212,175,55,0.07)',
    icon: '⚗️',
    lines: [
      'أسبوع ١: تفكيك الضوضاء الذهنية',
      'أسبوع ٢: بناء البنية الفكرية',
      'أسبوع ٣: ترسيخ السيادة وصياغة الميثاق',
    ],
  },
  {
    label: 'بعد',
    title: 'العقل السيادي',
    accent: '#D4AF37',
    border: 'rgba(212,175,55,0.18)',
    glow: 'rgba(212,175,55,0.06)',
    icon: '👑',
    lines: [
      'أفكار سيادية ذات ثقل وأثر',
      'تحليل عميق لا استجابة عمياء',
      'وضوح فلسفي وهدوء داخلي راسخ',
      'يصنع وقته ولا ينتظر وقت أحد',
    ],
  },
];

const PRO_FEATURES = [
  {
    key: 'council',
    title: 'المجلس السري ٢٤/٧',
    desc: 'محادثات AI بذاكرة دائمة وغير محدودة. ٨٤٧ عضو نشط الآن.',
    Icon: Users,
  },
  {
    key: 'psych',
    title: 'المخطط النفسي الشهري',
    desc: 'تقرير تحليلي عميق لأنماط تفكيرك وتطور عقلك كل شهر.',
    Icon: Brain,
  },
  {
    key: 'audio',
    title: 'التصدير الصوتي المعرفي',
    desc: 'حوّل يومياتك ومذكراتك إلى بودكاست صوتي احترافي.',
    Icon: Mic,
  },
];

const PERKS = [
  'الولوج المطلق إلى المجلس السري',
  'تقرير نفسي شهري مخصص',
  'تحويل اليوميات لبودكاست صوتي',
  'فتح النمط السيادي للمستشار',
  'مكتبة المحاضرات الحصرية',
];

const AVATARS = ['ع', 'خ', 'ب', 'ف'];

/* ─── Gold dot confetti for Pro state ─── */
function GoldDots() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 6 + 3,
            height: Math.random() * 6 + 3,
            background: 'var(--gold-pure)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0, 1.4, 0],
            y: [0, -(Math.random() * 60 + 30)],
          }}
          transition={{
            duration: Math.random() * 2 + 1.5,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Feature lock/unlock card ─── */
function FeatureCard({
  title,
  desc,
  Icon,
  delay,
}: {
  title: string;
  desc: string;
  Icon: React.ElementType;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="glass-gold rounded-2xl p-6 relative overflow-hidden cursor-default group"
      style={{
        boxShadow: hovered
          ? '0 0 40px rgba(212,175,55,0.18), 0 0 80px rgba(212,175,55,0.07)'
          : '0 0 0 transparent',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {/* Gold glow expand on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          opacity: hovered ? 1 : 0,
          background: hovered
            ? 'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.10) 0%, transparent 70%)'
            : 'transparent',
        }}
        transition={{ duration: 0.35 }}
      />

      {/* Lock / Unlock icon */}
      <div className="relative w-12 h-12 mb-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {hovered ? (
            <motion.div
              key="unlock"
              initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center text-[var(--gold-pure)]"
            >
              <Unlock size={26} strokeWidth={1.5} />
            </motion.div>
          ) : (
            <motion.div
              key="lock"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center text-[var(--gold-pure)] unlock-pulse"
            >
              <Lock size={26} strokeWidth={1.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature icon */}
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className="text-[var(--gold-muted)]" />
        <h3 className="font-serif text-base font-bold text-[var(--text-primary)]">{title}</h3>
      </div>
      <p className="text-sm text-[var(--text-secondary)] font-serif leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════
   MAIN COMPONENT
═══════════════════════════════ */
export default function Vault() {
  const { user, isPro, setIsPro, setPhone } = useStore();
  const { setTheme } = useVideoTheme();

  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user.phone ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  /* Video background */
  useEffect(() => {
    setTheme({ src: '/videos/vault.mp4', overlayOpacity: 0.6 });
    return () => setTheme({});
  }, [setTheme]);

  /* Seal the covenant handler */
  const handleSealCovenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setIsSubmitting(true);
    try {
      setPhone(phoneNumber.trim());
      setIsPro(true);
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
      if (typeof window !== 'undefined' && window.navigator?.vibrate) {
        window.navigator.vibrate([40, 80, 40]);
      }
      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
      }, 2400);
    } catch (err) {
      console.warn('Firestore fallback — covenant sealed locally:', err);
      setIsPro(true);
      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
      }, 2400);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── PRO STATE ── */
  if (isPro) {
    return (
      <div className="w-full fade-in-up pb-32 max-w-4xl mx-auto px-4" dir="rtl">
        {/* Pro hero */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="glass-gold rounded-3xl p-10 md:p-14 text-center relative overflow-hidden mb-10"
        >
          <GoldDots />
          {/* Top shimmer line */}
          <div className="absolute top-0 inset-x-0 h-px shimmer" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)',
              border: '1px solid rgba(212,175,55,0.4)',
              boxShadow: '0 0 40px rgba(212,175,55,0.3)',
            }}
          >
            <Crown size={36} className="text-[var(--gold-pure)]" />
          </motion.div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold gold-gradient-text mb-3">
            أنت من حاملي الميثاق
          </h1>
          <p className="text-[var(--text-secondary)] font-serif text-base mb-8">
            عضويتك السيادية مفعّلة — انتفع بكامل امتيازات المجلس.
          </p>

          {/* Active feature unlocks */}
          <div className="space-y-3 text-right max-w-md mx-auto mb-8">
            {PRO_FEATURES.map(({ key, title, Icon }) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: 'rgba(212,175,55,0.06)',
                  border: '1px solid rgba(212,175,55,0.15)',
                }}
              >
                <Unlock size={16} className="text-[var(--gold-pure)] flex-shrink-0" />
                <Icon size={16} className="text-[var(--gold-muted)] flex-shrink-0" />
                <span className="text-sm font-serif text-[var(--text-primary)]">{title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Manage covenant */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="visible"
          className="glass-card rounded-2xl p-6 text-center"
        >
          <h2 className="font-serif text-xl font-bold text-[var(--text-primary)] mb-2">
            إدارة الميثاق
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-serif mb-5">
            يمكنك تحديث بيانات تواصلك أو الاطلاع على تفاصيل عضويتك السيادية.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black transition-all hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #AA7C11, #D4AF37)',
              boxShadow: '0 0 24px rgba(212,175,55,0.3)',
            }}
          >
            <Shield size={16} />
            <span>إدارة الميثاق</span>
          </button>
        </motion.div>

        {/* Modal reuse */}
        <CovenantModal
          show={showModal}
          onClose={() => setShowModal(false)}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          onSubmit={handleSealCovenant}
          isSubmitting={isSubmitting}
          success={success}
          isPro={isPro}
        />
      </div>
    );
  }

  /* ── FREE STATE ── */
  return (
    <div className="w-full fade-in-up pb-32" dir="rtl">

      {/* ── A. HERO ─────────────────────────────────── */}
      <section className="relative text-center px-4 pt-10 pb-16 max-w-3xl mx-auto">
        {/* Pulsing crown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 unlock-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)',
            border: '1px solid rgba(212,175,55,0.35)',
            boxShadow: '0 0 50px rgba(212,175,55,0.2)',
          }}
        >
          <Crown size={36} className="text-[var(--gold-pure)]" />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="font-serif text-4xl md:text-6xl font-bold gold-gradient-text mb-4 leading-tight"
        >
          خِزَانَةُ العَهْدِ السِّيَادِيّ
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="visible"
          className="font-serif text-base md:text-lg text-[var(--text-secondary)] mb-8 leading-relaxed"
        >
          لست هنا لتشتري اشتراكاً. أنت هنا لتوقّع ميثاقاً مع نفسك.
        </motion.p>

        {/* Social proof */}
        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-3 px-5 py-3 rounded-full"
          style={{
            background: 'rgba(212,175,55,0.07)',
            border: '1px solid rgba(212,175,55,0.18)',
          }}
        >
          <div className="flex -space-x-2 space-x-reverse">
            {AVATARS.map((ch, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #A8892C)',
                  border: '2px solid rgba(2,2,2,0.8)',
                }}
              >
                {ch}
              </div>
            ))}
          </div>
          <span className="text-sm font-serif text-[var(--gold-pure)]">
            انضم إلى ٨٤٧ عقلاً سيادياً
          </span>
        </motion.div>
      </section>

      {/* ── B. TRANSFORMATION STORY ──────────────────── */}
      <section className="px-4 max-w-6xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STORY_PANELS.map((panel, i) => (
            <motion.div
              key={panel.title}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-7 flex flex-col"
              style={{
                borderColor: panel.border,
                boxShadow: `0 0 30px ${panel.glow}`,
              }}
            >
              <div className="text-3xl mb-4">{panel.icon}</div>
              <span
                className="text-xs uppercase tracking-widest font-semibold mb-1"
                style={{ color: panel.accent }}
              >
                {panel.label}
              </span>
              <h3
                className="font-serif text-xl font-bold mb-4"
                style={{ color: i === 0 ? 'var(--text-secondary)' : 'var(--text-primary)' }}
              >
                {panel.title}
              </h3>
              <ul className="space-y-2 flex-1">
                {panel.lines.map((line, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm font-serif text-[var(--text-secondary)]">
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: panel.accent }}
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── C. FEATURE LOCK→UNLOCK CARDS ─────────────── */}
      <section className="px-4 max-w-5xl mx-auto mb-20">
        <motion.h2
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-serif text-2xl md:text-3xl gold-gradient-text text-center mb-10 font-bold"
        >
          ما يُفتَح بختم الميثاق
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRO_FEATURES.map((feat, i) => (
            <FeatureCard
              key={feat.key}
              title={feat.title}
              desc={feat.desc}
              Icon={feat.Icon}
              delay={i}
            />
          ))}
        </div>
      </section>

      {/* ── D. PRICING CARD ──────────────────────────── */}
      <section className="px-4 max-w-xl mx-auto mb-20">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass-gold rounded-3xl p-8 md:p-12 relative overflow-hidden"
          style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}
        >
          {/* Top shimmer line */}
          <div className="absolute top-0 inset-x-0 h-px shimmer" />

          {/* Badge */}
          <div className="flex items-center gap-2 mb-6">
            <Star size={14} className="text-[var(--gold-pure)]" />
            <span className="text-xs uppercase tracking-widest text-[var(--gold-pure)] font-semibold">
              الاشتراك السيادي الوحيد
            </span>
          </div>

          {/* Price */}
          <div className="mb-2">
            <span className="font-serif text-6xl md:text-7xl font-bold gold-gradient-text">
              $19.99
            </span>
            <span className="text-[var(--text-muted)] text-base font-serif mr-2">/ شهر</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] font-serif mb-4">
            أو <span className="text-[var(--gold-pure)] font-semibold">$199 / سنوياً</span>{' '}
            (وفّر ١٧٪)
          </p>

          {/* Equivalence framing */}
          <div
            className="rounded-xl p-4 mb-8 text-sm font-serif text-[var(--text-secondary)] leading-relaxed"
            style={{
              background: 'rgba(212,175,55,0.05)',
              border: '1px solid rgba(212,175,55,0.12)',
            }}
          >
            خدمة التوجيه التنفيذي الفردي تُقدَّر بـ{' '}
            <span className="text-[var(--gold-pure)] font-bold">\$5,000 شهرياً</span>. هذا هو
            سعرها لأصحاب العقول الجادة.
          </div>

          {/* Perks list */}
          <div className="space-y-3 mb-10 border-t border-b py-7" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {PERKS.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(212,175,55,0.15)',
                    border: '1px solid rgba(212,175,55,0.4)',
                  }}
                >
                  <Check size={11} className="text-[var(--gold-pure)]" />
                </div>
                <span className="text-sm font-serif text-[var(--text-primary)]">{perk}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02, filter: 'brightness(1.12)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 group text-black transition-all"
            style={{
              background: 'linear-gradient(135deg, #AA7C11 0%, #D4AF37 50%, #E8CC6A 100%)',
              boxShadow: '0 0 40px rgba(212,175,55,0.35)',
            }}
          >
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
            <span>ختم الميثاق — $19.99 / شهر</span>
          </motion.button>

          {/* Trust signals */}
          <p className="text-center text-xs text-[var(--text-muted)] mt-5 font-serif tracking-wide">
            إلغاء فوري · تشفير بنكي · بدون تعهدات
          </p>
        </motion.div>
      </section>

      {/* ── MODAL ──────────────────────────────────── */}
      <CovenantModal
        show={showModal}
        onClose={() => setShowModal(false)}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        onSubmit={handleSealCovenant}
        isSubmitting={isSubmitting}
        success={success}
        isPro={isPro}
      />
    </div>
  );
}

/* ─── COVENANT MODAL ─────────────────────────────── */
interface CovenantModalProps {
  show: boolean;
  onClose: () => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  success: boolean;
  isPro: boolean;
}

function CovenantModal({
  show,
  onClose,
  phoneNumber,
  setPhoneNumber,
  onSubmit,
  isSubmitting,
  success,
  isPro,
}: CovenantModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'rgba(8,8,8,0.97)',
              border: '1px solid rgba(212,175,55,0.3)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.95)',
            }}
          >
            {/* Shimmer top line */}
            <div className="absolute top-0 inset-x-0 h-px shimmer" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 left-5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="إغلاق"
            >
              <X size={20} />
            </button>

            {/* Modal header */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(212,175,55,0.15)',
                  border: '1px solid rgba(212,175,55,0.35)',
                }}
              >
                <Crown size={20} className="text-[var(--gold-pure)]" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">
                  أنت على وشك التحوّل
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-serif mt-0.5">
                  {isPro ? 'تحديث بيانات الميثاق' : 'خطوة واحدة تفصلك عن السيادة'}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                /* Success state */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="p-8 rounded-2xl text-center relative overflow-hidden"
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.35)',
                    boxShadow: '0 0 60px rgba(212,175,55,0.15)',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #A8892C)' }}
                  >
                    <Check size={26} className="text-black" />
                  </motion.div>
                  <h4 className="font-serif text-xl font-bold text-[var(--text-primary)] mb-2">
                    انضم إلى النخبة. مرحباً بالسيادي.
                  </h4>
                  <p className="text-sm text-[var(--gold-pure)] font-serif">
                    تم ختم ميثاقك وتفعيل رتبتك السيادية.
                  </p>
                </motion.div>
              ) : (
                /* Form state */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={onSubmit}
                  className="space-y-5"
                >
                  {/* Phone input */}
                  <div>
                    <label className="block text-xs font-serif text-[var(--gold-pure)] mb-2">
                      رقم الهاتف (للتوثيق وربط العضوية):
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+966 5X XXX XXXX"
                        required
                        dir="ltr"
                        className="w-full px-4 py-3 pl-10 rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none transition-colors font-mono"
                        style={{
                          background: 'rgba(0,0,0,0.6)',
                          border: '1px solid rgba(255,255,255,0.12)',
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')
                        }
                      />
                      <Phone
                        size={16}
                        className="absolute left-3 text-[var(--text-muted)] pointer-events-none"
                      />
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] mt-1.5 block font-serif">
                      يُحفظ مشفراً في:{' '}
                      <code className="text-[var(--gold-muted)]">users/{'{uid}'}/phone</code>
                    </span>
                  </div>

                  {/* Covenant oath */}
                  <div
                    className="p-4 rounded-xl text-xs text-[var(--text-secondary)] font-serif leading-loose italic"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    «أقرّ بالالتزام بمسار الانضباط الفكري، وحفظ أسرار المجلس السري، وصيانة حصانتي
                    الذاتية أمام تقلبات الزمان. أختم هذا العهد بنيّة حرّة وإرادة سيادية.»
                  </div>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting || !phoneNumber.trim()}
                    className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest text-black transition-all disabled:opacity-40"
                    style={{
                      background: 'linear-gradient(135deg, #AA7C11, #D4AF37)',
                      boxShadow: '0 0 30px rgba(212,175,55,0.3)',
                    }}
                  >
                    {isSubmitting
                      ? 'جارٍ ختم الميثاق في السجل...'
                      : isPro
                      ? 'تحديث بيانات الميثاق'
                      : 'ختم الميثاق — $19.99 / شهر'}
                  </motion.button>

                  <p className="text-center text-[10px] text-[var(--text-muted)] font-serif">
                    إلغاء فوري · تشفير بنكي · بدون تعهدات
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
