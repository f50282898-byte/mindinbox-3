'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type ToastEvent = {
  id: string;
  message: string;
};

export default function GamificationEngine() {
  const pathname = usePathname();
  const [toasts, setToasts] = useState<ToastEvent[]>([]);
  
  // Ref to track last click times for Void Stare
  const clickTimes = useRef<number[]>([]);
  
  // Track idle time for Silent Observer
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  const addToast = useCallback((message: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  // 1. THE SILENT OBSERVER (Root Chat Page Idle for 60s)
  useEffect(() => {
    if (pathname !== '/') {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      return;
    }

    const resetIdleTimer = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        addToast('تأملك العميق ملحوظ. لقد مُنحت دخولاً مؤقتاً للمجلس السري.');
      }, 60000); // 60 seconds
    };

    // Listen to activity
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);

    // Initial start
    resetIdleTimer();

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('scroll', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
    };
  }, [pathname, addToast]);

  // 2. THE VOID STARE (5 rapid clicks on background)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Check if they are clicking an empty space (like body or main wrapper, not buttons/inputs)
      const target = e.target as HTMLElement;
      // Heuristic: if it's the root body, cinematic background, or simple div without specific roles
      if (
        target.tagName === 'BODY' || 
        target.tagName === 'HTML' || 
        target.id === 'cinematic-bg' ||
        (target.tagName === 'DIV' && !target.closest('button') && !target.closest('input') && !target.closest('a'))
      ) {
        const now = Date.now();
        clickTimes.current.push(now);
        
        // Keep only clicks from the last 2 seconds
        clickTimes.current = clickTimes.current.filter((t) => now - t < 2000);
        
        if (clickTimes.current.length >= 5) {
          addToast('البحث في الفراغ يكشف الذهب.');
          clickTimes.current = []; // reset
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [addToast]);

  // 3. THE LEAP OF FAITH (Listen to custom event from Journal)
  useEffect(() => {
    const handleLeapOfFaith = () => {
      addToast('هل الفراغ هو ما تشعر به؟');
    };

    window.addEventListener('leapOfFaith', handleLeapOfFaith);
    return () => window.removeEventListener('leapOfFaith', handleLeapOfFaith);
  }, [addToast]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
            className="w-full text-center p-4 rounded-xl border border-[var(--gold-border)] bg-black/80 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            <p className="font-serif text-[var(--gold-pure)] text-sm tracking-wide text-shadow-gold">
              {t.message}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

