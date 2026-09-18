'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, Crown, Brain, Volume2, Mic } from 'lucide-react';
import { useStore, SageTier } from '@/store/useStore';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface Message {
  id: string;
  role: 'user' | 'sage';
  tier: SageTier;
  content: string;
  timestamp: string;
}

const RESPONSES_MATRIX: Record<SageTier, string[]> = {
  standard: [
    "«لا تطلب أن تجري الأمور كما تشتهي، بل اشتهِ أن تجري كما هي كائنة، وحينها ستنال السكينة التي لا تتزعزع.» — إبيكتيتوس.\nإن ما يقلقك اليوم ليس الحدث ذاته، بل حكمك الصادر عليه؛ جرّد الوقائع من ظنونك تتضح لك الحقيقة.",
    "«الصمت في موضع الحيرة حكمة، والكلام بلا بصيرة خيانة للعقل.»\nتأمل في سكونك قبل أن تفيض بالكلمات؛ فما تبحث عنه خارجاً يسكن في أعمق طبقات وعيك المعزول.",
    "«إن لم تكن سيداً على رغباتك، فأنت بالضرورة عبدٌ لما تطلبه.»\nكل رغبة لم تخضع لمحكمة المنطق هي قيدٌ خفي تضعه بيدك حول عنق حريتك.",
  ],
  analytical: [
    "تفكيك المنظومة المعرفية للمسألة:\nأولاً: افتراضك الأساسي يقوم على حتمية خارجية، وهذا استدلال مغالط؛ فالإرادة الداخلية تملك دوماً زاوية استجابة مستقلة.\nثانياً: التحليل الجدلي يُظهر أن ما تظنه عائقاً هو المادة الخام لتشكيل صلابتك النفسية.\nثالثاً: الحل المنطقي يكمن في فرز دائرة التأثير عن دائرة القلق، وحصر طاقتك في المتاح دون الممتنع.",
    "المعاينة المنطقية لما طرحت:\nإنك تخلط بين السبب الغائي والسبب الفاعلي. الألم الذي تعبّر عنه ليس نتيجة حتمية للظرف، بل هو تفسيرك الدلالي له. لنعد بناء المعادلة: إذا عزلنا المؤثر الخارجي، ما الذي يتبقى في وعيك سوى ردة فعلك؟ هاهنا يكمن موطن السيادة الحقيقية.",
  ],
  sovereign: [
    "الرؤية السيادية الاستراتيجية (المستوى الثالث):\nأيها السالك في مدارج الحكمة، اعلم أن الروح التي لا تختبرها النيران تظل هشة كالفخار النيئ. ما تراه اليوم اضطراباً هو في الحقيقة مخاض ولادة لإرادتك العظمى.\n\nالبروتوكول الفلسفي للسيادة:\n١. الحصانة الوجودية: لا تسمح لأي عارض دنيوي أن يمس صميم هيبتك ووقارك الباطني.\n٢. تحويل السم إلى ترياق: كل نكوص خارجي هو وقود لتأكيد استقلالك المطلق عن المظاهر.\n٣. الهدوء الأبدي: كن كالصخرة التي تتكسر عليها الأمواج العاتية، وهي راسية لا تتزحزح ولا يضيرها زبد البحر.",
  ],
};

const getSagePersona = (tier: SageTier) => {
  switch (tier) {
    case 'analytical': return 'Dostoevsky';
    case 'sovereign': return 'Hypatia';
    default: return 'Avicenna';
  }
};

const SageAvatar = ({ tier, size = 20 }: { tier: SageTier; size?: number }) => {
  if (tier === 'analytical') return <Brain size={size} />;
  if (tier === 'sovereign') return <Crown size={size} />;
  return <Bot size={size} />;
};

