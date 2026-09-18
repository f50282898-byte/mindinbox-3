'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, Crown, Shield, Brain, Volume2, Fingerprint } from 'lucide-react';
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
    "التشريح البنيوي للفكرة:\nثمة تناقض داخلي في هذا المنطق: تطلب السكينة بينما تمنح مفاتيح استقرارك لتقلبات العالم السفلي. البناء المتماسك يتطلب أولاً تفكيك هذه التبعية النفسية، ثم تأسيس ركائز استدلالية لا تهتز بنوازل الأيام.",
  ],
  sovereign: [
    "الرؤية السيادية الاستراتيجية (المستوى الثالث):\nأيها السالك في مدارج الحكمة، اعلم أن الروح التي لا تختبرها النيران تظل هشة كالفخار النيئ. ما تراه اليوم اضطراباً هو في الحقيقة مخاض ولادة لإرادتك العظمى.\n\nالبروتوكول الفلسفي للسيادة:\n١. الحصانة الوجودية: لا تسمح لأي عارض دنيوي أن يمس صميم هيبتك ووقارك الباطني.\n٢. تحويل السم إلى ترياق: كل نكوص خارجي هو وقود لتأكيد استقلالك المطلق عن المظاهر.\n٣. الهدوء الأبدي: كن كالصخرة التي تتكسر عليها الأمواج العاتية، وهي راسية لا تتزحزح ولا يضيرها زبد البحر.",
    "من محراب الاستبصار السيادي:\nإنك لم تُخلق لتكون صدى لأصوات الرعاع، ولا لتتلوى مع كل ريح تعصف بساحتك. السيادة ليست شعاراً، بل هي قرار صارم بقطع كل حبال الاستجداء العاطفي والفكري.\nأنت الحاكم في مملكة عقلك؛ فإن استسلمت، لم يكن ذلك لغلبة العدو، بل لتنازلك الطوعي عن العرش. استرد صولجانك الآن.",
  ],
};

const getSagePersona = (tier: SageTier) => {
  switch (tier) {
    case 'analytical':
      return 'Dostoevsky';
    case 'sovereign':
      return 'Hypatia';
    default:
      return 'Avicenna';
  }
};

const SageAvatar = ({ tier, size = 20 }: { tier: SageTier; size?: number }) => {
  if (tier === 'analytical') return <Brain size={size} />;
  if (tier === 'sovereign') return <Crown size={size} />;
  return <Bot size={size} />;
};

export default function SageChat() {
  const { sageTier, setSageTier, isPro } = useStore();
  const { speak } = useAudioEngine();
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

    // Artificial Latency: Exactly 2500ms delay with pulsing gold contemplation indicator
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
    <div className="w-full rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden relative" dir="rtl">
      {/* Top Header & Tier Selector */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#050505]/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <SageAvatar tier={sageTier} size={20} />
          </div>
          <div>
            <h3 className="font-serif text-lg text-[#EAEAEA] font-semibold flex items-center gap-2">
              {sageTier === 'sovereign' ? 'السيّد الأعظم' : sageTier === 'analytical' ? 'العقل التحليلي' : 'المستشار الفلسفي الذكي'}
            </h3>
            <p className="text-[11px] text-[#888888]">حكمة خالدة، ونقد منطقي صارم في محراب الخلوة</p>
          </div>
        </div>

        {/* 3-Tier Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
          <button
            onClick={() => setSageTier('standard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              sageTier === 'standard'
                ? 'bg-white/15 text-[#EAEAEA] shadow-sm'
                : 'text-[#888888] hover:text-[#EAEAEA]'
            }`}
          >
            <Sparkles size={12} className={sageTier === 'standard' ? 'text-[#D4AF37]' : ''} />
            <span>القياسي (حكم)</span>
          </button>

          <button
            onClick={() => setSageTier('analytical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              sageTier === 'analytical'
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm'
                : 'text-[#888888] hover:text-[#EAEAEA]'
            }`}
          >
            <Brain size={12} className={sageTier === 'analytical' ? 'text-[#D4AF37]' : ''} />
            <span>التحليلي (تفكيك)</span>
          </button>

          <button
            onClick={() => {
              if (!isPro) {
                setSageTier('sovereign');
              } else {
                setSageTier('sovereign');
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              sageTier === 'sovereign'
                ? 'bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-[#D4AF37]/70 hover:text-[#D4AF37]'
            }`}
          >
            <Crown size={12} />
            <span>السيادي (Pro)</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="p-6 md:p-8 space-y-6 max-h-[460px] overflow-y-auto scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex w-full ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] p-5 rounded-2xl relative ${
                  msg.role === 'user'
                    ? 'bg-white/5 border border-white/10 text-[#EAEAEA] rounded-tr-none'
                    : 'bg-[#050505] border border-[#D4AF37]/25 text-[#EAEAEA] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] rounded-tl-none'
                }`}
              >
                {msg.role === 'sage' && (
                  <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-white/5 text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                         <SageAvatar tier={msg.tier} size={10} />
                      </div>
                      <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                        <Sparkles size={11} />
                        {msg.tier === 'sovereign' ? 'الاستبصار السيادي الأعمق' : msg.tier === 'analytical' ? 'التحليل المنطقي الصارم' : 'الحكمة الرواقية القياسية'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => speak(msg.content, getSagePersona(msg.tier))}
                        className="text-[#D4AF37] hover:text-[#EAEAEA] transition-colors flex items-center gap-1"
                        title="إستمع (Re-read)"
                      >
                        <Volume2 size={12} />
                        <span>استمع</span>
                      </button>
                      <span className="text-[#888888]">{msg.timestamp}</span>
                    </div>
                  </div>
                )}
                <p className="font-serif text-sm md:text-[15px] leading-[2] whitespace-pre-line text-[#EAEAEA]">
                  {msg.content}
                </p>
                {msg.role === 'user' && (
                  <div className="mt-2 text-left text-[9px] text-[#888888]">
                    {msg.timestamp}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Artificial Latency Pulsing Indicator */}
          {isContemplating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex justify-end w-full"
            >
              <div className="p-5 rounded-2xl bg-[#050505] border border-[#D4AF37]/40 shadow-[0_0_25px_rgba(212,175,55,0.15)] flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
                <span className="text-xs font-serif text-[#D4AF37] animate-pulse">
                  الحكيم يتأمل في عمق فكرتك وسياقها الوجودي...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-[#030303] border-t border-white/5">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isContemplating}
            placeholder={isContemplating ? 'تريّث.. الحكيم يستحضر الجواب..' : 'اطرح تساؤلك أو معضلتك النفسية على مسامع الحكيم...'}
            className="w-full px-5 py-4 pl-14 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm text-[#EAEAEA] placeholder-[#888888] focus:outline-none focus:border-[#D4AF37]/60 transition-all font-serif"
          />
          <button
            type="submit"
            disabled={!input.trim() || isContemplating}
            className="absolute left-2.5 p-2.5 rounded-lg bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)]"
            title="إرسال"
          >
            <Send size={16} className="rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
}
