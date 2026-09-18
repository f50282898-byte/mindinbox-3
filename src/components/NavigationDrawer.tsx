'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowLeft, User, Settings, Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import SettingsModal from './SettingsModal';

const NAV_LINKS = [
  { href: '/', label: 'اسأل الحكيم' },
  { href: '/utopian-city', label: 'يوتوبيا' },
  { href: '/journal', label: 'محراب التفريغ' },
  { href: '/secret-council', label: 'المجلس السري' },
  { href: '/vault', label: 'العهد السيادي' },
];

export default function NavigationDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const { isPro, user } = useStore();
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Floating Header Area */}
      <header className="fixed top-0 inset-x-0 z-[60] px-4 md:px-8 py-6 flex items-center justify-between pointer-events-none" dir="rtl">
        
        {/* Hamburger Button (Right) */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="pointer-events-auto w-12 h-12 rounded-full glass border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-primary)] hover:bg-white/10 hover:text-[var(--gold-pure)] transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] z-[61]"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>

        {/* Logo (Center) */}
        <Link href="/" className="pointer-events-auto group absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <h1 
            className="font-reem text-3xl font-bold text-[var(--gold-pure)] transition-all group-hover:scale-105"
            style={{ textShadow: '0 0 20px rgba(212, 175, 55, 0.4)' }}
          >
            عقل في صندوق
          </h1>
        </Link>

        {/* User Profile Area (Left) */}
        <div className="pointer-events-auto relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-12 h-12 rounded-full glass border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-primary)] hover:bg-white/10 hover:border-[var(--gold-pure)] transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden relative"
          >
             {currentUser?.photoURL ? (
               <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <User size={20} strokeWidth={1.5} />
             )}
             {isPro && (
                <div className="absolute inset-0 rounded-full border border-[var(--gold-pure)] animate-pulse pointer-events-none" />
             )}
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-16 left-0 w-64 glass-card rounded-2xl p-4 flex flex-col shadow-2xl border border-white/10 z-[60]"
                dir="rtl"
              >
                <div className="pb-3 border-b border-white/10 mb-3">
                  <p className="font-serif font-bold text-sm text-[var(--text-primary)]">
                    {currentUser?.displayName || user.displayName || 'السالك المستنير'}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] font-sans truncate">
                    {currentUser?.email || user.email || 'salik@mindinbox.io'}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-serif text-[var(--text-primary)] hover:bg-white/10 transition-colors text-right"
                >
                  <Settings size={16} />
                  <span>الإعدادات</span>
                </button>
                
                {!isPro && (
                  <div className="mt-2 p-3 rounded-xl bg-gradient-to-r from-[#AA7C11]/10 to-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-start gap-2">
                    <Clock size={14} className="text-[#D4AF37] mt-0.5 shrink-0" />
                    <p className="text-[10px] leading-relaxed font-serif text-[var(--text-secondary)]">
                      العهد التجريبي ينتهي قريباً. <Link href="/vault" className="text-[#D4AF37] font-bold underline" onClick={() => setIsProfileOpen(false)}>قم بالترقية الآن.</Link>
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 mt-2 rounded-xl text-sm font-serif text-red-400 hover:bg-red-500/10 transition-colors text-right"
                >
                  <LogOut size={16} />
                  <span>تسجيل الخروج</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </header>

      {/* Slide-in Sidebar Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex justify-end"
            dir="rtl"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-full h-full bg-black/60 backdrop-blur-2xl border-l border-white/5 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-8 border-b border-white/5">
                <h2 className="font-reem text-xl font-bold text-[var(--gold-pure)]" style={{ textShadow: '0 0 15px rgba(212, 175, 55, 0.3)' }}>
                  المسارات الباطنية
                </h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-primary)] hover:bg-white/10 hover:text-[var(--gold-pure)] transition-all"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsDrawerOpen(false)}
                        className={`group flex items-center justify-between gap-4 text-2xl font-reem transition-all duration-300 py-2 border-b border-transparent hover:border-white/5 ${
                          isActive ? 'text-[var(--gold-pure)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <span className="group-hover:translate-x-2 transition-transform duration-300">
                          {link.label}
                        </span>
                        <ArrowLeft 
                          size={24} 
                          className={`opacity-0 -translate-x-4 transition-all duration-300 ${
                            isActive ? 'opacity-100 translate-x-0' : 'group-hover:opacity-100 group-hover:translate-x-0'
                          }`} 
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
