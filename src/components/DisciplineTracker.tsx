'use client';

import { useStore } from '@/store/useStore';
import { CheckCircle2, Circle, Flame, Award, BarChart3 } from 'lucide-react';

const DISCIPLINES = [
  { id: 'يقظة الفجر', desc: 'النهوض بحزم دون تسويف أو رضوخ للكسل' },
  { id: 'تأمل الصمت', desc: 'عشرون دقيقة في مراقبة الأفكار دون إطلاق أحكام' },
  { id: 'جرد المساء', desc: 'محاسبة النفس بدقة عما قيل وفُعل طوال اليوم' },
  { id: 'قراءة أثر', desc: 'مدارسة نص فلسفي أصيل يستنهض العقل' },
  { id: 'صيام الفكر', desc: 'الامتناع عن استهلاك تفاهات وضجيج العالم الرقمي' },
];

export default function DisciplineTracker() {
  const { disciplineLog, toggleDiscipline } = useStore();

  const total = DISCIPLINES.length;
  const completed = DISCIPLINES.filter((d) => disciplineLog[d.id]).length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/20 shadow-[0_15px_35px_rgba(0,0,0,0.6)] relative overflow-hidden" dir="rtl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 className="font-serif text-lg text-[#EAEAEA] font-semibold">ميزان الجرد اليومي</h3>
            <p className="text-[11px] text-[#888888]">الانضباط الصارم مصفاة الإرادة وجوهر السيادة الذاتية</p>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30">
          <Flame size={14} className="text-[#D4AF37]" />
          <span className="text-xs font-bold text-[#D4AF37]">
            {completed} من {total} ({percentage}%)
          </span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-l from-[#AA7C11] to-[#D4AF37] transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-[10px] text-[#888888]">
          <span>بداية المسير</span>
          <span className="text-[#D4AF37] font-serif">
            {percentage === 100 ? 'تم بلوغ السيادة التامة اليوم' : percentage >= 60 ? 'خطى راسخة في درب الانضباط' : 'استنهض عزيمتك وجاهد فتورك'}
          </span>
          <span>كمال الانضباط (100%)</span>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {DISCIPLINES.map((item) => {
          const isDone = !!disciplineLog[item.id];
          return (
            <div
              key={item.id}
              onClick={() => {
                toggleDiscipline(item.id);
                if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                  window.navigator.vibrate(20);
                }
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                isDone
                  ? 'bg-[#D4AF37]/5 border-[#D4AF37]/30 text-[#EAEAEA]'
                  : 'bg-white/[0.02] border-white/5 text-[#888888] hover:bg-white/[0.04] hover:text-[#EAEAEA]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`transition-colors ${isDone ? 'text-[#D4AF37]' : 'text-[#888888]'}`}>
                  {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isDone ? 'text-[#EAEAEA] line-through decoration-[#D4AF37]/50' : 'text-[#EAEAEA]'}`}>
                    {item.id}
                  </h4>
                  <p className="text-[10px] text-[#888888]">{item.desc}</p>
                </div>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-[#888888]">
                {isDone ? 'مُنجز' : 'قيد الاختبار'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

