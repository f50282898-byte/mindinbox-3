'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Crown,
  Lock,
  Unlock,
  Users,
  Brain,
  Mic,
  Check,
  Sparkles,
  Shield,
  Star,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useVideoTheme } from '@/components/VideoBackground';

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
    desc: 'محادثات AI بذاكرة دائمة وغير محدودة. ٣٤ عضو نشط الآن.',
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

const GOLD_DOTS = [
  { left: '8%', top: '14%', width: 5, height: 5, y: -32, duration: 2.1, delay: 0.2 },
  { left: '18%', top: '38%', width: 7, height: 7, y: -46, duration: 2.8, delay: 1.1 },
  { left: '30%', top: '22%', width: 6, height: 6, y: -40, duration: 2.4, delay: 0.7 },
  { left: '42%', top: '58%', width: 8, height: 8, y: -54, duration: 2.9, delay: 1.4 },
  { left: '52%', top: '30%', width: 5, height: 5, y: -28, duration: 2.2, delay: 0.5 },
  { left: '60%', top: '62%', width: 7, height: 7, y: -50, duration: 3.1, delay: 1.9 },
  { left: '72%', top: '18%', width: 6, height: 6, y: -36, duration: 2.3, delay: 0.8 },
  { left: '80%', top: '52%', width: 9, height: 9, y: -58, duration: 2.7, delay: 1.6 },
  { left: '90%', top: '36%', width: 5, height: 5, y: -30, duration: 2.5, delay: 1.2 },
  { left: '12%', top: '76%', width: 6, height: 6, y: -44, duration: 2.6, delay: 0.9 },
  { left: '26%', top: '84%', width: 8, height: 8, y: -52, duration: 3.2, delay: 1.7 },
  { left: '63%', top: '82%', width: 7, height: 7, y: -48, duration: 2.4, delay: 1.1 },
  { left: '88%', top: '76%', width: 6, height: 6, y: -38, duration: 2.3, delay: 0.4 },
  { left: '48%', top: '88%', width: 5, height: 5, y: -26, duration: 2.1, delay: 1.8 },
  { left: '68%', top: '12%', width: 7, height: 7, y: -42, duration: 2.9, delay: 0.3 },
  { left: '34%', top: '68%', width: 4, height: 4, y: -24, duration: 2.0, delay: 1.5 },
  { left: '54%', top: '52%', width: 5, height: 5, y: -30, duration: 2.6, delay: 0.6 },
  { left: '76%', top: '66%', width: 5, height: 5, y: -32, duration: 2.4, delay: 1.3 },
] as const;

function GoldDots() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {GOLD_DOTS.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: dot.width,
            height: dot.height,
            background: 'var(--gold-pure)',
            left: dot.left,
            top: dot.top,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0, 1.4, 0],
            y: [0, -dot.y],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            repeatDelay: dot.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

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

      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className="text-[var(--gold-muted)]" />
        <h3 className="font-serif text-base font-bold text-[var(--text-primary)]">{title}</h3>
      </div>
      <p className="text-sm text-[var(--text-secondary)] font-serif leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export default function Vault() {
  const { isPro } = useStore();
  const { setTheme } = useVideoTheme();
  const router = useRouter();

  useEffect(() => {
    setTheme({ src: '/videos/vault.mp4', overlayOpacity: 0.6 });
    return () => setTheme({});
  }, [setTheme]);

  if (isPro) {
    return (
      <div className="w-full fade-in-up pb-32 max-w-4xl mx-auto px-4" dir="rtl">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="glass-gold rounded-3xl p-10 md:p-14 text-center relative overflow-hidden mb-10"
        >
          <GoldDots />
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
                <Unlock size={16} className="text-[var(--gold-pure)] shrink-0" />
                <Icon size={16} className="text-[var(--gold-muted)] shrink-0" />
                <span className="text-sm font-serif text-[var(--text-primary)]">{title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

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
            onClick={() => router.push('/vault/checkout')}
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
      </div>
    );
  }

  return (
    <div className="w-full fade-in-up pb-32" dir="rtl">
      <section className="relative text-center px-4 pt-10 pb-16 max-w-3xl mx-auto">
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
            انضم إلى ٣٤ عقلاً سيادياً
          </span>
        </motion.div>
      </section>

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
                      className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
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

      <section className="px-4 max-w-xl mx-auto mb-20">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass-gold rounded-3xl p-8 md:p-12 relative overflow-hidden"
          style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}
        >
          <div className="absolute top-0 inset-x-0 h-px shimmer" />

          <div className="flex items-center gap-2 mb-6">
            <Star size={14} className="text-[var(--gold-pure)]" />
            <span className="text-xs uppercase tracking-widest text-[var(--gold-pure)] font-semibold">
              الاشتراك السيادي الوحيد
            </span>
          </div>

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

          <div
            className="rounded-xl p-4 mb-8 text-sm font-serif text-[var(--text-secondary)] leading-relaxed"
            style={{
              background: 'rgba(212,175,55,0.05)',
              border: '1px solid rgba(212,175,55,0.12)',
            }}
          >
            خدمة التوجيه التنفيذي الفردي تُقدَّر بـ{' '}
            <span className="text-[var(--gold-pure)] font-bold">$5,000 شهرياً</span>. هذا هو
            سعرها لأصحاب العقول الجادة.
          </div>

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
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
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

          <motion.button
            whileHover={{ scale: 1.02, filter: 'brightness(1.12)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/vault/checkout')}
            className="w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 group text-black transition-all"
            style={{
              background: 'linear-gradient(135deg, #AA7C11 0%, #D4AF37 50%, #E8CC6A 100%)',
              boxShadow: '0 0 40px rgba(212,175,55,0.35)',
            }}
          >
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
            <span>ختم الميثاق — $19.99 / شهر</span>
          </motion.button>

          <p className="text-center text-xs text-[var(--text-muted)] mt-5 font-serif tracking-wide">
            إلغاء فوري · تشفير بنكي · بدون تعهدات
          </p>
        </motion.div>
      </section>
    </div>
  );
}
