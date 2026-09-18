'use client';

import { Menu, User, Settings, LogOut, AlertTriangle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import SettingsModal from './SettingsModal';

export default function TopBar() {
  const { toggleSidebar, user, isPro, userPersona } = useStore();
  const { currentUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/auth');
    }
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-[60] px-6 py-5 flex items-center justify-between pointer-events-none">
        {/* Right Side (Start in RTL): Hamburger + Logo */}
        <div className="flex items-center gap-5 pointer-events-auto">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-[var(--glass-bg)] border border-transparent hover:border-[var(--glass-border)] transition-all text-[var(--text-primary)]"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--gold-pure)] to-[var(--gold-dim)] flex items-center justify-center opacity-90 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <span className="font-reem text-black font-bold text-lg leading-none">ع</span>
            </div>
            <h1 className="font-reem text-xl text-[var(--text-primary)] tracking-wide glow-gold-text hidden sm:block">
              عقل في صندوق
            </h1>
          </div>
        </div>

        {/* Left Side (End in RTL): Avatar */}
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full border border-[var(--gold-border)] bg-[var(--glass-bg)] flex items-center justify-center overflow-hidden hover:border-[var(--gold-pure)] transition-all"
          >
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={18} className="text-[var(--gold-pure)]" strokeWidth={1.5} />
            )}
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 top-14 w-64 glass rounded-2xl p-4 z-50 flex flex-col gap-4 shadow-2xl"
                  dir="rtl"
                >
                  <div className="flex flex-col gap-1 border-b border-[var(--glass-border)] pb-3">
                    <span className="font-serif font-bold text-[var(--text-primary)] truncate">
                      {currentUser?.displayName || user.displayName}
                    </span>
                    <span className="font-sans text-xs text-[var(--text-muted)] truncate">
                      {currentUser?.email || user.email}
                    </span>
                    <div className="mt-2 inline-flex items-center justify-center py-1 px-3 rounded-full bg-[var(--gold-pure)]/10 border border-[var(--gold-pure)]/30 text-[var(--gold-pure)] text-[10px] uppercase font-bold tracking-widest">
                      {userPersona}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-serif"
                    >
                      <Settings size={16} strokeWidth={1.5} />
                      تخصيص التجربة
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-red-900/10 text-red-500/80 hover:text-red-400 transition-colors text-sm font-serif"
                    >
                      <LogOut size={16} strokeWidth={1.5} />
                      تسجيل الخروج
                    </button>
                  </div>

                  {!isPro && (
                    <div className="mt-2 p-3 rounded-xl bg-red-950/20 border border-red-900/30 flex items-start gap-2">
                      <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                      <p className="text-[10px] text-red-400/90 font-serif leading-relaxed">
                        العهد التجريبي يشارف على الانتهاء. ستفقد سيادتك على المجلس قريباً.
                      </p>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
