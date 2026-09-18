'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaradayOverlay({ children }: { children: React.ReactNode }) {
  const [isEncrypting, setIsEncrypting] = useState(true);
  const [terminalText, setTerminalText] = useState('Initiating Protocol...');

  useEffect(() => {
    const sequence = [
      { text: 'ESTABLISHING SECURE HANDSHAKE...', time: 100 },
      { text: 'GENERATING AES-256 KEYS...', time: 400 },
      { text: 'ENCRYPTING NEURAL PATHWAYS...', time: 700 },
      { text: 'ISOLATING CHAMBER...', time: 1000 },
      { text: 'VAULT SECURED.', time: 1300 },
    ];

    sequence.forEach(({ text, time }) => {
      setTimeout(() => setTerminalText(text), time);
    });

    const finishTimeout = setTimeout(() => {
      setIsEncrypting(false);
    }, 1500);

    return () => clearTimeout(finishTimeout);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isEncrypting && (
          <motion.div
            key="faraday-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 backdrop-blur-3xl overflow-hidden"
          >
            {/* Spinning Gold Geometric Shape */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="w-24 h-24 mb-8 flex items-center justify-center relative"
            >
              <div className="absolute inset-0 border border-[var(--gold-pure)]/40 rounded-sm transform rotate-45" />
              <div className="absolute inset-0 border border-[var(--gold-pure)]/60 rounded-sm transform rotate-[22.5deg]" />
              <div className="absolute inset-2 border-2 border-[var(--gold-pure)] rounded-full shadow-[0_0_15px_var(--gold-pure)]" />
              <div className="w-2 h-2 bg-[var(--gold-pure)] rounded-full animate-pulse shadow-[0_0_10px_var(--gold-pure)]" />
            </motion.div>

            {/* Terminal Text */}
            <motion.div 
              className="font-mono text-[var(--gold-pure)] text-xs md:text-sm tracking-[0.2em] text-shadow-gold text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={terminalText}
            >
              {terminalText}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Reveal Content smoothly */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isEncrypting ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </>
  );
}

