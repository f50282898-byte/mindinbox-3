'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import SettingsModal from './SettingsModal';

export default function TopBar() {
  const { isSidebarOpen, toggleSidebar, user, isPro } = useStore();
  const { currentUser } = useAuth();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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
      <header className="fixed top-0 inset-x-0 z-[60] px-4 md:px-8 py-5 flex items-center justify-between pointer-events-none" dir="rtl">
        
        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Hamburger */}
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 rounded-full glass border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-primary)] hover:bg-white/10 hover:text-[var(--gold-pure)] transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]"
          >
            <Menu size={18} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link href="/" className="group hidden sm:block">
            <h1 
              className="font-reem text-2xl font-bold text-[var(--gold-pure)] transition-all group-hover:scale-105"
              style={{ textShadow: '0 0 15px rgba(212, 175, 55, 0.3)' }}
            >
              عقل في صندوق
            </h1>
          </Link>
        </div>

        {/* User Profile Area */}
        <div className="pointer-events-auto relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full glass border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-primary)] hover:bg-white/10 hover:border-[var(--gold-pure)] transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] overflow-hidden relative"
          >
             {currentUser?.photoURL ? (
               <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <User size={16} strokeWidth={1.5} />
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
                className="absolute top-14 left-0 w-64 bg-black/60 backdrop-blur-2xl rounded-2xl p-4 flex flex-col shadow-2xl border border-white/10 z-[70]"
                dir="rtl"
              >
                <div className="pb-3 border-b border-white/10 mb-3">
                  <p className="font-serif font-bold text-sm text-[var(--text-primary)]">
                    {currentUser?.displayName || user.displayName || 'السالك المستنير'}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] font-sans truncate mt-1">
                    {currentUser?.email || user.email || 'salik@mindinbox.io'}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-serif text-[var(--text-primary)] hover:bg-white/10 transition-colors text-right"
                >
                  <Settings size={16} strokeWidth={1.5} />
                  <span>الإعدادات المتقدمة</span>
                </button>
                
                {!isPro && (
                  <div className="mt-3 p-3 rounded-xl bg-[var(--gold-glow)] border border-[var(--gold-border)] flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-pure)] mt-1.5 shrink-0 shadow-[0_0_8px_var(--gold-pure)]" />
                    <p className="text-[10px] leading-relaxed font-serif text-[var(--text-secondary)]">
                      العهد التجريبي ينتهي قريباً. <Link href="/vault" className="text-[var(--gold-pure)] font-bold hover:underline" onClick={() => setIsProfileOpen(false)}>قم بالترقية للعهد السيادي.</Link>
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl text-sm font-serif text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors text-right"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                  <span>تسجيل الخروج</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}

