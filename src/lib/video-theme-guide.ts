/**
 * MIND IN BOX — Video Theme Guide
 * 
 * To set a custom looping video background on any page, add this
 * to the TOP of your page component (client component only):
 *
 *   import { useVideoTheme } from '@/components/VideoBackground';
 *   import { useEffect } from 'react';
 *
 *   export default function MyPage() {
 *     const { setTheme } = useVideoTheme();
 *
 *     useEffect(() => {
 *       setTheme({
 *         src: '/videos/my-page-bg.mp4',   // place in /public/videos/
 *         poster: '/videos/my-page-bg.jpg', // optional: shown while loading
 *         overlayOpacity: 0.55,             // 0.4 = more video, 0.7 = darker
 *       });
 *       return () => setTheme({});           // reset on unmount
 *     }, [setTheme]);
 *     ...
 *   }
 *
 * Video file requirements:
 *   - Format: MP4 (H.264) + WebM (VP9) for best browser support
 *   - Resolution: 1920×1080 minimum, 30fps
 *   - Duration: 10-30 seconds (seamless loop)
 *   - Bitrate: 2-4 Mbps for quality; compress to <10 MB for fast load
 *   - Theme suggestions per page:
 *       /              → /videos/dashboard.mp4   (slow particle / dark gold smoke)
 *       /utopian-city  → /videos/utopian.mp4     (slow aerial city / starfield)
 *       /journal       → /videos/journal.mp4     (candlelight / ink in water)
 *       /secret-council→ /videos/council.mp4     (dark library / stone texture)
 *       /vault         → /videos/vault.mp4       (gold vault door / luxury feel)
 *
 * If no video is provided for a page, the system falls back to the
 * static luxury radial gradient + ambient gold glow orbs automatically.
 */
export {};

