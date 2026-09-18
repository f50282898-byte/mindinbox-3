'use client';

import { useState, useEffect } from 'react';
import { Play, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Courses() {
  const [activeTab, setActiveTab] = useState<'video' | 'pdf'>('video');

  // FORTRESS DRM: Disable Right-Click and Context Menu globally in this view
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <div className="w-full fade-in pb-24 relative select-none" onContextMenu={(e) => e.preventDefault()}>
      <div className="text-center space-y-4 pt-8 mb-16">
        <h1 className="text-3xl md:text-5xl font-light tracking-widest text-[#EAEAEA] font-serif">
          THE LIBRARY
        </h1>
        <p className="text-[#888888] tracking-widest uppercase text-xs">
          Internalized Consumption. Never leave the Sanctuary.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-1/4 space-y-6">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 shadow-xl">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#888888] mb-4 px-2">Format</h3>
            <button
              onClick={() => setActiveTab('video')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'video' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 shadow-inner' : 'text-[#888888] hover:bg-white/5 hover:text-[#EAEAEA]'}`}
            >
              <Play size={16} />
              <span className="text-sm tracking-wide font-medium">Video Course</span>
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all mt-2 ${activeTab === 'pdf' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 shadow-inner' : 'text-[#888888] hover:bg-white/5 hover:text-[#EAEAEA]'}`}
            >
              <FileText size={16} />
              <span className="text-sm tracking-wide font-medium">Book Reader</span>
            </button>
          </div>

          {activeTab === 'video' && (
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 shadow-xl">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#888888] mb-4 px-2">Modules</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((module, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer text-gray-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      {i < 2 ? <CheckCircle2 size={16} className="text-[#D4AF37]" /> : <div className="w-4 h-4 rounded-full border border-gray-600" />}
                      <span className="text-sm">Module 0{module}</span>
                    </div>
                    <ChevronRight size={14} className="text-[#888888]" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Area - DRM PROTECTED */}
        <div className="w-full lg:w-3/4">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl h-[600px] flex flex-col relative pointer-events-auto"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(212, 175, 55, 0.1), 0 25px 50px -12px rgba(0,0,0,0.5)' }}
          >
            {/* DRM Transparent Overlay to block DOM inspection of underlying media */}
            <div className="absolute inset-0 z-50 pointer-events-none" />

            {/* Header of Content */}
            <div className="px-6 py-4 border-b border-[#D4AF37]/10 bg-[#030303]/80 flex items-center justify-between relative z-10">
              <h2 className="text-lg font-serif text-[#EAEAEA] tracking-wide">
                {activeTab === 'video' ? 'The Architecture of the Mind' : 'Meditations on the Void'}
              </h2>
              <span className="text-[10px] text-[#D4AF37]/70 uppercase tracking-[0.2em] font-light">
                {activeTab === 'video' ? 'Protected Stream' : 'Encrypted Tome'}
              </span>
            </div>

            {/* The Actual Content Wrapper */}
            <div className="flex-1 relative bg-[#030303] flex items-center justify-center pointer-events-auto">
              {activeTab === 'video' ? (
                // Luxury Video Player Wrapper Mock
                <div className="relative w-full h-full flex flex-col items-center justify-center group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37] group-hover:scale-105 transition-transform duration-500 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                    <Play size={36} className="ml-2" />
                  </div>
                  <p className="mt-8 text-xs text-[#888888] tracking-[0.2em] uppercase">Click to Begin</p>
                  
                  {/* Fake controls bar at bottom */}
                  <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end px-8 pb-6">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-[#D4AF37]" />
                    </div>
                  </div>
                </div>
              ) : (
                // Custom Dark-Mode PDF Reader Mock
                <div className="w-full h-full p-12 overflow-y-auto scrollbar-hide text-[#EAEAEA] font-serif leading-[2] text-lg space-y-8 blur-0 select-none">
                  <h1 className="text-4xl text-[#D4AF37] mb-12">Chapter I: The Silence</h1>
                  <p>
                    When one peers into the abyss, it is not the darkness that terrifies, but the profound silence. It is a silence that demands an answer, an answer that can only be found within the construct of one's own mind.
                  </p>
                  <p>
                    The architecture of this inner sanctuary must be built upon pillars of logic, yet draped in the soft fabrics of emotion. Too rigid, and the mind shatters under pressure. Too fluid, and it dissolves into chaos.
                  </p>
                  <p>
                    We must forge the golden lock, not to keep others out, but to ensure that when we step within, we are truly alone with the Sage.
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-[#888888] font-sans uppercase tracking-[0.2em] mt-16 pt-8 border-t border-[#D4AF37]/10">
                    <span>Page 1</span>
                    <span>12% Read</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

