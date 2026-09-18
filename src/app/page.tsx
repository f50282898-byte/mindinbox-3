'use client';

import SageChat from '@/components/SageChat';
import GoldenLock from '@/components/GoldenLock';
import { Sparkles, Brain, BookMarked, Activity, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [greeting, setGreeting] = useState("The Sanctuary of the Self");

  // Mock global state monitor for Omnipresent Sage
  useEffect(() => {
    // In a real scenario, this reads from useStore or Firestore mood history
    const hasAnxiety = true; 
    if (hasAnxiety) {
      setTimeout(() => {
        setGreeting("The storms have been relentless lately. Shall we step into the Catharsis Chamber?");
      }, 3000);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full fade-in space-y-24">
      {/* Header section */}
      <div className="text-center space-y-6 pt-12">
        <h1 className="text-5xl md:text-7xl font-light tracking-[0.3em] text-[#EAEAEA] font-serif">
          MIND <span className="text-[#D4AF37] italic">IN</span> BOX
        </h1>
        <motion.p 
          key={greeting}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#888888] tracking-[0.2em] uppercase text-[10px] font-sans h-4"
        >
          {greeting}
        </motion.p>
      </div>

      {/* The Chat Interface */}
      <div className="w-full">
        <SageChat />
      </div>

      {/* Available Sanctuaries Grid */}
      <div className="w-full space-y-8 pb-32">
        <div className="flex items-center justify-center space-x-4 mb-12">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
          <h3 className="text-[10px] font-light text-[#D4AF37] tracking-[0.3em] uppercase text-center">Sanctuaries</h3>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
        </div>
        
        {/* Horizontal Swipeable Masonry Grid style container */}
        <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory gap-6 scrollbar-hide px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:px-0">
          
          <Link href="/utopian-city" className="group snap-center min-w-[280px] md:min-w-0">
            <div className="p-8 h-56 rounded-2xl bg-[#0A0A0A] border border-white/5 flex flex-col items-center justify-center space-y-6 hover:bg-white/5 transition-all duration-500 shadow-xl group-hover:border-[#D4AF37]/20 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="text-[#D4AF37] w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
              <h4 className="font-serif text-xl tracking-wide text-[#EAEAEA]">The Utopian City</h4>
              <p className="text-[10px] text-[#888888] text-center uppercase tracking-[0.2em]">Daily Wisdom</p>
            </div>
          </Link>

          <Link href="/courses" className="group snap-center min-w-[280px] md:min-w-0">
            <div className="p-8 h-56 rounded-2xl bg-[#0A0A0A] border border-white/5 flex flex-col items-center justify-center space-y-6 hover:bg-white/5 transition-all duration-500 shadow-xl group-hover:border-[#D4AF37]/20 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <BookMarked className="text-[#888888] group-hover:text-[#D4AF37] w-10 h-10 group-hover:scale-110 transition-all duration-500" />
              <h4 className="font-serif text-xl tracking-wide text-[#EAEAEA]">The Library</h4>
              <p className="text-[10px] text-[#888888] text-center uppercase tracking-[0.2em]">Books & Courses</p>
            </div>
          </Link>

          <div className="snap-center min-w-[280px] md:min-w-0">
            <GoldenLock featureName="Mood Engineering" description="Map your psychological state across time. Identify the turbulence before the storm.">
              <div className="p-8 h-56 rounded-2xl bg-[#0A0A0A] border border-white/5 flex flex-col items-center justify-center space-y-6 shadow-xl relative">
                <Activity className="text-red-900/50 w-10 h-10" />
                <h4 className="font-serif text-xl tracking-wide text-[#EAEAEA]">Catharsis</h4>
                <p className="text-[10px] text-[#888888] text-center uppercase tracking-[0.2em]">Mood Tracker</p>
              </div>
            </GoldenLock>
          </div>

          <div className="snap-center min-w-[280px] md:min-w-0">
            <GoldenLock featureName="Deep Journaling" description="The ink of the mind. Securely encrypted, infinitely deep.">
              <div className="p-8 h-56 rounded-2xl bg-[#0A0A0A] border border-white/5 flex flex-col items-center justify-center space-y-6 shadow-xl relative">
                <Edit3 className="text-purple-900/50 w-10 h-10" />
                <h4 className="font-serif text-xl tracking-wide text-[#EAEAEA]">The Archive</h4>
                <p className="text-[10px] text-[#888888] text-center uppercase tracking-[0.2em]">Daily Journal</p>
              </div>
            </GoldenLock>
          </div>

        </div>
      </div>
    </div>
  );
}
