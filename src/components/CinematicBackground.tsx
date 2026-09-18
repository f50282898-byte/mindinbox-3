'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoStore } from '@/store/useVideoStore';

const VideoLayer = ({ src }: { src: string }) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <motion.video
      autoPlay
      loop
      muted
      playsInline
      onCanPlay={() => setIsReady(true)}
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className="absolute inset-0 w-full h-full object-cover"
      style={{ zIndex: 2 }}
    >
      <source src={src} type="video/mp4" />
      {/* Fallback for webm if provided in same path */}
      <source src={src.replace('.mp4', '.webm')} type="video/webm" />
    </motion.video>
  );
};

export default function CinematicBackground() {
  const { videoSrc } = useVideoStore();

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none" style={{ zIndex: -50 }}>
      {/* Base gradient fallback (always present) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 25%, #0d0b08 0%, #060504 45%, #020202 100%)',
        }}
      />

      {/* Film grain noise overlay */}
      <div className="absolute inset-0 noise-overlay" style={{ zIndex: 1 }} />

      {/* Crossfading Video Layers */}
      <AnimatePresence>
        {videoSrc && <VideoLayer key={videoSrc} src={videoSrc} />}
      </AnimatePresence>

      {/* THE LOW-FOG GLASS OVERLAY (z-index: 10) */}
      {/* This ensures white luxury text is always readable over bright videos */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ 
          zIndex: 10,
          background: 'radial-gradient(circle at center, rgba(2,2,2,0.4) 0%, rgba(2,2,2,0.85) 70%, rgba(2,2,2,0.95) 100%)'
        }}
      />
    </div>
  );
}
