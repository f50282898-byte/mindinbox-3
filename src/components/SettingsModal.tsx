'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Moon, Sun, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currentUser } = useAuth();
  const { user, isPro } = useStore();
  const router = useRouter();
  
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Enforce dark theme by default as per luxury guidelines
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.add('dark');
    }
  }, [theme]);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      onClose();
      router.push('/auth');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-md p-6 rounded-3xl glass-card relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--glass-border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--gold-glow)] flex items-center justify-center text-[var(--gold-pure)] border border-[var(--gold-border)]">
                  <Settings size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">الإعدادات</h3>
                  <p className="text-xs text-[var(--text-secondary)]">تخصيص تجربتك الباطنية</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Account Info */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-[var(--gold-muted)] mb-3 font-semibold">حسابك</h4>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--gold-dim)] to-black flex items-center justify-center border border-[var(--gold-border)] text-[var(--gold-pure)] shrink-0 overflow-hidden">
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-[var(--text-primary)] truncate">{currentUser?.displayName || user.displayName}</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{currentUser?.email || 'لا يوجد بريد إلكتروني'}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full border font-bold shrink-0 ${
                    isPro
                      ? 'bg-[var(--gold-glow)] text-[var(--gold-pure)] border-[var(--gold-border)]'
                      : 'bg-white/5 text-[var(--text-muted)] border-white/10'
                  }`}>
                    {isPro ? '⬡ سيادي' : 'مجاني'}
                  </span>
                </div>
              </div>

              {/* Theme Settings */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-[var(--gold-muted)] mb-3 font-semibold">السمة البصرية (المزاج)</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                      theme === 'light'
                        ? 'bg-[var(--gold-glow)] border-[var(--gold-border)] text-[var(--gold-pure)]'
                        : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                    }`}
                  >
                    <Sun size={24} className="mb-2" />
                    <span className="text-xs font-serif font-bold">نهار فاخر</span>
                  </button>
                  
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                      theme === 'dark'
                        ? 'bg-[var(--gold-glow)] border-[var(--gold-border)] text-[var(--gold-pure)]'
                        : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                    }`}
                  >
                    <Moon size={24} className="mb-2" />
                    <span className="text-xs font-serif font-bold">ليل باطني</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[var(--glass-border)]">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-sm font-bold text-red-500/90 hover:text-red-400 transition-all"
                >
                  <LogOut size={16} />
                  <span>تسجيل الخروج وترك المحراب</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

