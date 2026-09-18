'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Compass, Landmark, Feather, Users,
  Check, Edit2, Crown, ChevronDown,
  LogOut, User, Lock, Zap, Brain, Mic, FileText,
  X, Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { db, auth } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import SettingsModal from './SettingsModal';

const COMMUNITY_MEMBER_COUNT = 34;

/* ─── FOMO trigger content — contextual per page & action ─────────── */
const FOMO_TRIGGERS: Record<string, { headline: string; body: string; icon: React.ElementType }> = {
  '/secret-council': {
    headline: 'المجلس السري مقفل',
    body: `أعضاء العهد السيادي يتداولون الآن في أفكار لا تُقاس. انضم إلى ${COMMUNITY_MEMBER_COUNT} عقلاً مختاراً.`,
    icon: Users,
  },
  '/utopian-city': {
    headline: 'الحكيم اليومي لك وحدك',
    body: 'في النسخة المجانية تقرأ. في العهد السيادي، الحكيم يقرأك ويصمم كلامه لك.',
    icon: Brain,
  },
  '/journal': {
    headline: 'أفكارك تستحق أكثر من نص',
    body: 'تحويل يومياتك إلى بودكاست صوتي احترافي — ميزة حصرية لأصحاب العهد.',
    icon: Mic,
  },
  default: {
    headline: 'أنت على بُعد خطوة واحدة',
    body: `العهد السيادي يمنحك تقريراً نفسياً شهرياً عن تطور عقلك. ${COMMUNITY_MEMBER_COUNT} عضو فقط. مقاعد محدودة.`,
    icon: Crown,
  },
};

/* ─── Nav links definition ──────────────────────────────────────────── */
interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  proOnly?: boolean;
  proHint?: string;
}

const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'الداشبورد', icon: Compass },
  { href: '/utopian-city', label: 'المدينة الفاضلة', icon: Landmark },
  { href: '/journal', label: 'محراب التفريغ', icon: Feather },
  {
    href: '/secret-council', label: 'المجلس السري', icon: Users,
    proOnly: true, proHint: `${COMMUNITY_MEMBER_COUNT} عضو نشط الآن`
  },
];

/* ════════════════════════════════════════════════════════════════════
   DYNAMIC ISLAND — Psychological Conversion Engine
   ════════════════════════════════════════════════════════════════════ */
