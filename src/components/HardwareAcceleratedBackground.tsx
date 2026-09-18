'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function HardwareAcceleratedBackground() {
  const [isHighEnd, setIsHighEnd] = useState<boolean | null>(null);
  const fpsRef = useRef<number[]>([]);

  useEffect(() => {
    const checkHardware = () => {
      const cores = navigator.hardwareConcurrency || 2;
      const nav = navigator as any;
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      const isSlow = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.effectiveType === '3g');
      const memory = nav.deviceMemory || 4;

      if (cores >= 4 && !isSlow && memory >= 4) {
        setIsHighEnd(true);
      } else {
        setIsHighEnd(false);
      }
    };

    checkHardware();

    let lastTime = performance.now();
    let frameCount = 0;
    let reqId: number;

    const monitorFPS = (time: number) => {
      frameCount++;
      const delta = time - lastTime;
      
      if (delta >= 1000) {
        const fps = (frameCount * 1000) / delta;
        fpsRef.current.push(fps);
        if (fpsRef.current.length > 3) fpsRef.current.shift();
        
        const avgFps = fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length;
        if (fpsRef.current.length === 3 && avgFps < 30) {
          setIsHighEnd(false);
        }

        frameCount = 0;
        lastTime = time;
      }
      reqId = requestAnimationFrame(monitorFPS);
    };

    reqId = requestAnimationFrame(monitorFPS);
    return () => cancelAnimationFrame(reqId);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden pointer-events-none bg-[#040404]">
      {/* Luxury dark radial gradient from #040404 to #0b0b0b with subtle SVG noise */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #0b0b0b 0%, #060606 50%, #040404 100%)',
        }}
      />
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle antique gold ambient glow */}
      {isHighEnd && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[40vh] rounded-full bg-[radial-gradient(circle,#D4AF37_0%,transparent_70%)] blur-[120px] opacity-20 mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[40vh] rounded-full bg-[radial-gradient(circle,#AA7C11_0%,transparent_70%)] blur-[140px] opacity-15 mix-blend-screen" />
        </motion.div>
      )}
    </div>
  );
}
