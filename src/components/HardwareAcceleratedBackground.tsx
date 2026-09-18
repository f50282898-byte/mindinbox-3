'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function HardwareAcceleratedBackground() {
  const [isHighEnd, setIsHighEnd] = useState<boolean | null>(null);
  const fpsRef = useRef<number[]>([]);

  useEffect(() => {
    // Initial hardware checks
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

    // Silent FPS Monitor
    let lastTime = performance.now();
    let frameCount = 0;
    let reqId: number;

    const monitorFPS = (time: number) => {
      frameCount++;
      const delta = time - lastTime;
      
      if (delta >= 1000) { // Calculate FPS every second
        const fps = (frameCount * 1000) / delta;
        fpsRef.current.push(fps);
        
        // Keep last 3 seconds of data
        if (fpsRef.current.length > 3) fpsRef.current.shift();
        
        // If average FPS over 3 seconds drops below 30, force fallback
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

  if (isHighEnd === null) {
    return <div className="fixed inset-0 bg-[#030303] -z-50" />;
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-[#030303]">
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A0A0A] to-[#030303]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, #0A0A0A 0%, #030303 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")
          `
        }}
      />

      {isHighEnd && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full mix-blend-screen"
        >
          {/* WebM Loop Placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/5 to-transparent" />
        </motion.div>
      )}
    </div>
  );
}

