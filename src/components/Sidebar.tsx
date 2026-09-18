'use client';

import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Feather, Users, KeyRound, MapPin } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'اسأل الحكيم', icon: Layers },
  { href: '/utopian-city', label: 'يوتوبيا', icon: MapPin },
  { href: '/journal', label: 'محراب التفريغ', icon: Feather },
  { href: '/secret-council', label: 'المجلس السري', icon: Users },
  { href: '/vault', label: 'العهد السيادي', icon: KeyRound },
];

export default function Sidebar() {
  const { isSidebarOpen } = useStore();
  const pathname = usePathname();

  return (
    <AnimatePresence initial={false}>
      {isSidebarOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-full shrink-0 border-l border-white/5 bg-black/40 backdrop-blur-2xl z-40 overflow-hidden hidden md:block"
          dir="rtl"
        >
          <div className="w-[280px] h-full flex flex-col pt-24 px-6 pb-8">
            <div className="flex-1 space-y-2 mt-4">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 border border-transparent ${
                      isActive 
                        ? 'bg-[var(--gold-glow)] border-[var(--gold-border)] text-[var(--gold-pure)] shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                        : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] hover:border-white/5'
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.5} className={isActive ? 'text-[var(--gold-pure)]' : 'opacity-70'} />
                    <span className="font-serif text-sm tracking-wide mt-0.5">{link.label}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Minimal footer brand inside sidebar */}
            <div className="pt-6 border-t border-white/5 mt-auto text-center">
              <span className="text-[10px] text-[var(--text-secondary)] font-serif tracking-widest uppercase">
                Sanctuary v2.0
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

