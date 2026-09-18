'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { KeyRound, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HiddenSeal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const { currentUser } = useAuth();
  const { isPro, setIsPro } = useStore();

  // If they are already pro, don't show the seal, or let them click but it's redundant.
  // We can just hide it if they are Pro, to maintain the mystery.
  if (isPro) return null;

  const handleClaim = async () => {
    if (!currentUser) {
      alert('يجب تسجيل الدخول أولاً لتفعيل الختم.');
      return;
    }
    
    setIsClaiming(true);
    
    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      
      await setDoc(doc(db, 'users', currentUser.uid), {
        isPro: true,
        proExpiration: expirationDate.toISOString(),
        unlockedHiddenSeal: true,
      }, { merge: true });
      
      // Update local store
      setIsPro(true);
      
      // Aesthetic celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E8CC6A', '#AA7C11']
      });

      setClaimed(true);
      setTimeout(() => setIsOpen(false), 3000);
    } catch (err) {
      console.error('Failed to claim hidden seal:', err);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <>
      {/* The 4x4 Stealth Pixel */}
      <div 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-4 left-4 w-1 h-1 bg-[var(--gold-muted)] cursor-pointer z-50 rounded-full"
        style={{
          animation: 'pulseSeal 4s infinite alternate',
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseSeal {
          0% { opacity: 0.05; box-shadow: 0 0 2px rgba(212,175,55,0.1); }
          100% { opacity: 0.15; box-shadow: 0 0 4px rgba(212,175,55,0.3); }
        }
      `}} />

      {/* The Fullscreen Reveal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 text-center"
            dir="rtl"
          >
            <div className="max-w-lg mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mb-10"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-[var(--gold-glow)] border border-[var(--gold-border)] flex items-center justify-center text-[var(--gold-pure)] mb-8 shadow-[0_0_60px_rgba(212,175,55,0.2)]">
                  <KeyRound size={28} />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)] leading-relaxed mb-6">
                  لقد وجدت الختم المفقود.
                </h2>
                <p className="text-sm md:text-base text-[var(--text-secondary)] font-serif leading-loose max-w-md mx-auto">
                  عقول قليلة تلاحظ ما وراء الضجيج، وأنت أثبتّ أن بصيرتك تتجاوز المألوف. المجلس الأعلى يرحب بك.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                {!claimed ? (
                  <button
                    onClick={handleClaim}
                    disabled={isClaiming}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl gold-gradient text-black font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
                  >
                    {isClaiming ? (
                      <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <KeyRound size={18} />
                        <span>استلم هديتك: شهر كامل في المجلس السري</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white/5 border border-[var(--gold-border)] text-[var(--gold-pure)] font-bold text-sm">
                    <Check size={18} />
                    <span>تم فتح أبواب العهد السيادي لك.</span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