export default function SageChat() {
  const { sageTier, setSageTier, isPro } = useStore();
  const { speak, isRecording, startRecording, stopRecording } = useAudioEngine();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'sage',
      tier: 'standard',
      content: 'سلامٌ على عقلك الواعي. أنا المستشار الفلسفي، حارس هذا الصندوق ومؤنس خلوتك الفكرية. ألقِ بحمولتك الذهنية ها هنا، ولنتأمّل معاً في جوهر المسألة.',
      timestamp: 'الآن',
    },
  ]);
  const [input, setInput] = useState('');
  const [isContemplating, setIsContemplating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isContemplating]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isContemplating) return;

    const userText = input.trim();
    const currentTier = sageTier;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      tier: currentTier,
      content: userText,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsContemplating(true);

    setTimeout(() => {
      const tierResponses = RESPONSES_MATRIX[currentTier];
      const randomReply = tierResponses[Math.floor(Math.random() * tierResponses.length)];

      const sageReply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'sage',
        tier: currentTier,
        content: randomReply,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, sageReply]);
      setIsContemplating(false);

      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(25);
      }
    }, 2500);
  };

  return (
    <div className="flex flex-col h-[100svh] w-full" dir="rtl">
      
      {/* Tier Selector (Centered near top) */}
      <div className="absolute top-28 inset-x-0 flex justify-center z-40 pointer-events-none px-4">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-card pointer-events-auto shadow-2xl">
          <button
            onClick={() => setSageTier('standard')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              sageTier === 'standard'
                ? 'bg-white/10 text-[#EAEAEA] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[#EAEAEA]'
            }`}
          >
            <Sparkles size={14} className={sageTier === 'standard' ? 'text-[var(--gold-pure)]' : ''} />
            <span className="hidden sm:inline">القياسي</span>
          </button>

          <button
            onClick={() => setSageTier('analytical')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              sageTier === 'analytical'
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[#EAEAEA]'
            }`}
          >
            <Brain size={14} className={sageTier === 'analytical' ? 'text-[#D4AF37]' : ''} />
            <span className="hidden sm:inline">التحليلي</span>
          </button>

          <button
            onClick={() => setSageTier('sovereign')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              sageTier === 'sovereign'
                ? 'bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                : 'text-[var(--gold-pure)]/70 hover:text-[var(--gold-pure)]'
            }`}
          >
            <Crown size={14} />
            <span className="hidden sm:inline">السيادي (Pro)</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll View (Center) */}
      <div className="flex-1 overflow-y-auto pt-44 pb-36 px-4 scrollbar-hide w-full relative z-30">
        <div className="max-w-3xl mx-auto space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] p-6 rounded-3xl relative backdrop-blur-md ${
                    msg.role === 'user'
                      ? 'bg-white/5 border border-white/10 text-[var(--text-primary)] rounded-tr-none'
                      : 'bg-black/40 border border-[var(--gold-border)] text-[var(--text-primary)] shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-tl-none'
                  }`}
                >
                  {msg.role === 'sage' && (
                    <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/5 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-[var(--gold-glow)] flex items-center justify-center text-[var(--gold-pure)] border border-[var(--gold-border)]">
                           <SageAvatar tier={msg.tier} size={12} />
                        </div>
                        <span className="text-[var(--gold-pure)] font-bold font-serif flex items-center gap-1.5 tracking-wide">
                          <Sparkles size={13} />
                          {msg.tier === 'sovereign' ? 'الاستبصار السيادي' : msg.tier === 'analytical' ? 'التحليل المنطقي' : 'الحكمة الرواقية'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => speak(msg.content, getSagePersona(msg.tier))}
                          className="text-[var(--gold-pure)] hover:text-white transition-colors flex items-center gap-1.5"
                          title="إستمع (Re-read)"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="font-serif text-[15px] md:text-[17px] leading-[2.2] whitespace-pre-line text-[var(--text-primary)]">
                    {msg.content}
                  </p>
                  {msg.role === 'user' && (
                    <div className="mt-3 text-left text-[10px] text-[var(--text-secondary)] font-sans">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isContemplating && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex justify-end w-full"
              >
                <div className="p-4 px-6 rounded-full bg-black/40 border border-[var(--gold-border)] backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.1)] flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full border-[2px] border-[var(--gold-pure)] border-t-transparent animate-spin" />
                  <span className="text-sm font-serif text-[var(--gold-pure)] animate-pulse tracking-wide">
                    يتأمل...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area (Absolute Bottom Center) */}
      <div className="fixed bottom-0 inset-x-0 p-4 md:p-8 pointer-events-none z-50">
        <div className="max-w-3xl mx-auto relative pointer-events-auto">
          <form onSubmit={handleSend} className="relative flex items-center bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-2 transition-all focus-within:border-[var(--gold-border)] focus-within:bg-black/40 group">
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isContemplating}
              placeholder={isContemplating ? 'تريّث.. الحكيم يستحضر الجواب..' : 'اطرح معضلتك النفسية هنا...'}
              className="flex-1 bg-transparent px-4 py-3 md:py-4 text-sm md:text-base text-white placeholder-[var(--text-secondary)] outline-none font-serif w-full"
            />
            
            <div className="flex items-center gap-2 pr-2">
              {/* Stealth Mic */}
              <button
                type="button"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? 'opacity-100 bg-[var(--gold-glow)] text-[var(--gold-pure)] scale-110 shadow-[0_0_20px_rgba(212,175,55,0.5)]'
                    : 'opacity-50 text-[var(--text-primary)] hover:opacity-100 hover:bg-white/5'
                }`}
                title="اضغط مطولاً للتسجيل"
              >
                <Mic size={20} strokeWidth={1.5} className={isRecording ? 'animate-pulse' : ''} />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || isContemplating}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--gold-pure)] hover:text-black hover:scale-105 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-[var(--text-primary)] disabled:hover:scale-100 transition-all"
                title="إرسال"
              >
                <Send size={18} className="rotate-180" strokeWidth={1.5} />
              </button>
            </div>
            
          </form>
          <div className="text-center mt-3 hidden md:block">
            <span className="text-[10px] text-[var(--text-secondary)] font-serif tracking-widest">
              الحكمة ليست بديلاً عن العلاج المختص.
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
