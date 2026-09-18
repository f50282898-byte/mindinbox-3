'use client';

import { useState } from 'react';
import { Lock, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface GoldenLockProps {
  children: React.ReactNode;
  featureName: string;
  description: string;
}

export default function GoldenLock({ children, featureName, description }: GoldenLockProps) {
  const isPro = useStore((state) => state.isPro);
  const [showModal, setShowModal] = useState(false);

  if (isPro) {
    return <>{children}</>;
  }

  return (
    <>
      <div 
        className="relative group cursor-pointer overflow-hidden rounded-2xl"
        onClick={() => {
          if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(30);
          }
          setShowModal(true);
        }}
      >
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#030303]/70 backdrop-blur-md transition-all duration-500 group-hover:bg-[#030303]/40">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center justify-center space-y-3 p-6 rounded-2xl bg-[#0A0A0A]/80 border border-[#D4AF37]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Lock className="text-[#D4AF37] w-10 h-10 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] transition-all duration-300" />
            
            {/* The Whispered Quote on Hover */}
            <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden text-center max-w-[200px]">
              <p className="text-[#D4AF37]/80 text-[10px] uppercase tracking-[0.2em] font-light mt-2 italic">
                "Invest in your sovereignty."
              </p>
            </div>
            
          </motion.div>
        </div>
        
        {/* Render children but visually muted beneath the lock */}
        <div className="opacity-30 grayscale pointer-events-none transition-all duration-500 group-hover:grayscale-[50%]">
          {children}
        </div>
      </div>

      {/* The Deep Philosophical Persuasion Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030303]/90 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-lg bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,1)] overflow-hidden"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(212, 175, 55, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
            >
              {/* Decorative Background Glow */}
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[80px] pointer-events-none" />
              
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-[#888888] hover:text-[#EAEAEA] transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#0A0A0A] flex items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37] mb-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  <Sparkles size={28} />
                </div>
                
                <h3 className="text-3xl font-light text-[#EAEAEA] font-serif">
                  Unlock <span className="text-[#D4AF37] italic">{featureName}</span>
                </h3>
                
                <p className="text-[#888888] leading-[1.8] font-light text-lg">
                  {description}
                </p>
                
                <p className="text-[13px] text-[#D4AF37]/80 italic max-w-sm border-l-2 border-[#D4AF37]/30 pl-4 py-2 font-serif">
                  "To master the mind is to master the universe. Step beyond the veil."
                </p>

                <div className="pt-8 w-full">
                  <button 
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                        window.navigator.vibrate([40, 60, 40]);
                      }
                      // Handle Stripe Gateway here
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#EAEAEA] text-[#030303] font-bold tracking-widest uppercase text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-300"
                  >
                    Seal the Covenant
                  </button>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-full mt-6 py-3 text-[#888888] hover:text-[#EAEAEA] text-[10px] uppercase tracking-[0.2em] transition-colors"
                  >
                    Return to the Shadows
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

