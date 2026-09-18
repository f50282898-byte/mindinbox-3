'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';

const CORRIDORS = [
  {
    id: 'stoic',
    title: 'الرواقية',
    desc: 'مدرسة الحصانة الداخلية والسيطرة على الانفعالات.',
    image: 'https://images.unsplash.com/photo-1544254261-26792f3922d4?q=80&w=800&auto=format&fit=crop', // Roman bust aesthetic
  },
  {
    id: 'existential',
    title: 'الوجودية',
    desc: 'مدرسة التمرد وصناعة المعنى في كون صامت.',
    image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=800&auto=format&fit=crop', // Abstract / existential darkness
  },
  {
    id: 'sufism',
    title: 'التصوف',
    desc: 'مدرسة تصفية الباطن وبلوغ اليقين الشهودي.',
    image: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=800&auto=format&fit=crop', // Islamic architecture / Sufi aesthetic
  }
];

export default function SchoolCorridorsPage() {
  const router = useRouter();
  const { isPro } = useStore();

  const handleCorridorClick = (id: string) => {
    if (!isPro) {
      router.push('/vault/checkout');
    } else {
      // In a real app, go to the specific school page
      console.log('Navigate to school:', id);
    }
  };

  return (
    <main className="min-h-screen px-4 py-16" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--gold-pure)] text-shadow-gold" style={{ fontFamily: 'var(--font-reem-kufi)' }}>
            أروقة المدرسة الفلسفية
          </h1>
          <p className="text-sm font-serif text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            اختر المسلك الذي يوافق اضطرابك. كل رواق يحوي حكماءه، منهجياتهم العميقة، واختباراتهم النفسية.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CORRIDORS.map((corridor, i) => (
            <motion.button
              key={corridor.id}
              onClick={() => handleCorridorClick(corridor.id)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden group border border-[var(--gold-border)] bg-black"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-40 group-hover:opacity-30 grayscale sepia-[0.2]"
                style={{ backgroundImage: `url(${corridor.image})` }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Default Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-right">
                <h2 className="text-3xl font-bold text-[var(--gold-pure)] mb-3" style={{ fontFamily: 'var(--font-reem-kufi)' }}>
                  {corridor.title}
                </h2>
                <p className="text-sm font-serif text-[var(--text-primary)] leading-loose">
                  {corridor.desc}
                </p>
              </div>

              {/* Locked Overlay (For Free Users) */}
              {!isPro && (
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 rounded-full border border-[var(--gold-pure)] flex items-center justify-center bg-[var(--gold-pure)]/10 text-[var(--gold-pure)] shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                    <Lock size={32} />
                  </div>
                  <span className="font-bold text-[var(--gold-pure)] text-lg tracking-widest" style={{ fontFamily: 'var(--font-reem-kufi)' }}>
                    مغلق بالعهد السيادي
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </main>
  );
}

