'use client';

import { useState, useEffect } from 'react';
import { Book, CheckCircle2, Feather } from 'lucide-react';

export default function Journal() {
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Autosave logic (3 seconds)
  useEffect(() => {
    if (!content) return;
    
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      // Mock Firestore save
      setSaveStatus('saved');
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(20); // subtle haptic confirm
      }
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className="w-full max-w-3xl mx-auto fade-in pb-32">
      <div className="flex items-center justify-between mb-12 pt-8">
        <div>
          <h1 className="text-3xl font-serif text-[#EAEAEA]">The Catharsis Journal</h1>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888]">{new Date().toDateString()}</span>
            <span className="text-[#888888]">•</span>
            <div className="flex items-center text-[10px] uppercase tracking-widest text-[#D4AF37]/70">
              {saveStatus === 'saving' && <span className="animate-pulse">Scribing to the Ether...</span>}
              {saveStatus === 'saved' && <span className="flex items-center"><CheckCircle2 size={12} className="mr-1" /> Eternalized</span>}
              {saveStatus === 'idle' && <span>Resting</span>}
            </div>
          </div>
        </div>
        
        {/* Forge Monthly Tome Button */}
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.1)]">
          <Book size={16} />
          <span className="text-xs uppercase tracking-widest font-medium">Forge Tome</span>
        </button>
      </div>

      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Bleed upon the obsidian parchment..."
          className="w-full min-h-[500px] bg-transparent resize-none outline-none text-[#EAEAEA] font-serif text-xl leading-[2] placeholder-[#888888]/50"
          spellCheck={false}
        />
        
        {/* Floating Minimal Formatting Toolbar (Mock for Medium-style) */}
        {content.length > 0 && (
          <div className="absolute top-0 right-0 -mr-16 flex flex-col space-y-4 opacity-30 hover:opacity-100 transition-opacity">
            <button className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/10">
              <Feather size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

