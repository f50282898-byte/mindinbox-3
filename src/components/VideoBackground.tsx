'use client';

import { useEffect, useRef, useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';

/* ── Context: pages can declare their video theme ── */
interface VideoTheme {
  src?: string;       // /videos/dashboard.mp4 etc. — set by page
  poster?: string;    // Placeholder image while video loads
  overlayOpacity?: number; // 0-1, default 0.55 (dark scrim over video)
}

const VideoThemeContext = createContext<{
  setTheme: (t: VideoTheme) => void;
}>({ setTheme: () => {} });

export const useVideoTheme = () => useContext(VideoThemeContext);

/* ── Root Background Component ─────────────────────
   Renders at fixed z-[-50] so every page sees it.
   Pages call useVideoTheme().setTheme() to swap it.
   Falls back to the luxury radial gradient when no
   video src is provided or when hardware is weak.
   ─────────────────────────────────────────────── */
export default function VideoBackground() {
  const [theme, setTheme] = useState<VideoTheme>({});
  const [videoReady, setVideoReady] = useState(false);
  const [canPlayVideo, setCanPlayVideo] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Hardware capability check */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nav = navigator as any;
    const cores = navigator.hardwareConcurrency || 2;
    const memory = nav.deviceMemory || 4;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    const isSlow = connection && ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
    setCanPlayVideo(cores >= 4 && memory >= 4 && !isSlow);
  }, []);

  /* When theme.src changes, reset readiness and reload video */
  useEffect(() => {
    setVideoReady(false);
    const el = videoRef.current;
    if (!el || !theme.src) return;
    el.load();
  }, [theme.src]);

  const showVideo = canPlayVideo && !!theme.src;
  const scrimOpacity = theme.overlayOpacity ?? 0.55;

  return (
    <VideoThemeContext.Provider value={{ setTheme }}>
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: -50 }}>

        {/* ── Base gradient (always present) ── */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 25%, #0d0b08 0%, #060504 45%, #020202 100%)',
          }}
        />

        {/* ── Film-grain noise texture ── */}
        <div className="absolute inset-0 noise-overlay" />

        {/* ── Ambient gold glow orbs (visible even behind video) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute rounded-full"
            style={{
              top: '-15%', left: '15%',
              width: '55vw', height: '40vh',
              background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              bottom: '-10%', right: '5%',
              width: '45vw', height: '35vh',
              background: 'radial-gradient(circle, rgba(168,137,44,0.09) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />
        </motion.div>

        {/* ── Looping Video Layer ── */}
        {showVideo && (
          <>
            <motion.video
              ref={videoRef}
              key={theme.src}               /* re-mounts on src change */
              autoPlay
              muted
              loop
              playsInline
              poster={theme.poster}
              onCanPlay={() => setVideoReady(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: videoReady ? 1 : 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 1 }}
            >
              <source src={theme.src} type="video/mp4" />
              <source src={(theme.src as string).replace('.mp4', '.webm')} type="video/webm" />
            </motion.video>

            {/* Dark scrim — LOW-FOG: just enough to ensure readability
                while video texture is clearly visible behind glass cards */}
            {videoReady && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: scrimOpacity }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
                style={{
                  zIndex: 2,
                  background: `linear-gradient(
                    to bottom,
                    rgba(2,2,2,${scrimOpacity * 0.9}) 0%,
                    rgba(2,2,2,${scrimOpacity * 0.7}) 50%,
                    rgba(2,2,2,${scrimOpacity * 0.95}) 100%
                  )`,
                }}
              />
            )}
          </>
        )}
      </div>
    </VideoThemeContext.Provider>
  );
}
