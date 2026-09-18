'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Feather, Flame, BrainCircuit, Castle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { isSidebarOpen } = useStore();
  const pathname = usePathname();

  const navItems = [
    { name: 'اسأل الحكيم', path: '/', icon: BrainCircuit },
    { name: 'يوتوبيا', path: '/utopian-city', icon: Castle },
    { name: 'المجلس السري', path: '/secret-council', icon: Flame },
    { name: 'محراب التفريغ', path: '/journal', icon: Feather },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ 
        x: isSidebarOpen ? 0 : '100%',
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 right-0 bottom-0 w-[280px] z-[50] pt-28 pb-8 px-5 border-l border-[var(--glass-border)] shadow-[-20px_0_40px_rgba(0,0,0,0.2)] flex flex-col justify-between"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      }}
      dir="rtl"
    >
      <div className="space-y-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-[var(--gold-pure)]/10 border border-[var(--gold-pure)]/30 text-[var(--gold-pure)]'
                  : 'hover:bg-black/10 dark:hover:bg-white/5 border border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon size={18} strokeWidth={1.5} />
              <span className="font-reem text-lg">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="text-center pb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-pure)] mx-auto opacity-50 pulse-gold" />
      </div>
    </motion.div>
  );
}
