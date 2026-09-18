'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  
  User,
  Send,
  X,
  Bot,
  Search,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import { useVideoTheme } from '@/components/VideoBackground';

/* ══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */
interface PhilosophicalEntity {
  id: number;
  author: string;
  school: string;
  schoolKey: 'stoic' | 'islamic' | 'existential' | 'eastern';
  quote: string;
  concept: string;
  personaPrompt: string;
}

interface PhilosopherRaw {
  author: string;
  avatar: string;
  school: string;
  schoolKey: 'stoic' | 'islamic' | 'existential' | 'eastern';
  concepts: string[];
  quoteTemplates: string[];
  personaPrompt: string;
  dilemma: string; // shown in Daily Sage hero + read aloud by TTS
  inquiries: string[];
}

/* ══════════════════════════════════════════════════════════
   PHILOSOPHERS POOL
══════════════════════════════════════════════════════════ */
const PHILOSOPHERS_POOL: PhilosopherRaw[] = [
  {
    author: 'ماركوس أوريليوس',
    avatar: '/avatars/marcus.jpg',
    school: 'الرواقية الإمبراطورية',
    schoolKey: 'stoic',
    concepts: ['قدسية العقل المدبر', 'حتمية الزوال', 'الانسجام مع الطبيعة'],
    quoteTemplates: ['تخلَّ عن حكمك على الأمور يتلاشى الألم؛ ارفض القول «لقد لُحِق بي الأذى»، وسينعدم الأذى نفسه.'],
    personaPrompt: 'أنت الإمبراطور الفيلسوف ماركوس أوريليوس.',
    dilemma: 'أيها الزائر، قف لحظة وانظر إلى ما يشغل بالك اليوم. هل هو مما تملك تغييره، أم مما رسمه القدر بقلمٍ لا يُمحى؟ الإمبراطور يسألك: أين تضع طاقتك، في ما بيدك، أم في ما أبعد من سلطانك؟',
    inquiries: ['كيف أطبق هذا العزل على قلقي اليوم؟', 'هل الخضوع للقدر يعني الاستسلام التام؟', 'كيف أتحكم في ردود أفعالي الغاضبة؟']
  },
  {
    author: 'سينيكا',
    avatar: '/avatars/seneca.jpg',
    school: 'الرواقية الرومانية',
    schoolKey: 'stoic',
    concepts: ['قصر الحياة وتضييع الوقت', 'ترويض الغضب والشهوة'],
    quoteTemplates: ['نحن نتألم في الخيال أضعاف ما نتألم في الواقع.'],
    personaPrompt: 'أنت الفيلسوف سينيكا.',
    dilemma: 'سينيكا يرمقك بعيني الحكيم الذي رأى كثيرين يبددون أعمارهم على أشياء لا تستحق. كم لحظة قضيتها اليوم في خوف من شيء لم يقع؟',
    inquiries: ['كيف أوقف خيالي عن اصطناع مخاوف وهمية؟', 'ما هي الطريقة العملية لتقدير وقتي المهدر؟', 'كيف أستعد للأسوأ دون أن أعيشه مبكراً؟']
  },
  {
    author: 'أبو حامد الغزالي',
    avatar: '/avatars/alghazali.jpg',
    school: 'الفلسفة والتصوف الإسلامي',
    schoolKey: 'islamic',
    concepts: ['تهافت الفلاسفة والشك المنهجي', 'كيمياء السعادة'],
    quoteTemplates: ['من لم يشك لم ينظر، ومن لم ينظر لم يبصر.'],
    personaPrompt: 'أنت الإمام حجة الإسلام أبو حامد الغزالي.',
    dilemma: 'الغزالي يسألك: كم من يقين تحمله اليوم لم تمحّصه بالشك الحقيقي؟ إن مرآة القلب تصدأ بصدأ العادة والتقليد.',
    inquiries: ['كيف أفرق بين الشك المهلك والشك البنّاء؟', 'كيف أزيل صدأ العادة عن قلبي المشتت؟', 'ما هي الخطوة الأولى نحو اليقين الداخلي؟']
  },
  {
    author: 'ابن رشد (أفيروس)',
    avatar: '/avatars/ibnrushd.jpg',
    school: 'المشائية العقلانية الإسلامية',
    schoolKey: 'islamic',
    concepts: ['فصل المقال بين الحكمة والشريعة', 'قداسة النظر العقلي'],
    quoteTemplates: ['الحق لا يضاد الحق، بل يوافقه ويشهد له.'],
    personaPrompt: 'أنت القاضي والفيلسوف ابن رشد.',
    dilemma: 'ابن رشد يرفع إليك صحيفة البرهان: هل أنت ممن يؤمن لأن الدليل أقنعه، أم ممن يبحث عن أدلة تُقنع غيره بما سبق أن آمن به؟',
    inquiries: ['كيف أجرّد عقلي من العاطفة عند اتخاذ قرار حاسم؟', 'كيف أوفق بين ما أريده وما يفرضه علي الواقع البرهاني؟', 'متى يصبح التفكير الزائد عبئاً لا دليلاً؟']
  },
  {
    author: 'ابن سينا (الشيخ الرئيس)',
    avatar: '/avatars/avicenna.jpg',
    school: 'الحكمة الإشراقية والمشائية',
    schoolKey: 'islamic',
    concepts: ['برهان الصديقين', 'النفس الناطقة وتجردها'],
    quoteTemplates: ['الوهم نصف الداء، والاطمئنان نصف الدواء.'],
    personaPrompt: 'أنت الشيخ الرئيس ابن سينا.',
    dilemma: 'ابن سينا يضع يده على جبهتك الفكرية: ما الوهم الذي يُعشّش في عقلك ويصنع من ألمك أضعاف ما هو في الحقيقة؟ الطبيب الفيلسوف يعلم أن نصف العلاج هو في تسمية الداء بدقة.',
    inquiries: ['كيف أكتشف الوهم الذي يضخم معاناتي الحالية؟', 'كيف أستعيد طمأنينتي وسط ضغوط العمل؟', 'كيف أعالج التشويش الذهني المستمر؟']
  },
  {
    author: 'فريدريك نيتشه',
    avatar: '/avatars/nietzsche.jpg',
    school: 'الوجودية الصارمة',
    schoolKey: 'existential',
    concepts: ['إرادة القوة', 'الإنسان الأعلى'],
    quoteTemplates: ['من يملك في الحياة «لماذا» يعيش لأجلها، يستطيع أن يحتمل في سبيلها أي «كيف».'],
    personaPrompt: 'أنت فريدريك نيتشه.',
    dilemma: 'نيتشه يصرخ من أعماق الفلسفة: هل تعيش لأجل شيء، أم تعيش لأن الحياة وجدتك ولم تجد لها رافضاً؟ ما هو الشعلة التي تحرقك من الداخل؟',
    inquiries: ['كيف أجد «الـ لماذا» الخاصة بي اليوم؟', 'هل يجب أن أتخلى عن الراحة لأحقق غايتي؟', 'كيف أصمد أمام الفراغ الوجودي؟']
  },
  {
    author: 'ألبير كامو',
    avatar: '/avatars/camus.jpg',
    school: 'الفلسفة العبثية والتمرد',
    schoolKey: 'existential',
    concepts: ['أسطورة سيزيف', 'الإنسان المتمرد'],
    quoteTemplates: ['في عمق الشتاء، أدركتُ أخيراً أن في داخلي صيفاً لا يقهر ولا ينكسر.'],
    personaPrompt: 'أنت الفيلسوف الوجودي ألبير كامو.',
    dilemma: 'كامو يجلس إلى جانبك في صمت الليل: العالم لا يعدك بمعنى، والكون أصم لا يسمع أسئلتك. كيف ستصنع معنى يخصك وحدك في خضم هذا الصمت الكوني؟',
    inquiries: ['كيف أستمر في المحاولة رغم العبث المتكرر؟', 'كيف أجد الصيف الداخلي وأنا مثقل بالضغوط؟', 'كيف أجعل تمردي إيجابياً وبناءً؟']
  },
  {
    author: 'لاوتسو (داو دي جينغ)',
    avatar: '/avatars/laotzu.jpg',
    school: 'الفلسفة الشرقية (الداوية)',
    schoolKey: 'eastern',
    concepts: ['اللا-فعل الفعال', 'مرونة الماء الخارقة'],
    quoteTemplates: ['الماء هو ألين الأشياء، ومع ذلك فهو يفتت أصلب الصخور.'],
    personaPrompt: 'أنت الحكيم لاوتسو.',
    dilemma: 'لاوتسو يصمت ويبتسم: ما الذي تقاومه الآن بقوة؟ الماء لا يحارب الصخر، بل يلتفّ حوله ببطء حتى يخترقه. هل مشكلتك تستحق صراعاً مباشراً؟',
    inquiries: ['كيف أتعلم التفويض وترك السيطرة المطلقة؟', 'متى يكون الانسحاب أو التدفق أقوى من الهجوم؟', 'كيف أتخلص من التصلب في مواقفي؟']
  }
];

