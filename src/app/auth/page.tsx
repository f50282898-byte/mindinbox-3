'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { KeyRound, Mail, Lock, LogIn, UserPlus, Sparkles, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { currentUser, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && currentUser) {
      router.push('/');
    }
  }, [currentUser, loading, router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (err: any) {
      console.error('Firebase Email Auth Error:', err);
      // Explicitly show raw Firebase error code and message for production debugging
      const rawError = `${err.code ? err.code + ': ' : ''}${err.message}`;
      setError(rawError);
      alert(`AUTH ERROR -> ${rawError}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!auth) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err: any) {
      console.error('Firebase Google Auth Error:', err);
      const rawError = `${err.code ? err.code + ': ' : ''}${err.message}`;
      setError(rawError);
      alert(`GOOGLE AUTH ERROR -> ${rawError}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center fade-in bg-[#030303]">
        <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 fade-in" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 rounded-3xl bg-[#0A0A0A]/85 backdrop-blur-md border border-[#D4AF37]/20 shadow-[0_30px_70px_rgba(0,0,0,0.9)] relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#AA7C11]/20 via-[#D4AF37]/20 to-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto mb-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <KeyRound size={28} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#EAEAEA]">
            {isLogin ? 'بوابة الولوج' : 'صياغة الميثاق'}
          </h2>
          <p className="text-xs text-[#888888] tracking-widest uppercase font-serif mt-2">
            {isLogin ? 'العودة إلى حصنك الباطني' : 'تأسيس حساب سيادي جديد'}
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-3 rounded-xl bg-red-900/20 border border-red-500/30 flex items-start gap-2 text-red-400 text-xs font-serif leading-relaxed"
            >
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <div className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="البريد الإلكتروني"
                className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white/5 border border-white/10 text-sm text-[#EAEAEA] placeholder-[#888888] focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
              />
              <Mail size={16} className="absolute right-4 text-[#888888]" />
            </div>
          </div>
          
          <div>
            <div className="relative flex items-center">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="الرمز السري"
                className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white/5 border border-white/10 text-sm text-[#EAEAEA] placeholder-[#888888] focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
              />
              <Lock size={16} className="absolute right-4 text-[#888888]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-bold text-sm tracking-wide hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn size={16} />
                <span>ولوج</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>تأسيس</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
          <button
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-[#EAEAEA] text-xs font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={14} className="text-[#D4AF37]" />
            <span>المصادقة عبر Google</span>
          </button>

          <div className="text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs text-[#888888] hover:text-[#D4AF37] transition-colors font-serif"
            >
              {isLogin ? 'ليس لديك ميثاق؟ أسس حساباً جديداً' : 'لديك ميثاق مسبق؟ عُد للولوج'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

