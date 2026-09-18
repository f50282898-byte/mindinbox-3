'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Sparkles, 
  Compass, 
  Landmark, 
  Feather, 
  Users, 
  ShieldAlert, 
  KeyRound, 
  Check, 
  Edit2, 
  Crown,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export default function DynamicIsland() {
  const pathname = usePathname();
  const { user, isPro, setIsPro, setDisplayName } = useStore();
  const { currentUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.displayName);
  const [savingFirestore, setSavingFirestore] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setEditingName(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setSavingFirestore(true);
    setDisplayName(nameInput.trim());
    try {
      await setDoc(doc(db, 'users', user.uid), {
        displayName: nameInput.trim(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore update simulated or offline fallback:', err);
    } finally {
      setSavingFirestore(false);
      setEditingName(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'الداشبورد', icon: Compass },
    { href: '/utopian-city', label: 'المدينة الفاضلة', icon: Landmark },
    { href: '/journal', label: 'محراب التفريغ', icon: Feather },
    { href: '/secret-council', label: 'المجلس السري', icon: Users, proOnly: true },
    { href: '/vault', label: 'الخزانة', icon: KeyRound },
  ];

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none" dir="rtl">
      <motion.nav 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto relative flex items-center justify-between gap-3 md:gap-6 px-4 md:px-6 py-2.5 rounded-full bg-[#0A0A0A]/85 backdrop-blur-2xl border border-[#D4AF37]/20 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(212,175,55,0.2)] max-w-5xl w-full"
      >
        {/* Right side: Golden Seal / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#AA7C11]/30 via-[#D4AF37]/20 to-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)] group-hover:scale-105 transition-all duration-300">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-serif text-sm tracking-wider text-[#EAEAEA] font-semibold group-hover:text-[#D4AF37] transition-colors">
              MIND IN BOX
            </span>
            <span className="text-[9px] tracking-widest text-[#D4AF37]/70 uppercase font-light">
              العقل في الصندوق
            </span>
          </div>
        </Link>

        {/* Center: Contextual Nav Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10 shadow-[inset_0_0_10px_rgba(212,175,55,0.15)] border border-[#D4AF37]/30'
                    : 'text-[#888888] hover:text-[#EAEAEA] hover:bg-white/5'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#D4AF37]' : 'text-[#888888]'} />
                <span className="hidden md:inline">{item.label}</span>
                {item.proOnly && !isPro && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping ml-0.5" />
                )}
              </Link>
            );
          })}

          {/* Dynamic Tab Label Rule: Rename "العضويات" to a dynamic "ترقية" button if not Pro */}
          {!isPro ? (
            <Link
              href="/vault"
              className="relative px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-[#040404] shadow-[0_0_15px_rgba(212,175,55,0.35)] hover:scale-105 hover:brightness-110 transition-all flex items-center gap-1"
            >
              <Crown size={13} />
              <span>ترقية</span>
            </Link>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center gap-1">
              <Crown size={12} />
              <span>العهد السيادي</span>
            </span>
          )}
        </div>

        {/* Left side: User Profile Avatar with Firestore Edit dropdown OR Login Link */}
        <div className="relative" ref={dropdownRef}>
          {!currentUser ? (
            <Link
              href="/auth"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 transition-all text-[#EAEAEA] text-xs font-serif shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              <User size={14} className="text-[#D4AF37]" />
              <span>ولوج / تأسيس ميثاق</span>
            </Link>
          ) : (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 transition-all text-[#888888] hover:text-[#EAEAEA]"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-black flex items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37]">
                  <User size={14} />
                </div>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-3 w-64 rounded-2xl bg-[#0A0A0A]/95 backdrop-blur-2xl border border-[#D4AF37]/25 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-4 z-50 text-right font-sans"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#EAEAEA]">{currentUser.displayName || user.displayName}</p>
                          <p className="text-[10px] text-[#888888]">{currentUser.email}</p>
                        </div>
                      </div>
                      {isPro ? (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                          سيادي
                        </span>
                      ) : (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-[#888888]">
                          مجاني
                        </span>
                      )}
                    </div>

                    {/* Edit Name in Firestore */}
                    <div className="space-y-2 mb-3">
                      <label className="text-[10px] uppercase tracking-wider text-[#D4AF37]/80 block">
                        تعديل الهوية والاسم (مزامنة سحابية)
                      </label>
                      {editingName ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-[#D4AF37]/30 text-xs text-[#EAEAEA] focus:outline-none focus:border-[#D4AF37]"
                            placeholder="الاسم الجديد..."
                          />
                          <button
                            onClick={handleSaveName}
                            disabled={savingFirestore}
                            className="p-1.5 rounded-lg bg-[#D4AF37] text-black hover:bg-[#AA7C11] transition-colors"
                            title="حفظ"
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingName(true)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-[#EAEAEA] transition-colors"
                        >
                          <span>{currentUser.displayName || user.displayName}</span>
                          <Edit2 size={12} className="text-[#D4AF37]" />
                        </button>
                      )}
                    </div>

                    {/* Dev Toggle Pro */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-[#888888]">حالة العضوية:</span>
                      <button
                        onClick={() => setIsPro(!isPro)}
                        className="text-[10px] text-[#D4AF37] hover:underline"
                      >
                        {isPro ? 'تحويل إلى مجاني' : 'تفعيل العهد السيادي (تجريبي)'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </motion.nav>
    </header>
  );
}
