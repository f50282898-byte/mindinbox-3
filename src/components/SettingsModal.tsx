'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Moon, Sun, User, LogOut, Volume2, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { auth } from '@/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currentUser } = useAuth();
  const { user, isPro, audioSpeed, setAudioSpeed } = useStore();
  const router = useRouter();
  
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [displayName, setDisplayName] = useState(currentUser?.displayName || user.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [cancelFlowState, setCancelFlowState] = useState<'none' | 'confirm' | 'frozen' | 'cancelled'>('none');

  useEffect(() => {
    setDisplayName(currentUser?.displayName || user.displayName || '');
  }, [currentUser, user.displayName, isOpen]);

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

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      if (auth?.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }
      // Also update local store if we wanted to
      setTimeout(() => setIsSaving(false), 800);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (auth?.currentUser) {
      // In a real app we'd require re-authentication for deletion
      await auth.currentUser.delete().catch(() => alert('يلزم إعادة تسجيل الدخول لتأكيد الحذف'));
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
            className="w-full max-w-md p-6 rounded-3xl bg-black/80 backdrop-blur-xl border border-white/5 relative overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--gold-glow)] flex items-center justify-center text-[var(--gold-pure)] border border-[var(--gold-border)]">
                  <Settings size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">الإعدادات المتقدمة</h3>
                  <p className="text-xs text-[var(--text-secondary)]">تخصيص تجربتك الباطنية</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
              {/* Account Info */}
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-[var(--gold-muted)] mb-3 font-semibold">الهوية</h4>
                <div className="space-y-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--gold-pure)] font-serif"
                      placeholder="اسمك المستعار"
                    />
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving || displayName === (currentUser?.displayName || user.displayName)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-[var(--gold-pure)] disabled:opacity-30 disabled:text-gray-500 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      {isSaving ? <div className="w-4 h-4 rounded-full border-2 border-[var(--gold-pure)] border-t-transparent animate-spin" /> : <Save size={16} />}
                    </button>
                  </div>
                  <div className="w-full bg-white/5 border border-transparent rounded-xl px-4 py-3 text-sm text-[var(--text-muted)] font-sans cursor-not-allowed">
                    {currentUser?.email || 'لا يوجد بريد إلكتروني'}
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-[var(--gold-muted)] mb-3 font-semibold">مظهر المنصة</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                      theme === 'dark'
                        ? 'bg-[var(--gold-glow)] border-[var(--gold-border)] text-[var(--gold-pure)]'
                        : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                    }`}
                  >
                    <Moon size={20} strokeWidth={1.5} className="mb-2" />
                    <span className="text-xs font-serif">ليل باطني</span>
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                      theme === 'light'
                        ? 'bg-[var(--gold-glow)] border-[var(--gold-border)] text-[var(--gold-pure)]'
                        : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                    }`}
                  >
                    <Sun size={20} strokeWidth={1.5} className="mb-2" />
                    <span className="text-xs font-serif">نهار فاخر</span>
                  </button>
                </div>
              </div>

              {/* Audio Speed */}
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-[var(--gold-muted)] mb-3 font-semibold">سرعة الصوت (الحكيم)</h4>
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-3">
                  <Volume2 size={16} className="text-[var(--text-muted)]" />
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.1" 
                    value={audioSpeed} 
                    onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
                    className="flex-1 accent-[var(--gold-pure)]" 
                  />
                  <span className="text-xs font-mono text-[var(--gold-pure)] w-8 text-center">{audioSpeed}x</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm text-[var(--text-primary)] transition-all"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                  <span className="font-serif">تسجيل الخروج</span>
                </button>
                
                {isDeleteConfirm ? (
                  <div className="p-4 rounded-xl border border-red-900/50 bg-red-950/20 text-center">
                    <p className="text-xs text-red-400 mb-3 font-serif">هل أنت متأكد؟ هذا الإجراء لا يمكن التراجع عنه.</p>
                    <div className="flex gap-2">
                      <button onClick={handleDeleteAccount} className="flex-1 py-2 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">نعم، احذف</button>
                      <button onClick={() => setIsDeleteConfirm(false)} className="flex-1 py-2 text-xs text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors">تراجع</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsDeleteConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl hover:bg-red-950/20 text-sm text-red-500/80 hover:text-red-400 transition-all border border-transparent hover:border-red-900/30"
                  >
                    <AlertCircle size={16} strokeWidth={1.5} />
                    <span className="font-serif text-xs">حذف الحساب نهائياً</span>
                  </button>
                )}

                {/* Subscription Freezing (Pro only) */}
                {isPro && (
                  <div className="pt-4 border-t border-white/5">
                    {cancelFlowState === 'none' && (
                      <button
                        onClick={() => setCancelFlowState('confirm')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl hover:bg-[#D4AF37]/10 text-sm text-[#D4AF37] transition-all border border-[#D4AF37]/20"
                      >
                        <span className="font-serif text-xs">إلغاء الاشتراك (Cancel Subscription)</span>
                      </button>
                    )}

                    {cancelFlowState === 'confirm' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-center space-y-4"
                      >
                        <p className="text-sm font-serif text-[#EAEAEA] leading-relaxed">
                          عقول النخبة تحتاج إلى راحة أحياناً. بدلاً من هدم خزانة أفكارك، جمد اشتراكك مجاناً وسنحرسها لك حتى تعود.
                        </p>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => setCancelFlowState('frozen')}
                            className="w-full py-2.5 text-xs font-bold bg-[#D4AF37] text-black rounded-lg hover:brightness-110 transition-all"
                            style={{ fontFamily: 'var(--font-reem-kufi)' }}
                          >
                            تجميد العهد
                          </button>
                          <button 
                            onClick={() => setCancelFlowState('cancelled')}
                            className="w-full py-2.5 text-xs font-serif text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            إلغاء نهائي
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {cancelFlowState === 'frozen' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 text-center">
                        <p className="text-xs text-blue-200 font-serif">تم تجميد العهد. خزانة أفكارك في حفظنا حتى عودتك.</p>
                      </motion.div>
                    )}

                    {cancelFlowState === 'cancelled' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-center">
                        <p className="text-xs text-red-200 font-serif">تم الإلغاء. نأسف لفراقك.</p>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
