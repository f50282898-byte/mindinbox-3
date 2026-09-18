'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, User, Sparkles } from 'lucide-react';

interface UtopianItem {
  id: number;
  author: string;
  school: string;
  content: string;
}

// Generate 100 quotes based on the current date seed
const generateDailyQuotes = (): UtopianItem[] => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // A simple deterministic pseudo-random generator
  const random = (seed: number) => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const schools = ['Stoicism', 'Existentialism', 'Islamic Golden Age', 'Zen Buddhism', 'Renaissance Humanism'];
  const authors = ['Seneca', 'Nietzsche', 'Al-Ghazali', 'Dogen', 'Erasmus', 'Marcus Aurelius', 'Ibn Sina', 'Sartre'];
  
  const quotes = [];
  for (let i = 0; i < 100; i++) {
    const currentSeed = seed + i;
    quotes.push({
      id: i,
      author: authors[Math.floor(random(currentSeed) * authors.length)],
      school: schools[Math.floor(random(currentSeed + 1) * schools.length)],
      content: `The essence of the mind is not found in the stillness of the void, but in the harmony of its movement. Fragment ${i + 1} of the inner truth. Seek the depth before you seek the breadth.`,
    });
  }
  return quotes;
};

export default function UtopianCity() {
  const [quotes, setQuotes] = useState<UtopianItem[]>([]);

  useEffect(() => {
    setQuotes(generateDailyQuotes());
  }, []);

  return (
    <div className="w-full fade-in pb-24">
      <div className="text-center space-y-4 pt-8 mb-16">
        <div className="flex justify-center mb-4 text-amber-500">
          <Sparkles size={32} />
        </div>
        <h1 className="text-3xl md:text-5xl font-light tracking-widest text-white font-serif">
          THE UTOPIAN CITY
        </h1>
        <p className="text-gray-500 tracking-widest uppercase text-xs">
          100 fragments of wisdom. Rebuilt every dawn.
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {quotes.map((quote, index) => (
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index % 10) * 0.1 }}
            className="break-inside-avoid bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer group"
          >
            <Quote className="text-amber-500/30 w-8 h-8 mb-4 group-hover:text-amber-500/60 transition-colors" />
            <p className="text-gray-300 font-light leading-relaxed mb-6">
              "{quote.content}"
            </p>
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gray-400">
                  <User size={12} />
                </div>
                <span className="text-xs text-gray-400 font-medium tracking-wide">{quote.author}</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-amber-500/70 border border-amber-500/20 px-2 py-1 rounded-full">
                {quote.school}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

