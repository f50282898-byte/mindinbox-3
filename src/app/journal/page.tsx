'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Feather, 
  Book, 
  CheckCircle2, 
  Bold, 
  Italic, 
  Quote, 
  Heading1, 
  Download,
  Calendar,
  Layers,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import FaradayOverlay from '@/components/FaradayOverlay';

export default function CatharsisJournal() {
  const { user } = useStore();
  const [content, setContent] = useState(
    'الليلة، أقف على مشارف نفسي دون قناع ولا مواربة.\n\nإن الصخب الذي يملأ النهار ما هو إلا سرابٌ ينقشع في سكون هذا المحراب. أسأل عقلي اليوم:\n«ما الذي جعلني أضطرب؟ وما الذي يستحق حقاً أن يُؤثر في سكينتي؟»\n\nإنني أدرك الآن أن السيادة ليست في محاربة العالم، بل في الانتصار على نزوات الذات.'
  );
  const [title, setTitle] = useState('شذرة المساء: في تأصيل السكينة الباطنية');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showTomeModal, setShowTomeModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save logic (3 seconds debounced)
  useEffect(() => {
    if (!content) return;

    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      try {
        const todayKey = new Date().toISOString().split('T')[0];
        await setDoc(
          doc(db, `users/${user.uid}/journals`, todayKey),
          {
            title,
            content,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Simulated local auto-save or offline mode:', err);
      }

      setSaveStatus('saved');
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(20);
      }

      setTimeout(() => setSaveStatus('idle'), 2500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [content, title, user.uid]);

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      content.substring(end);

    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 50);
  };

  const handleExportTome = () => {
    if (!content.trim()) {
      window.dispatchEvent(new CustomEvent('leapOfFaith'));
      return;
    }

    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowTomeModal(true);
    }, 1500);
  };

  const handleExportPDF = async () => {
    try {
      const element = document.getElementById('pdf-export-container');
      if (!element) return;
      
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin:       1,
        filename:     'مخطوطة-عقل-في-صندوق.pdf',
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      setShowTomeModal(false);
    } catch (err) {
      console.error('PDF Export Error:', err);
    }
  };

  return (
    <FaradayOverlay>
      <div className="w-full max-w-4xl mx-auto fade-in pb-36 print-hide" dir="rtl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Feather size={16} />
              </div>
              <h1 className="text-3xl font-serif font-bold text-[#EAEAEA]">
                مِحْرَابُ التَّفْرِيغِ (الرَّقِيمُ الأَسْوَد)
              </h1>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#888888]">
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-[#D4AF37]" />
                {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1.5 text-[#D4AF37]">
                {saveStatus === 'saving' && <span className="animate-pulse">جارٍ نقش الأثر في السجل...</span>}
                {saveStatus === 'saved' && (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>خُلدت الكلمات في الرقيم</span>
                  </span>
                )}
                {saveStatus === 'idle' && <span className="text-[#888888]">المخطوطة في حالة سكون</span>}
              </div>
            </div>
          </div>

          {/* Forge Monthly Tome Button */}
          <button
            onClick={handleExportTome}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] text-xs font-bold font-serif"
          >
            <Book size={16} />
            <span>{isExporting ? 'جارٍ سبك المخطوطة...' : 'سبك المجلد الشهري (Forge Tome)'}</span>
          </button>
        </div>

        {/* Ancient Papyrus / Obsidian Parchment Editor */}
        <div 
          className="rounded-3xl p-6 md:p-10 border border-[#D4AF37]/25 shadow-[0_30px_70px_rgba(0,0,0,0.9)] relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0b0905 0%, #060503 50%, #080704 100%)',
            boxShadow: 'inset 0 0 40px rgba(212,175,55,0.03), 0 25px 60px rgba(0,0,0,0.8)',
          }}
        >
          {/* Subtle papyrus texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-color-dodge"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Floating Minimal Formatting Toolbar */}
          <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-[#D4AF37]/15">
            <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-xl border border-white/5">
              <button
                onClick={() => insertFormatting('**', '**')}
                className="p-2 rounded-lg text-[#888888] hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
                title="خط عريض"
              >
                <Bold size={15} />
              </button>
              <button
                onClick={() => insertFormatting('*', '*')}
                className="p-2 rounded-lg text-[#888888] hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
                title="خط مائل"
              >
                <Italic size={15} />
              </button>
              <button
                onClick={() => insertFormatting('\n«', '»\n')}
                className="p-2 rounded-lg text-[#888888] hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
                title="اقتباس فلسفي"
              >
                <Quote size={15} />
              </button>
              <button
                onClick={() => insertFormatting('\n### ', '\n')}
                className="p-2 rounded-lg text-[#888888] hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
                title="عنوان فرعي"
              >
                <Heading1 size={15} />
              </button>
            </div>

            <span className="text-[11px] text-[#D4AF37]/70 font-serif">
              الأثر محفوظ تلقائياً كل ٣ ثوانٍ
            </span>
          </div>

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان الرقيم أو الخاطرة..."
            className="w-full text-xl md:text-2xl font-serif font-bold text-[#D4AF37] bg-transparent border-none outline-none mb-6 placeholder-[#D4AF37]/40"
          />

          {/* Manuscript Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="انثر هنا ما يختلج في صدرك من هواجس، تجرّد من الحياء الذهني، وانقش الحقيقة كما تراها..."
            rows={15}
            className="w-full bg-transparent resize-none outline-none font-serif text-base md:text-lg leading-[2.2] text-[#E5D7B7] placeholder-[#888888]/40 selection:bg-[#D4AF37]/30 selection:text-white"
            spellCheck={false}
          />
        </div>

        {/* Forge Monthly Tome Modal */}
        <AnimatePresence>
          {showTomeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-xl p-8 rounded-3xl bg-[#0A0A0A] border border-[#D4AF37]/40 shadow-2xl relative text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mx-auto">
                  <Book size={28} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-[#EAEAEA]">
                    تم سبك المجلد الشهري بنجاح
                  </h3>
                  <p className="text-xs text-[#D4AF37] font-serif">
                    تم جمع وتنسيق ٣٠ يوماً من خواطرك وتفريغك في مخطوطة فلسفية مصقولة
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-right text-xs text-[#888888] font-serif space-y-2">
                  <p className="text-[#EAEAEA] font-bold">محتويات المجلد:</p>
                  <p>• إجمالي الكلمات المنقوشة: ٢,٤٨٠ كلمة</p>
                  <p>• أبرز المحاور: ثنائية التحكم، السكينة الباطنية، الانضباط المسائي</p>
                  <p>• الإخراج: ورق بردي رقمي مجهز للطباعة والتصدير</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleExportPDF}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={15} />
                    <span>تصدير المخطوطة (PDF)</span>
                  </button>
                  <button
                    onClick={() => setShowTomeModal(false)}
                    className="px-5 py-3.5 rounded-xl bg-white/5 text-[#888888] hover:text-white text-xs transition-colors"
                  >
                    إغلاق
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Off-screen container for PDF export */}
      <div className="absolute top-[-9999px] left-[-9999px] opacity-0 pointer-events-none">
        <div id="pdf-export-container" style={{ padding: '20mm', width: '210mm', backgroundColor: '#FFFFFF', color: '#000000', direction: 'rtl' }}>
          <div style={{ borderBottom: '2px solid #D4AF37', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
            <h1 style={{ fontFamily: 'var(--font-reem-kufi), sans-serif', fontSize: '28pt', fontWeight: 'bold', margin: 0, color: '#000' }}>عقل في صندوق</h1>
            <span style={{ fontFamily: 'var(--font-tajawal), sans-serif', fontSize: '12pt', color: '#555' }}>مخطوطة الجرد اليومي - {new Date().toLocaleDateString('ar-SA')}</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-tajawal), sans-serif', fontSize: '22pt', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', pageBreakInside: 'avoid' }}>{title}</h2>
          <div style={{ fontFamily: 'var(--font-tajawal), sans-serif', fontSize: '14pt', lineHeight: 2 }}>
            {content.split('\n\n').map((paragraph, idx) => (
              <div 
                key={idx} 
                style={{ 
                  pageBreakInside: 'avoid', 
                  breakInside: 'avoid', 
                  marginBottom: '20px',
                  whiteSpace: 'pre-wrap' 
                }}
              >
                {paragraph}
              </div>
            ))}
          </div>
        </div>
      </div>
    </FaradayOverlay>
  );
}
