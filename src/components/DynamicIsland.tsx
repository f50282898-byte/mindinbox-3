'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, Settings, Sparkles, BookOpen, Compass, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

export default function DynamicIsland() {
  const [isHovered, setIsHovered] = useState(false);
  const isPro = useStore((state) => state.isPro);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // WebAuthn / FaceID / TouchID Mock Hook
  const handleBiometricAuth = useCallback(async () => {
    try {
      // Simulate WebAuthn API call
      console.log('Initiating biometric authentication...');
      // In real scenario: await navigator.credentials.get({ publicKey: ... })
      setTimeout(() => {
        setIsAuthenticated(true);
        // Haptic Feedback for successful auth
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([30, 50, 30]); // Subtle double tap
        }
      }, 1000);
    } catch (e) {
      console.error('Biometric Auth Failed', e);
    }
  }, []);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.nav
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 1.2 }}
        className={cn(
          "pointer-events-auto flex items-center justify-between overflow-hidden",
          "bg-[rgba(10,10,10,0.85)] backdrop-blur-2xl shadow-2xl",
          "rounded-full px-4 py-2",
          isHovered ? "w-[480px]" : "w-[260px]"
        )}
        style={{ 
          minHeight: '56px',
          boxShadow: 'inset 0 0 0 1px rgba(212, 175, 55, 0.2), 0 20px 40px -10px rgba(0,0,0,0.8)'
        }}
      >
        {/* Left: User Avatar with Biometric Auth Hook */}
        <motion.div 
          layout 
          onClick={!isAuthenticated ? handleBiometricAuth : undefined}
          className={cn(
            "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border cursor-pointer transition-colors",
            isAuthenticated ? "bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]" : "bg-white/5 border-white/10 text-[#888888] hover:text-[#EAEAEA]"
          )}
        >
          <User size={18} />
        </motion.div>

        {/* Center: Contextual Tools (Expands on Hover) */}
        <AnimatePresence>
          {isHovered ? (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center space-x-6 px-4 whitespace-nowrap text-[#888888]"
            >
              <Link href="/" className="hover:text-[#EAEAEA] transition-colors">
                <Compass size={20} />
              </Link>
              <Link href="/utopian-city" className="hover:text-[#EAEAEA] transition-colors">
                <Menu size={20} />
              </Link>
              <Link href="/courses" className="hover:text-[#EAEAEA] transition-colors">
                <BookOpen size={20} />
              </Link>
              <Link href="/journal" className="hover:text-[#EAEAEA] transition-colors">
                <Edit3 size={20} />
              </Link>
              <button className="hover:text-[#EAEAEA] transition-colors">
                <Settings size={20} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-[10px] text-[#888888] tracking-[0.3em] font-light uppercase"
            >
              <span>Sanctuary</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: Golden Philosophical Seal */}
        <motion.div layout className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#AA7C11]/20 to-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37]">
          <Sparkles size={18} />
        </motion.div>
      </motion.nav>
    </div>
  );
}

