'use client';

import SageChat from '@/components/SageChat';
import DisciplineTracker from '@/components/DisciplineTracker';
import BinauralEngine from '@/components/BinauralEngine';
import ThoughtArchitect from '@/components/ThoughtArchitect';
import { 
  Sparkles, 
  Landmark, 
  Feather, 
  Users, 
  KeyRound, 
  Crown,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

export default function Home() {
  const { user, isPro } = useStore();

  const sanctuaries = [
    {
      title: 'صَفّ المدينة الفاضلة',
      desc: '١٠٠ فكرة وحوار متجدد يومياً مع حكماء التاريخ من الرواقية إلى الفلسفة الإسلامية',
      href: '/utopian-city',
      icon: Landmark,
      badge: 'متجدد فلكياً',
    },
    {
      title: 'محراب التفريغ',
      desc: 'تدوين الخواطر على رقوق بردي رقمية سوداء مع حفظ سحابي مشفر كل ٣ ثوانٍ',
      href: '/journal',
      icon: Feather,
      badge: 'تفريغ نفسي',
    },
    {
      title: 'المجلس السري',
      desc: 'رواق الحوار المشفر لنخبة السالكين، محمي برتبة العهد السيادي عبر فايربيس',
      href: '/secret-council',
      icon: Users,
      badge: isPro ? 'متاح لك' : 'خاص بالـ Pro',
      locked: !isPro,
    },
    {
      title: 'خزانة العهد (الترقية)',
      desc: 'امتلاك العضوية السيادية، فتح قنوات التحليل العميق، وختم الميثاق مدى الحياة',
      href: '/vault',
      icon: KeyRound,
      badge: '$149/سنة',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full fade-in space-y-16 pb-32" dir="rtl">
      {/* Hero Welcome */}
      <div className="text-center space-y-4 pt-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-xs font-serif shadow-sm"
        >
          <Sparkles size={13} className="animate-pulse" />
          <span>مرحباً بك يا {user.displayName} في حصنك الباطني</span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-wide text-[#EAEAEA]">
          العَقْلُ فِي <span className="text-[#D4AF37] italic">الصُّنْدُوقِ</span>
        </h1>
        <p className="text-xs md:text-sm text-[#888888] font-serif tracking-wider max-w-lg mx-auto leading-relaxed">
          المنصة الفلسفية الرقمية لاستعادة السيادة على الفكر، ترويض الوجدان، وترميم الشتات الوجودي.
        </p>
      </div>

      {/* Top Section: Interactive 3-Tier Sage Chat */}
      <section className="w-full max-w-4xl mx-auto">
        <SageChat />
      </section>

      {/* Sanctuaries Quick Grid */}
      <section className="w-full space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h2 className="font-serif text-xl font-bold text-[#EAEAEA] flex items-center gap-2">
            <span>محاريب الرياضة الفكرية (Sanctuaries)</span>
          </h2>
          <span className="text-xs text-[#D4AF37] font-serif">انتقال سلس بدون تحديث الصفحة</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {sanctuaries.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Link
                key={idx}
                href={s.href}
                className="group p-6 rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/15 hover:border-[#D4AF37]/45 transition-all duration-300 shadow-lg relative flex flex-col justify-between overflow-hidden hover:scale-[1.01]"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#D4AF37] border border-white/5 font-sans">
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#EAEAEA] group-hover:text-[#D4AF37] transition-colors mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#888888] font-serif leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#D4AF37]">
                  <span className="font-serif text-[11px]">ادخل المحراب</span>
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tracking & Practical Sanctuaries: ميزان الجرد + هندسة المزاج + طور أفكارك */}
      <section className="w-full space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ميزان الجرد */}
          <DisciplineTracker />

          {/* طور أفكارك */}
          <ThoughtArchitect />
        </div>

        {/* هندسة المزاج (Binaural Beats) */}
        <BinauralEngine />
      </section>
    </div>
  );
}
