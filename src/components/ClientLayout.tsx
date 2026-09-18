'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ThemeInit from '@/components/ThemeInit';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { isSidebarOpen } = useStore();

  return (
    <>
      <ThemeInit />
      <div className="flex h-[100svh] w-full overflow-hidden relative">
        <Sidebar />
        
        {/* Main Content Area - Pushed & Scaled by Sidebar */}
        <motion.div
          animate={{
            x: isSidebarOpen ? -20 : 0, // push left
            scale: isSidebarOpen ? 0.98 : 1, // slight scale down
            borderRadius: isSidebarOpen ? '24px' : '0px',
            opacity: isSidebarOpen ? 0.95 : 1,
            // Since Sidebar is fixed on the right and width is 280px
            // we use x: -280 to move it left, but maybe just a slight push is more elegant?
            // "slide in from the right and physically push the main chat interface to the left, scaling it down"
            paddingRight: isSidebarOpen ? 280 : 0
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-transparent transform-gpu"
          style={{ transformOrigin: 'left center' }}
        >
          {/* Overlay to dim when sidebar is open on smaller screens? We keep it luxury and clean without dimming, just scaling. */}
          <TopBar />
          
          <main className="flex-1 relative w-full h-full flex flex-col z-10 overflow-hidden theme-transition">
            {children}
          </main>
        </motion.div>
      </div>
    </>
  );
}