export default function DynamicIsland() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isPro, setIsPro, setDisplayName } = useStore();
  const { currentUser } = useAuth();

  /* Panel states */
  const [panel, setPanel] = useState<'none' | 'profile' | 'fomo'>('none');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.displayName);
  const [savingFirestore, setSavingFirestore] = useState(false);
  const [fomoShown, setFomoShown] = useState(false);
  
  // Settings modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const islandRef = useRef<HTMLDivElement>(null);
  const fomoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Click-outside close */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setPanel('none');
        setEditingName(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* FOMO auto-trigger: show once per session after 8s if not Pro */
  useEffect(() => {
    if (isPro || fomoShown) return;
    fomoTimerRef.current = setTimeout(() => {
      setPanel('fomo');
      setFomoShown(true);
    }, 8000);
    return () => {
      if (fomoTimerRef.current) clearTimeout(fomoTimerRef.current);
    };
  }, [isPro, fomoShown]);

  const currentFomo = FOMO_TRIGGERS[pathname] ?? FOMO_TRIGGERS['default'];
  const FomoIcon = currentFomo.icon;

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setSavingFirestore(true);
    setDisplayName(nameInput.trim());
    try {
      if (db && currentUser) {
        await setDoc(doc(db, 'users', currentUser.uid), {
          displayName: nameInput.trim(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore update fallback:', err);
    } finally {
      setSavingFirestore(false);
      setEditingName(false);
    }
  };

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      setPanel('none');
      router.push('/auth');
    }
  };

  const togglePanel = useCallback((p: 'profile' | 'fomo') => {
    setPanel(prev => prev === p ? 'none' : p);
    setEditingName(false);
  }, []);

  /* ── Number of locked Pro features to show in glow badge ── */
  const lockedCount = isPro ? 0 : 3;

  return (
    <>
      <header
        dir="rtl"
        className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <div ref={islandRef} className="relative pointer-events-auto w-full max-w-4xl">

          {/* ════════ THE PILL ════════ */}
          <motion.nav
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="glass-gold flex items-center justify-between gap-2 md:gap-4 px-3 md:px-5 py-2 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(212,175,55,0.15)]"
          >

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#AA7C11]/30 to-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={16} />
                {/* Ambient pulse ring */}
                <span className="absolute inset-0 rounded-full border border-[#D4AF37]/30 animate-ping opacity-40" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <p className="font-serif text-xs font-bold tracking-widest text-[var(--text-primary)] group-hover:text-[var(--gold-pure)] transition-colors leading-none">
                    MIND IN BOX
                  </p>
                  {/* Listening Pulse Indicator */}
                  <span className="relative flex h-1.5 w-1.5 mt-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--gold-pure)] opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--gold-muted)]"></span>
                  </span>
                </div>
                <p className="text-[8px] text-[var(--gold-muted)] tracking-widest uppercase leading-none mt-1">
                  {currentUser ? 'المراقب الكوني' : 'العقل في الصندوق'}
                </p>
              </div>
            </Link>

            {/* ── Center Nav ── */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {NAV_LINKS.map((item) => {
                const isActive = pathname === item.href;
                const isLocked = item.proOnly && !isPro;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={isLocked ? (e) => {
                      e.preventDefault();
                      togglePanel('fomo');
                    } : undefined}
                    className={`relative group px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'text-[var(--gold-pure)] bg-[var(--gold-glow)] border border-[var(--gold-border)]'
                        : isLocked
                          ? 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                    }`}
                  >
                    <Icon size={13} />
                    <span className="hidden md:inline">{item.label}</span>

                    {/* Lock badge for Pro-only items */}
                    {isLocked && (
                      <span className="relative flex">
                        <Lock size={9} className="text-[var(--gold-muted)]" />
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--gold-pure)] pulse-gold" />
                      </span>
                    )}

                    {/* Tooltip: live member count */}
                    {isLocked && item.proHint && (
                      <span className="absolute -bottom-7 right-0 whitespace-nowrap text-[9px] px-2 py-0.5 rounded-full bg-black/90 border border-[var(--gold-border)] text-[var(--gold-muted)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {item.proHint}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* ── Pro badge / Upgrade CTA ── */}
              {isPro ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[var(--gold-glow)] text-[var(--gold-pure)] border border-[var(--gold-border)] flex items-center gap-1 shrink-0">
                  <Crown size={11} />
                  <span className="hidden sm:inline">العهد السيادي</span>
                </span>
              ) : (
                <button
                  onClick={() => router.push('/vault/checkout')}
                  className="relative px-3 py-1.5 rounded-full text-[10px] font-bold gold-gradient text-black flex items-center gap-1 hover:brightness-110 transition-all shrink-0 shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                >
                  <Crown size={12} />
                  <span>ترقية</span>
                  {/* Locked features count badge */}
                  {lockedCount > 0 && (
                    <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center border border-black">
                      {lockedCount}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* ── Right: Avatar / Auth ── */}
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--gold-pure)] hover:bg-white/5 transition-colors"
              >
                <Settings size={16} />
              </button>

              {!currentUser ? (
                <Link
                  href="/auth"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[var(--gold-border)] transition-all text-[var(--text-secondary)] text-xs hover:text-[var(--text-primary)]"
                >
                  <User size={13} className="text-[var(--gold-muted)]" />
                  <span className="hidden sm:inline font-serif">ولوج</span>
                </Link>
              ) : (
                <button
                  onClick={() => togglePanel('profile')}
                  className={`flex items-center gap-1.5 p-1.5 rounded-full transition-all border ${
                    panel === 'profile'
                      ? 'bg-[var(--gold-glow)] border-[var(--gold-border)]'
                      : 'bg-white/5 border-white/10 hover:border-[var(--gold-border)]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--gold-dim)] to-black flex items-center justify-center border border-[var(--gold-border)] text-[var(--gold-pure)]">
                    {currentUser.photoURL
                      ? <img src={currentUser.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                      : <User size={12} />
                    }
                  </div>
                  <ChevronDown
                    size={11}
                    className={`text-[var(--text-muted)] transition-transform duration-200 ${panel === 'profile' ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            </div>
          </motion.nav>

          {/* ════════ PANELS ════════ */}
          <AnimatePresence mode="wait">

            {/* ── Profile Dropdown ── */}
            {panel === 'profile' && currentUser && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 mt-2 w-72 rounded-2xl glass-gold shadow-[0_24px_60px_rgba(0,0,0,0.9)] p-4 text-right"
                style={{ zIndex: 60 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[var(--gold-glow)] border border-[var(--gold-border)] flex items-center justify-center text-[var(--gold-pure)] overflow-hidden">
                      {currentUser.photoURL
                        ? <img src={currentUser.photoURL} alt="" className="w-full h-full object-cover" />
                        : <User size={18} />
                      }
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[140px]">
                        {currentUser.displayName || user.displayName}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate max-w-[140px]">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${
                    isPro
                      ? 'bg-[var(--gold-glow)] text-[var(--gold-pure)] border-[var(--gold-border)]'
                      : 'bg-white/5 text-[var(--text-muted)] border-white/10'
                  }`}>
                    {isPro ? '⬡ سيادي' : 'مجاني'}
                  </span>
                </div>

                {/* Edit Name */}
                <div className="mb-3">
                  <p className="text-[9px] uppercase tracking-widest text-[var(--gold-muted)] mb-1.5">تعديل الاسم</p>
                  {editingName ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                        autoFocus
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-black/60 border border-[var(--gold-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-pure)] transition-colors"
                        placeholder="الاسم الجديد..."
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={savingFirestore}
                        className="p-1.5 rounded-lg bg-[var(--gold-pure)] text-black hover:brightness-110 transition-all disabled:opacity-50"
                      >
                        {savingFirestore
                          ? <div className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                          : <Check size={13} />
                        }
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingName(true)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/4 hover:bg-white/8 border border-white/6 text-xs text-[var(--text-primary)] transition-colors"
                    >
                      <span>{currentUser.displayName || user.displayName}</span>
                      <Edit2 size={11} className="text-[var(--gold-muted)]" />
                    </button>
                  )}
                </div>

                {/* Membership toggle (dev) */}
                <div className="py-2 border-t border-white/5 flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[var(--text-muted)]">العضوية:</span>
                  <button
                    onClick={() => setIsPro(!isPro)}
                    className="text-[10px] text-[var(--gold-muted)] hover:text-[var(--gold-pure)] transition-colors underline underline-offset-2"
                  >
                    {isPro ? 'تبديل إلى مجاني' : 'تفعيل تجريبي للعهد'}
                  </button>
                </div>

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-900/30 text-xs text-red-400/80 hover:text-red-400 transition-all"
                >
                  <LogOut size={13} />
                  <span>تسجيل الخروج</span>
                </button>
              </motion.div>
            )}

            {/* ── FOMO Upgrade Panel — The Conversion Engine ── */}
            {panel === 'fomo' && !isPro && (
              <motion.div
                key="fomo"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 mt-2 rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.95)]"
                style={{ zIndex: 60 }}
              >
                {/* Gold shimmer top bar */}
                <div className="h-px w-full shimmer" />

                <div className="glass-gold p-5">
                  {/* Close */}
                  <button
                    onClick={() => setPanel('none')}
                    className="absolute top-3 left-3 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  >
                    <X size={14} />
                  </button>

                  {/* Contextual hook headline */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--gold-glow)] border border-[var(--gold-border)] flex items-center justify-center text-[var(--gold-pure)] shrink-0 unlock-pulse">
                      <FomoIcon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)] leading-snug">
                        {currentFomo.headline}
                      </p>
                      <p className="text-[10px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                        {currentFomo.body}
                      </p>
                    </div>
                  </div>

                  {/* Pro features — with glowing lock → unlock animation */}
                  <div className="space-y-2 mb-4">
                    {[
                      { icon: Users,    label: 'المجلس السري 24/7',               desc: 'ذاكرة محادثة دائمة وغير محدودة' },
                      { icon: FileText, label: 'التقرير النفسي الشهري',            desc: 'تحليل عميق لتطور عقلك وأنماطك' },
                      { icon: Mic,      label: 'التحويل الصوتي للمذكرات',          desc: 'يومياتك → بودكاست احترافي' },
                    ].map((feat, i) => {
                      const FeatIcon = feat.icon;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07, duration: 0.3 }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3 border border-white/5 group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[var(--gold-glow)] border border-[var(--gold-border)] flex items-center justify-center text-[var(--gold-muted)] shrink-0 group-hover:text-[var(--gold-pure)] transition-colors">
                            <FeatIcon size={13} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-[var(--text-primary)] truncate">{feat.label}</p>
                            <p className="text-[9px] text-[var(--text-muted)] truncate">{feat.desc}</p>
                          </div>
                          <Lock size={11} className="text-[var(--gold-dim)] shrink-0 unlock-pulse" />
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Social proof */}
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-[var(--gold-glow)] border border-[var(--gold-border)]">
                    <div className="flex -space-x-1 rtl:space-x-reverse">
                      {['M', 'A', 'S', 'K'].map((l, i) => (
                        <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--gold-muted)] to-black border border-black flex items-center justify-center text-[7px] font-bold text-[var(--gold-pure)]">
                          {l}
                        </div>
                      ))}
                    </div>
                    <p className="text-[9px] text-[var(--text-secondary)] leading-tight">
                      <span className="font-bold text-[var(--gold-pure)]">{COMMUNITY_MEMBER_COUNT}</span> عضو سيادي يفكّر الآن بعمق أكثر منك
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/vault/checkout"
                    onClick={() => setPanel('none')}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl gold-gradient text-black font-bold text-sm hover:brightness-110 transition-all shadow-[0_0_24px_rgba(212,175,55,0.3)] hover:shadow-[0_0_36px_rgba(212,175,55,0.5)]"
                  >
                    <Zap size={15} />
                    <span>ابدأ العهد السيادي — $19.99 / شهر</span>
                  </Link>

                  <p className="text-center text-[9px] text-[var(--text-muted)] mt-2">
                    إلغاء فوري في أي وقت · تشفير بنكي · بدون تعهدات
                  </p>
                </div>

                {/* Gold shimmer bottom bar */}
                <div className="h-px w-full shimmer" />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
