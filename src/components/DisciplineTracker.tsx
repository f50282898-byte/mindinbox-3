'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { CheckCircle2, Circle, Flame, Award, BarChart3, Plus, X } from 'lucide-react';

interface DisciplineItem {
  id: string;
  text: string;
  isDone: boolean;
}

export default function DisciplineTracker() {
  // We use local state to manage the dynamic list of disciplines
  const [items, setItems] = useState<DisciplineItem[]>([
    { id: '1', text: 'يقظة الفجر: النهوض بحزم دون تسويف', isDone: false },
    { id: '2', text: 'تأمل الصمت: عشرون دقيقة في مراقبة الأفكار', isDone: false },
    { id: '3', text: 'جرد المساء: محاسبة النفس بدقة', isDone: false },
  ]);

  const total = items.length;
  const completed = items.filter((d) => d.isDone).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, isDone: !item.isDone } : item));
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  };

  const updateItemText = (id: string, text: string) => {
    setItems(items.map(item => item.id === id ? { ...item, text } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), text: '', isDone: false }]);
  };

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
            {percentage === 100 && total > 0 ? 'تم بلوغ السيادة التامة اليوم' : percentage >= 60 ? 'خطى راسخة في درب الانضباط' : 'استنهض عزيمتك وجاهد فتورك'}
          </span>
          <span>كمال الانضباط (100%)</span>
        </div>
      </div>

      {/* Dynamic Checklist */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
              item.isDone
                ? 'bg-[#D4AF37]/5 border-[#D4AF37]/30'
                : 'bg-white/[0.02] border-white/5 focus-within:border-[#D4AF37]/40'
            }`}
          >
            <div 
              onClick={() => toggleItem(item.id)}
              className={`cursor-pointer transition-colors ${item.isDone ? 'text-[#D4AF37]' : 'text-[#888888] hover:text-white'}`}
            >
              {item.isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </div>
            
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItemText(item.id, e.target.value)}
              placeholder="اكتب عادة جديدة هنا..."
              className={`flex-1 bg-transparent border-none outline-none text-sm font-serif ${item.isDone ? 'text-[#EAEAEA] line-through decoration-[#D4AF37]/50' : 'text-[#EAEAEA]'}`}
            />

            <button 
              onClick={() => removeItem(item.id)}
              className="text-[#888888] hover:text-red-400 transition-colors p-1"
              title="حذف"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {/* Add Button */}
        <button
          onClick={addItem}
          className="w-full mt-2 py-3 rounded-xl border border-dashed border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors flex items-center justify-center gap-2 font-serif text-sm"
        >
          <Plus size={16} />
          <span>أضف مهمة للسيطرة عليها</span>
        </button>
      </div>
    </div>
  );
}

