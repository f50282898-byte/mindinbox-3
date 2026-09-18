'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Volume2, Mic, StopCircle } from 'lucide-react';
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
  let src = '/avatars/avicenna.jpg';
  if (tier === 'analytical') src = '/avatars/dostoevsky.jpg';
  if (tier === 'sovereign') src = '/avatars/hypatia.jpg';
  
  return (
    <div style={{ width: size, height: size }} className="rounded-full overflow-hidden bg-black flex items-center justify-center shrink-0">
      <img 
        src={src} 
        alt="Sage Avatar" 
        className="w-full h-full object-cover opacity-80"
        onError={(e) => {
          // Fallback if images don't exist yet
          (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23111'/%3E%3Ccircle cx='50' cy='50' r='30' fill='%23222'/%3E%3C/svg%3E`;
        }}
      />
    </div>
  );
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
      <div className="absolute top-24 md:top-28 inset-x-0 flex justify-center z-40 pointer-events-none px-4">
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[var(--glass-border)] pointer-events-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => setSageTier('standard')}
            className={`px-4 py-2 rounded-full text-xs font-serif transition-all flex items-center gap-2 ${
              sageTier === 'standard'
                ? 'bg-white/10 text-[#EAEAEA] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[#EAEAEA]'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${sageTier === 'standard' ? 'bg-[var(--gold-pure)] shadow-[0_0_8px_var(--gold-pure)]' : 'bg-transparent'}`} />
            <span className="hidden sm:inline">القياسي</span>
          </button>

          <button
            onClick={() => setSageTier('analytical')}
            className={`px-4 py-2 rounded-full text-xs font-serif transition-all flex items-center gap-2 ${
              sageTier === 'analytical'
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[#EAEAEA]'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${sageTier === 'analytical' ? 'bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]' : 'bg-transparent'}`} />
            <span className="hidden sm:inline">التحليلي</span>
          </button>

          <button
            onClick={() => setSageTier('sovereign')}
            className={`px-4 py-2 rounded-full text-xs font-serif transition-all flex items-center gap-2 ${
              sageTier === 'sovereign'
                ? 'bg-gradient-to-r from-[#AA7C11]/20 to-[#D4AF37]/20 text-[var(--gold-pure)] border border-[var(--gold-border)] font-bold shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                : 'text-[var(--gold-pure)]/60 hover:text-[var(--gold-pure)]'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${sageTier === 'sovereign' ? 'bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]' : 'bg-transparent'}`} />
            <span className="hidden sm:inline">السيادي (Pro)</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll View (Center) */}
      <div className="flex-1 overflow-y-auto pt-40 pb-36 px-4 scrollbar-hide w-full relative z-30">
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
                  className={`max-w-[85%] md:max-w-[80%] p-6 md:p-8 rounded-[2rem] relative backdrop-blur-xl ${
                    msg.role === 'user'
                      ? 'bg-white/5 border border-white/5 text-[var(--text-primary)] rounded-tr-sm'
                      : 'bg-black/30 border border-[var(--gold-border)] text-[var(--text-primary)] shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'sage' && (
                    <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5 text-xs">
                      <div className="flex items-center gap-3">
                        <SageAvatar tier={msg.tier} size={28} />
                        <span className="text-[var(--gold-pure)] font-bold font-serif flex items-center gap-2 tracking-wide">
                          {msg.tier === 'sovereign' ? 'الاستبصار السيادي' : msg.tier === 'analytical' ? 'التحليل المنطقي' : 'الحكمة الرواقية'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => speak(msg.content, getSagePersona(msg.tier))}
                          className="text-[var(--gold-pure)]/70 hover:text-[var(--gold-pure)] transition-colors flex items-center gap-1.5 p-2 rounded-full hover:bg-[var(--gold-glow)]"
                          title="إستمع"
                        >
                          <Volume2 size={16} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="font-serif text-[15px] md:text-lg leading-[2.2] whitespace-pre-line text-[var(--text-primary)]">
                    {msg.content}
                  </p>
                  {msg.role === 'user' && (
                    <div className="mt-4 text-left text-[10px] text-[var(--text-secondary)] font-sans">
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
                <div className="p-4 px-6 rounded-full bg-black/30 border border-[var(--gold-border)] backdrop-blur-xl shadow-[0_0_30px_rgba(212,175,55,0.05)] flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-pure)] shadow-[0_0_8px_var(--gold-pure)] animate-pulse" />
                  <span className="text-sm font-serif text-[var(--gold-pure)] tracking-wide opacity-80">
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
        
        {/* Subtle Radial Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-[var(--gold-pure)] opacity-[0.03] blur-3xl pointer-events-none rounded-t-[100%]" />

        <div className="max-w-3xl mx-auto relative pointer-events-auto">
          <form onSubmit={handleSend} className="relative flex items-center bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-2 transition-all focus-within:border-[var(--gold-border)] group">
            
            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.div 
                  key="recording"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center gap-4 px-4 w-full h-12"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)] shrink-0" />
                  <span className="text-sm font-serif text-white whitespace-nowrap">جارٍ الاستماع...</span>
                  
                  {/* Fake Audio Waveform */}
                  <div className="flex-1 flex items-center gap-1 justify-center overflow-hidden opacity-50 px-4">
                     {[...Array(15)].map((_, i) => (
                       <motion.div
                         key={i}
                         animate={{ height: ['20%', '80%', '20%'] }}
                         transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }}
                         className="w-1 bg-[var(--gold-pure)] rounded-full"
                         style={{ height: '4px' }}
                       />
                     ))}
                  </div>

                  <button
                    type="button"
                    onClick={stopRecording}
                    className="w-10 h-10 shrink-0 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all"
                  >
                    <StopCircle size={20} strokeWidth={1.5} />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center w-full"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isContemplating}
                    placeholder={isContemplating ? 'تريّث.. الحكيم يستحضر الجواب..' : 'اطرح معضلتك النفسية هنا...'}
                    className="flex-1 bg-transparent px-6 py-3 md:py-4 text-sm md:text-base text-white placeholder-[var(--text-secondary)] outline-none font-serif w-full"
                  />
                  
                  <div className="flex items-center gap-2 pr-2">
                    {/* Stealth Mic */}
                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 opacity-50 text-[var(--text-primary)] hover:opacity-100 hover:bg-white/5"
                      title="تحدث"
                    >
                      <Mic size={20} strokeWidth={1.5} />
                    </button>

                    <button
                      type="submit"
                      disabled={!input.trim() || isContemplating}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--gold-pure)] hover:text-black hover:scale-105 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--text-primary)] disabled:hover:scale-100 transition-all"
                      title="إرسال"
                    >
                      <Send size={18} className="rotate-180" strokeWidth={1.5} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          
          <div className="text-center mt-4 hidden md:block">
            <span className="text-[10px] text-[var(--text-secondary)] font-serif tracking-widest uppercase opacity-70">
              Mind in Box — The Digital Sanctuary
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