/* ══════════════════════════════════════════════════════════
   SEED HELPER  (deterministic pseudo-random from a string)
══════════════════════════════════════════════════════════ */
function makePRNG(seed: string) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = (s << 5) - s + seed.charCodeAt(i);
    s |= 0;
  }
  return (offset: number) => {
    const x = Math.sin(s + offset) * 10000;
    return x - Math.floor(x);
  };
}

/* ══════════════════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════════════════ */
export default function UtopianCity() {
  const { setTheme } = useVideoTheme();

  /* ── Video Theme ── */
  useEffect(() => {
    setTheme({ src: '/videos/utopian.mp4', overlayOpacity: 0.5 });
    return () => setTheme({});
  }, [setTheme]);

  /* ── Date-seeded daily sage & quotes ── */
  const todayStr = typeof window !== 'undefined' ? new Date().toDateString() : 'MindInBoxDailySeed';
  const prng = useMemo(() => makePRNG(todayStr), [todayStr]);

  const dailySage = useMemo(() => {
    const idx = Math.floor(prng(0) * PHILOSOPHERS_POOL.length);
    return PHILOSOPHERS_POOL[idx];
  }, [prng]);

  // The dilemma text stored in a const so TTS can reference it
  const DAILY_DILEMMA_TEXT: string = dailySage.dilemma;

  const dailyQuotes = useMemo<PhilosophicalEntity[]>(() => {
    const generated: PhilosophicalEntity[] = [];
    for (let i = 0; i < 100; i++) {
      const pIdx = Math.floor(prng(i * 3 + 1) * PHILOSOPHERS_POOL.length);
      const p = PHILOSOPHERS_POOL[pIdx];
      const qIdx = Math.floor(prng(i * 7 + 2) * p.quoteTemplates.length);
      const cIdx = Math.floor(prng(i * 11 + 3) * p.concepts.length);
      generated.push({
        id: i + 1,
        author: p.author,
        school: p.school,
        schoolKey: p.schoolKey,
        quote: p.quoteTemplates[qIdx],
        concept: p.concepts[cIdx],
        personaPrompt: p.personaPrompt,
      });
    }
    return generated;
  }, [prng]);

  /* ── Filters ── */
  const [filterSchool, setFilterSchool] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuotes = useMemo(() => {
    return dailyQuotes.filter((item) => {
      const matchesSchool = filterSchool === 'all' || item.schoolKey === filterSchool;
      const matchesSearch =
        item.author.includes(searchQuery) ||
        item.quote.includes(searchQuery) ||
        item.concept.includes(searchQuery) ||
        item.school.includes(searchQuery);
      return matchesSchool && matchesSearch;
    });
  }, [dailyQuotes, filterSchool, searchQuery]);

  /* ── TTS ── */
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speakDilemma = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(DAILY_DILEMMA_TEXT);
    utt.lang = 'ar-SA';
    utt.rate = 0.85;
    utt.pitch = 0.9;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  const stopSpeaking = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Auto-play on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      speakDilemma();
    }, 800);
    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Persona Chat Modal ── */
  const [selectedEntity, setSelectedEntity] = useState<PhilosophicalEntity | null>(null);
  const [personaChatInput, setPersonaChatInput] = useState('');
  const [isPersonaThinking, setIsPersonaThinking] = useState(false);
  const [personaConversation, setPersonaConversation] = useState<Array<{ role: 'user' | 'sage'; text: string }>>([]);

  const handleOpenPersonaChat = (item: PhilosophicalEntity) => {
    setSelectedEntity(item);
    setPersonaConversation([
      {
        role: 'sage',
        text: `أنا ${item.author}. وقفتَ عند فكرتي القائلة: «${item.quote}». بمَ يضطرب وعيك حيال هذا المفهوم؟ سلني وسأجيبك من صميم رؤيتي الفلسفية.`,
      },
    ]);
  };

  const handleInquiryClick = (inquiry: string) => {
    // Create a fake entity for the Daily Sage
    const entity: PhilosophicalEntity = {
      id: 0,
      author: dailySage.author,
      school: dailySage.school,
      schoolKey: dailySage.schoolKey,
      quote: dailySage.dilemma,
      concept: dailySage.concepts[0],
      personaPrompt: dailySage.personaPrompt
    };
    setSelectedEntity(entity);
    setPersonaConversation([
      {
        role: 'sage',
        text: `أنا ${dailySage.author}. طرحت عليك هذه المعضلة: «${dailySage.dilemma}»\nوها أنت تسأل: ${inquiry}`,
      },
      {
        role: 'user',
        text: inquiry,
      }
    ]);
    
    // Simulate AI thinking for the inquiry
    setIsPersonaThinking(true);
    setTimeout(() => {
      let reply = '';
      if (dailySage.schoolKey === 'stoic') reply = `«${dailySage.author} يجيب بحزم»: ما سألت عنه يمس جوهر سيطرتك على ذاتك. تخل عن وهم التحكم في الخارج، وركز على ما يدور في عقلك الآن.`;
      else if (dailySage.schoolKey === 'islamic') reply = `«${dailySage.author} يجيب بحكمة»: سؤالك يدل على بحثك عن اليقين. اليقين لا يأتي من الخارج بل من تصفية باطنك والشك في المسلمات.`;
      else if (dailySage.schoolKey === 'existential') reply = `«${dailySage.author} يجيب بتمرد»: أليست هذه هي العبثية بعينها؟ لا تبحث عن أعذار، اصنع المعنى الذي تريده بقرارك الصارم.`;
      else reply = `«${dailySage.author} يجيب بهدوء»: لا تقاوم هذا القلق. دعه يتدفق كالنهر وسرعان ما يتلاشى في بحر السكينة.`;
      
      setPersonaConversation((prev) => [...prev, { role: 'sage', text: reply }]);
      setIsPersonaThinking(false);
    }, 2000);
  };

  const handleSendToPersona = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personaChatInput.trim() || isPersonaThinking || !selectedEntity) return;

    const userText = personaChatInput.trim();
    setPersonaConversation((prev) => [...prev, { role: 'user', text: userText }]);
    setPersonaChatInput('');
    setIsPersonaThinking(true);

    setTimeout(() => {
      let reply = '';
      if (selectedEntity.schoolKey === 'stoic') {
        reply = `«${selectedEntity.author} يرمقك بصرامة رواقية»: تأمل في هذا الذي أثقل فؤادك.. هل يقع ضمن سلطان إرادتك أم خارجها؟ إن كان خارجها فدعه للأقدار ولا تلوث نقاء عقلك بالتحسر. ارجع إلى حصنك الباطني.`;
      } else if (selectedEntity.schoolKey === 'islamic') {
        reply = `«${selectedEntity.author} يخاطبك بنور الاستبصار البرهاني»: إن الحيرة التي تجدها ليست نقصاً في المعطيات، بل هي غبش في مرآة النفس. زن المسألة بميزان العقل واليقين، واعلم أن السكينة ثمرة المعرفة لا ثمرة التمني.`;
      } else if (selectedEntity.schoolKey === 'existential') {
        reply = `«${selectedEntity.author} يتحدى جمودك بحرارة الوجودية»: لا تبحث عن أعذار لضعفك في نواميس الكون! أنت الحرية ذاتها، وأنت المسؤول الأوحد عن صياغة معنى لحياتك. قف شامخاً واصنع قدرك بإرادتك الصرفة.`;
      } else {
        reply = `«${selectedEntity.author} يبتسم بوداعة الداو الكوني»: ما تقاومه يشتد، وما تتقبله بسكون يذوب كما يذوب الجليد في الربيع. لا تنازع مجرى النهر، بل كن مجرى النهر ذاته.`;
      }
      setPersonaConversation((prev) => [...prev, { role: 'sage', text: reply }]);
      setIsPersonaThinking(false);
    }, 2000);
  };

  /* ── Sage initial letter ── */
  const sageInitial = dailySage.author.charAt(0);

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div className="w-full fade-in pb-32" dir="rtl">

      {/* ════════════════════════════════════════════════
          DAILY SAGE HERO
      ════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative glass-gold rounded-3xl overflow-hidden mb-12 mx-auto max-w-5xl"
        style={{ boxShadow: '0 8px 60px rgba(212,175,55,0.12), 0 2px 0 rgba(212,175,55,0.25) inset' }}
      >
        {/* Top shimmer line */}
        <div className="shimmer absolute top-0 inset-x-0 h-[2px] rounded-t-3xl" />

        <div className="relative p-8 md:p-12 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-pure)] shadow-[0_0_8px_var(--gold-pure)]" />
            <span
              className="text-[11px] tracking-[0.25em] uppercase font-serif"
              style={{ color: 'var(--gold-muted)' }}
            >
              الحكيم اليومي — {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-pure)] shadow-[0_0_8px_var(--gold-pure)]" />
          </div>

          {/* Avatar perfectly masked circle */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[var(--gold-pure)] shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={dailySage.avatar} 
                alt={dailySage.author}
                className="w-full h-full object-cover filter grayscale sepia-[0.3] brightness-75 contrast-125"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden absolute inset-0 bg-black/80 flex items-center justify-center font-serif text-4xl text-[var(--gold-pure)] pulse-gold">
                {sageInitial}
              </div>
            </div>
            
            {/* Audio visualizer positioned dynamically around avatar or simply below it */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end justify-center gap-[3px] h-6 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-[var(--gold-border)]" aria-label="مؤشر الصوت">
              {[0.6, 1, 0.75, 1, 0.5].map((h, i) => (
                <motion.div
                  key={i}
                  animate={isSpeaking ? { scaleY: [h, 1.4, h * 0.4, 1.2, h] } : { scaleY: 0.3 }}
                  transition={isSpeaking ? { duration: 0.7 + i * 0.12, repeat: Infinity, ease: 'easeInOut', delay: i * 0.07 } : { duration: 0.3 }}
                  style={{ width: 3, height: 16, borderRadius: 2, background: 'var(--gold-pure)', opacity: isSpeaking ? 0.9 : 0.4, transformOrigin: 'bottom' }}
                />
              ))}
            </div>
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold mb-2 text-shadow-gold"
            style={{ color: 'var(--gold-pure)', fontFamily: 'var(--font-reem-kufi)' }}
          >
            {dailySage.author}
          </h2>
          <p
            className="text-xs tracking-widest uppercase mb-8 font-serif"
            style={{ color: 'var(--gold-muted)' }}
          >
            {dailySage.school}
          </p>

          <blockquote
            className="font-serif text-lg md:text-xl leading-[2.2] mb-10 max-w-3xl"
            style={{ color: 'var(--text-primary)' }}
          >
            {DAILY_DILEMMA_TEXT}
          </blockquote>

          {/* TTS controls */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={stopSpeaking}
              disabled={!isSpeaking}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-serif transition-all disabled:opacity-30"
              style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid var(--gold-border)', color: 'var(--gold-pure)' }}
            >
              <VolumeX size={16} strokeWidth={1.5} />
              صمت
            </button>
            <button
              onClick={speakDilemma}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-serif transition-all hover:bg-[var(--gold-pure)] hover:text-black hover:border-transparent"
              style={{ background: isSpeaking ? 'var(--gold-pure)' : 'rgba(212,175,55,0.15)', border: '1px solid var(--gold-border)', color: isSpeaking ? '#000' : 'var(--gold-pure)' }}
            >
              {isSpeaking ? <Volume2 size={16} className="animate-pulse" /> : <RotateCcw size={16} strokeWidth={1.5} />}
              {isSpeaking ? 'يقرأ الآن' : 'استمع للحكيم'}
            </button>
          </div>

          {/* Inquiries / CTA */}
          <div className="w-full max-w-2xl border-t border-[var(--glass-border)] pt-8">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-serif mb-4">كيف ستستجيب؟</p>
            <div className="flex flex-col gap-3">
              {dailySage.inquiries.map((inq, i) => (
                <button
                  key={i}
                  onClick={() => handleInquiryClick(inq)}
                  className="w-full text-right p-4 rounded-xl border border-[var(--glass-border)] bg-white/5 hover:bg-[var(--gold-pure)] hover:text-black hover:border-transparent transition-all font-serif text-sm md:text-base group flex justify-between items-center"
                >
                  <span>{inq}</span>
                  <Send size={14} className="opacity-0 group-hover:opacity-100 transform -rotate-180 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════
          PAGE TITLE
      ════════════════════════════════════════════════ */}
      <div className="text-center space-y-3 mb-10">
        <h1
          className="text-4xl md:text-5xl font-serif tracking-wide"
          style={{ color: 'var(--text-primary)' }}
        >
          صَفّ المَدِينَة الفَاضِلَة
        </h1>
        <p
          className="text-xs md:text-sm tracking-widest uppercase font-serif"
          style={{ color: 'var(--gold-muted)' }}
        >
          ١٠٠ شذرة فلسفية ومعضلة وجودية متجددة يومياً بحساب حركة الفلك والتقويم
        </p>
      </div>

      {/* ════════════════════════════════════════════════
          CONTROLS & SEARCH
      ════════════════════════════════════════════════ */}
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 max-w-5xl mx-auto p-4 rounded-2xl glass"
      >
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن فيلسوف، مدرسة، أو اقتباس..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl text-xs focus:outline-none"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
            }}
          />
          <Search
            size={16}
            className="absolute right-3 top-3"
            style={{ color: 'var(--text-secondary)' }}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'كافة المدارس (١٠٠)' },
            { id: 'stoic', label: 'الرواقية' },
            { id: 'islamic', label: 'الفلسفة الإسلامية' },
            { id: 'existential', label: 'الوجودية والتمرد' },
            { id: 'eastern', label: 'الحكمة الشرقية' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterSchool(tab.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-serif font-medium transition-all"
              style={
                filterSchool === tab.id
                  ? {
                      background: 'var(--gold-pure)',
                      color: '#000',
                      fontWeight: 700,
                    }
                  : {
                      background: 'rgba(255,255,255,0.04)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--glass-border)',
                    }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          100 CARDS MASONRY GRID
      ════════════════════════════════════════════════ */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-6xl mx-auto">
        {filteredQuotes.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(item.id * 0.01, 0.5) }}
            onClick={() => handleOpenPersonaChat(item)}
            className="break-inside-avoid glass-card rounded-2xl p-6 cursor-pointer group hover:scale-[1.01] transition-all duration-300 relative overflow-hidden"
            style={{
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            {/* Hover shimmer top line */}
            <div
              className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--gold-pure), transparent)',
              }}
            />

            {/* Concept tag & index */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-serif"
                style={{
                  background: 'rgba(212,175,55,0.08)',
                  color: 'var(--gold-pure)',
                  border: '1px solid var(--gold-border)',
                }}
              >
                {item.concept}
              </span>
              <span
                className="text-[10px] font-mono"
                style={{ color: 'var(--text-secondary)' }}
              >
                #{item.id}
              </span>
            </div>

            {/* Quote */}
            <p
              className="font-serif text-sm md:text-[15px] leading-[2] mb-6 whitespace-pre-line group-hover:brightness-110 transition-all"
              style={{ color: 'var(--text-primary)' }}
            >
              «{item.quote}»
            </p>

            {/* Philosopher footer */}
            <div
              className="flex items-center justify-between pt-4"
              style={{ borderTop: '1px solid var(--glass-border)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center group-hover:border-[var(--gold-border)] transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--gold-pure)',
                  }}
                >
                  <User size={13} />
                </div>
                <span
                  className="text-xs font-serif font-bold group-hover:brightness-125 transition-all"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.author}
                </span>
              </div>
              <span
                className="text-[10px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.school}
              </span>
            </div>

            {/* Hover CTA */}
            <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span
                className="text-[10px] tracking-widest uppercase flex items-center justify-center gap-1 font-serif"
                style={{ color: 'var(--gold-pure)' }}
              >
                <Bot size={11} />
                <span>انقر لمحاورة الفيلسوف بشخصيته</span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════
          PERSONA CHAT MODAL
      ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedEntity && (
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
              className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col relative"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--gold-border)',
                boxShadow: '0 30px 70px rgba(0,0,0,0.9)',
                height: 650,
              }}
            >
              {/* Shimmer top */}
              <div className="shimmer absolute top-0 inset-x-0 h-[2px] rounded-t-2xl" />

              {/* Modal Header */}
              <div
                className="p-5 flex items-center justify-between"
                style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(212,175,55,0.12)',
                      border: '1px solid var(--gold-border)',
                      color: 'var(--gold-pure)',
                    }}
                  >
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      محاورة شخصية: {selectedEntity.author}
                    </h3>
                    <p className="text-[10px]" style={{ color: 'var(--gold-muted)' }}>
                      {selectedEntity.school} — {selectedEntity.concept}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntity(null)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-hide">
                {personaConversation.map((c, i) => (
                  <div
                    key={i}
                    className={`flex ${c.role === 'user' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-xs md:text-sm leading-[1.9] font-serif ${
                        c.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'
                      }`}
                      style={
                        c.role === 'user'
                          ? {
                              background: 'rgba(255,255,255,0.08)',
                              color: 'var(--text-primary)',
                            }
                          : {
                              background: 'rgba(0,0,0,0.5)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--gold-border)',
                            }
                      }
                    >
                      {c.text}
                    </div>
                  </div>
                ))}

                {isPersonaThinking && (
                  <div className="flex justify-end">
                    <div
                      className="p-3 rounded-xl text-xs flex items-center gap-2 animate-pulse"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid var(--gold-border)',
                        color: 'var(--gold-pure)',
                      }}
                    >
                      <Bot size={14} />
                      <span>{selectedEntity.author} يستحضر الحجة الفلسفية...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat input */}
              <div
                className="p-4"
                style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--glass-border)' }}
              >
                <form onSubmit={handleSendToPersona} className="relative flex items-center">
                  <input
                    type="text"
                    value={personaChatInput}
                    onChange={(e) => setPersonaChatInput(e.target.value)}
                    placeholder={`وجّه تساؤلك الفلسفي إلى ${selectedEntity.author}...`}
                    disabled={isPersonaThinking}
                    className="w-full px-4 py-3 pl-12 rounded-xl text-xs focus:outline-none"
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!personaChatInput.trim() || isPersonaThinking}
                    className="absolute left-2 p-2 rounded-lg transition-colors disabled:opacity-30"
                    style={{ background: 'var(--gold-pure)', color: '#000' }}
                  >
                    <Send size={14} className="rotate-180" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

