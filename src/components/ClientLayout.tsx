'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ThemeInit from '@/components/ThemeInit';
import { useAutoGhost } from '@/hooks/useAutoGhost';
import GamificationEngine from '@/components/GamificationEngine';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { isSidebarOpen } = useStore();
  const isGhostMode = useAutoGhost(45); // 45 seconds

  return (
    <>
      <ThemeInit />
      <GamificationEngine />
      <div className="flex h-[100svh] w-full overflow-hidden relative">
        <Sidebar />
        
        {/* Main Content Area - Pushed & Scaled by Sidebar */}
        <motion.div
          animate={{
            x: isSidebarOpen ? -20 : 0, // push left
            scale: isSidebarOpen ? 0.98 : 1, // slight scale down
            borderRadius: isSidebarOpen ? '24px' : '0px',
            opacity: isSidebarOpen ? 0.95 : 1,
            paddingRight: isSidebarOpen ? 280 : 0
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-transparent transform-gpu"
          style={{ transformOrigin: 'left center' }}
        >
          <TopBar />
          
          <main className="flex-1 relative w-full h-full flex flex-col z-10 overflow-hidden theme-transition">
            <motion.div 
              className="w-full h-full"
              animate={{ filter: isGhostMode ? 'blur(24px)' : 'blur(0px)', opacity: isGhostMode ? 0.4 : 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
            
            {/* Auto-Ghost Overlay Text */}
            <AnimatePresence>
              {isGhostMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
                >
                  <p 
                    className="text-[var(--gold-pure)] text-2xl tracking-wider text-shadow-gold"
                    style={{ fontFamily: 'var(--font-reem-kufi)' }}
                  >
                    تم حجب أفكارك لحمايتها. حرك مؤشرك للعودة
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </motion.div>
      </div>
    </>
  );
}

