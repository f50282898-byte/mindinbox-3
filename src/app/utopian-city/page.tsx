'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
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
  school: string;
  schoolKey: 'stoic' | 'islamic' | 'existential' | 'eastern';
  concepts: string[];
  quoteTemplates: string[];
  personaPrompt: string;
  dilemma: string; // shown in Daily Sage hero + read aloud by TTS
}

/* ══════════════════════════════════════════════════════════
   PHILOSOPHERS POOL
══════════════════════════════════════════════════════════ */
const PHILOSOPHERS_POOL: PhilosopherRaw[] = [
  // Stoicism
  {
    author: 'ماركوس أوريليوس',
    school: 'الرواقية الإمبراطورية',
    schoolKey: 'stoic',
    concepts: ['قدسية العقل المدبر', 'حتمية الزوال (موريتوري)', 'الانسجام مع الطبيعة الكلية', 'حصار الأحكام الذاتية'],
    quoteTemplates: [
      'تخلَّ عن حكمك على الأمور يتلاشى الألم؛ ارفض القول «لقد لُحِق بي الأذى»، وسينعدم الأذى نفسه.',
      'إن لم يكن الأمر صواباً فلا تفعله، وإن لم يكن حقاً فلا تقله. حصنك الباطني هو ملاذك الوحيد.',
      'العالم تحوّلٌ مستمر، وحياتنا ما تصنعه أفكارنا ومواقفنا تجاه نوائب الدهر.',
    ],
    personaPrompt: 'أنت الإمبراطور الفيلسوف ماركوس أوريليوس. تخاطب السائل بلهجة رواقية حازمة، مهيبة، تذكره بأن لا شيء خارج عقله يملك سلطاناً عليه.',
    dilemma:
      'أيها الزائر، قف لحظة وانظر إلى ما يشغل بالك اليوم. هل هو مما تملك تغييره، أم مما رسمه القدر بقلمٍ لا يُمحى؟ الإمبراطور يسألك: أين تضع طاقتك، في ما بيدك، أم في ما أبعد من سلطانك؟ أجب بصدق، فالرواقية لا تقبل التهرب.',
  },
  {
    author: 'سينيكا',
    school: 'الرواقية الرومانية',
    schoolKey: 'stoic',
    concepts: ['قصر الحياة وتضييع الوقت', 'ترويض الغضب والشهوة', 'الاستعداد للمحن (بريميديتاتيو مالوروم)'],
    quoteTemplates: [
      'نحن نتألم في الخيال أضعاف ما نتألم في الواقع. معظم مخاوفك أشباح لا وجود لها في عالم الأعيان.',
      'ليس المهم كم تعيش، بل كيف عشت بنبل وشرف ورجاحة عقل.',
      'لا يوجد ريح مواتية لمن لا يعرف إلى أي ميناء يبحر بقاربه.',
    ],
    personaPrompt: 'أنت الفيلسوف سينيكا. تخاطب السائل بحكمة ناصحة بليغة، تحذره من هدر العمر والهلع من الغد.',
    dilemma:
      'سينيكا يرمقك بعيني الحكيم الذي رأى كثيرين يبددون أعمارهم على أشياء لا تستحق. كم لحظة قضيتها اليوم في خوف من شيء لم يقع؟ الوقت هو ثروتك الوحيدة التي لا تُعاد. كيف تنفق هذا اليوم بعينه وأنت تعلم أنه لن يعود؟',
  },
  {
    author: 'إبيكتيتوس',
    school: 'الرواقية الأصيلة',
    schoolKey: 'stoic',
    concepts: ['ثنائية التحكم المحضة', 'حرية الإرادة الباطنة', 'الرضا بالمقدور'],
    quoteTemplates: [
      'لا تجعل حريتك مشروطة بما يملكه غيرك؛ فمن يطلب ما بيد الناس يظل عبداً أبد الدهر.',
      'أنت لست جسداً، بل روحٌ حرة تحمل جثة إلى حين. اعتنِ بما هو لك ولا تنازع في ممتلكات الأقدار.',
    ],
    personaPrompt: 'أنت إبيكتيتوس المعلم الذي تحرر من الأغلال. كلامك قاطع، يضع السائل أمام مسؤوليته الكاملة دون مواربة.',
    dilemma:
      'إبيكتيتوس، العبد الذي صار أحرر من ملوك، يتحداك: ما الذي يقيّدك الآن؟ هل هو قيد حقيقي من خارج، أم هو وهم نسجته بيديك في الداخل؟ الحرية ليست غياب العوائق، بل هي اختيارك لموقفك منها في كل نفَس.',
  },
  // Islamic Golden Age
  {
    author: 'أبو حامد الغزالي',
    school: 'الفلسفة والتصوف الإسلامي',
    schoolKey: 'islamic',
    concepts: ['تهافت الفلاسفة والشك المنهجي', 'كيمياء السعادة', 'تهذيب الأخلاق وتصفية الباطن'],
    quoteTemplates: [
      'من لم يشك لم ينظر، ومن لم ينظر لم يبصر، ومن لم يبصر بقي في العمى والضلال.',
      'العلم بلا عمل جنون، والعمل بغير علم لا يكون. طهّر مرآة قلبك تتجلى لك أسرار الملكوت.',
      'لو سكت من لا يعلم لسقط الاختلاف، وإنما آفة العقول اتباع الهوى والظن.',
    ],
    personaPrompt: 'أنت الإمام حجة الإسلام أبو حامد الغزالي. تجمع بين دقة المنطق وعمق التزكية الصوفية، تدعو السائل لنبذ الغرور وتطهير النية.',
    dilemma:
      'الغزالي يسألك: كم من يقين تحمله اليوم لم تمحّصه بالشك الحقيقي؟ إن مرآة القلب تصدأ بصدأ العادة والتقليد. ما الفكرة التي تؤمن بها دون أن تجرؤ على مساءلتها؟ شككٌ واحد صادق خير من ألف يقين مستعار.',
  },
  {
    author: 'ابن رشد (أفيروس)',
    school: 'المشائية العقلانية الإسلامية',
    schoolKey: 'islamic',
    concepts: ['فصل المقال بين الحكمة والشريعة', 'قداسة النظر العقلي', 'تأويل المتشابهات'],
    quoteTemplates: [
      'الحق لا يضاد الحق، بل يوافقه ويشهد له. من عادى العقل فقد عادى جوهر الإنسانية.',
      'إن العدالة ليست في التساوي الشكلي، بل في وضع كل أمر في نصابه وفق مقتضى البرهان.',
    ],
    personaPrompt: 'أنت القاضي والفيلسوف ابن رشد. أسلوبك برهاني، استدلالي، دقيق، ينبذ الخرافة ويحتكم إلى نور الحجة العقلية.',
    dilemma:
      'ابن رشد يرفع إليك صحيفة البرهان: هل أنت ممن يؤمن لأن الدليل أقنعه، أم ممن يبحث عن أدلة تُقنع غيره بما سبق أن آمن به؟ العقل لا يُستدعى لخدمة الهوى، بل يُستدعى لكشف الحق ولو اختلف مع ما ألفناه.',
  },
  {
    author: 'ابن سينا (الشيخ الرئيس)',
    school: 'الحكمة الإشراقية والمشائية',
    schoolKey: 'islamic',
    concepts: ['برهان الصديقين', 'النفس الناطقة وتجردها', 'واجب الوجود'],
    quoteTemplates: [
      'الوهم نصف الداء، والاطمئنان نصف الدواء، والصبر أول خطوات الشفاء.',
      'العقل البشري قوة مستعدة لإدراك الحقائق إذا ما تحرر من سلطان الحواس المشوشة.',
    ],
    personaPrompt: 'أنت الشيخ الرئيس ابن سينا. تجيب بدقة الحكيم والطبيب الفيلسوف الذي يشرح أعماق النفس الإنسانية وعللها.',
    dilemma:
      'ابن سينا يضع يده على جبهتك الفكرية: ما الوهم الذي يُعشّش في عقلك ويصنع من ألمك أضعاف ما هو في الحقيقة؟ الطبيب الفيلسوف يعلم أن نصف العلاج هو في تسمية الداء بدقة. سمّ ما يقلقك باسمه الحقيقي، لا باسمه المخيف.',
  },
  // Existentialism
  {
    author: 'فريدريك نيتشه',
    school: 'الوجودية الصارمة',
    schoolKey: 'existential',
    concepts: ['إرادة القوة', 'الإنسان الأعلى (الأوبرمنش)', 'حب القدر (أمور فاتي)', 'أخلاق السادة والعبيد'],
    quoteTemplates: [
      'من يملك في الحياة «لماذا» يعيش لأجلها، يستطيع أن يحتمل في سبيلها أي «كيف».',
      'إن ما لا يقتلني يجعلني أقوى؛ كن عاصفة ولا تركن إلى وداعة القطعان الرخوة.',
      'عليك أن تحتمل احتراقك في لهيبك الخاص؛ كيف لك أن تتجدد دون أن تصبح رماداً أولاً؟',
    ],
    personaPrompt: 'أنت فريدريك نيتشه. نبرتك نارية، فلسفية، شعرية، تدعو السائل إلى نبذ الضعف وتحدي القيود واحتضان ألمه كوقود للسيادة.',
    dilemma:
      'نيتشه يصرخ من أعماق الفلسفة: هل تعيش لأجل شيء، أم تعيش لأن الحياة وجدتك ولم تجد لها رافضاً؟ الإنسان الأعلى لا يسأل «هل يسمح لي المجتمع»، بل يسأل «ما الذي سيعطيه وجودي للعالم؟». ما هو الشعلة التي تحرقك من الداخل؟',
  },
  {
    author: 'ألبير كامو',
    school: 'الفلسفة العبثية والتمرد',
    schoolKey: 'existential',
    concepts: ['أسطورة سيزيف', 'الإنسان المتمرد', 'انتصار الوعي على اللامعنى'],
    quoteTemplates: [
      'في عمق الشتاء، أدركتُ أخيراً أن في داخلي صيفاً لا يقهر ولا ينكسر.',
      'يجب أن نتخيل سيزيف سعيداً؛ فالصخرة صخرته، والتمرد هو أسمى أشكال الكرامة.',
    ],
    personaPrompt: 'أنت الفيلسوف الوجودي ألبير كامو. هادئ، متفهم لعبثية العالم، لكنك تدعو إلى التمرد الشجاع وصناعة المعنى بإرادة حرة.',
    dilemma:
      'كامو يجلس إلى جانبك في صمت الليل: العالم لا يعدك بمعنى، والكون أصم لا يسمع أسئلتك. لكن هذا هو بالضبط المكان الذي تبدأ منه الحرية الحقيقية. كيف ستصنع معنى يخصك وحدك في خضم هذا الصمت الكوني الهائل؟',
  },
  {
    author: 'سورين كيركغور',
    school: 'الوجودية الإيمانية',
    schoolKey: 'existential',
    concepts: ['قفزة الإيمان', 'القلق والحرية', 'مراحل الوجود الثلاث'],
    quoteTemplates: [
      'القلق هو دوار الحرية حينما تدرك الروح إمكانياتها اللانهائية للاختيار.',
      'الحياة لا تُفهم إلا بالنظر إلى الوراء، لكنها لا تُعاش إلا بالتقدم إلى الأمام.',
    ],
    personaPrompt: 'أنت سورين كيركغور. عميق التأمل، تستفز في السائل حس القلق الوجودي ليدفعه نحو مسؤولية الاختيار الشخصي الصادق.',
    dilemma:
      'كيركغور يسألك بهدوء مخيف: هل قلقك اليوم دليل ضعف، أم هو صوت حريتك التي تصرخ؟ القلق ليس عدواً يُدفع، بل هو البوصلة التي تشير نحو ما يستحق منك قفزة الإيمان. نحو ماذا تشير بوصلة قلقك الآن؟',
  },
  // Eastern Philosophy
  {
    author: 'لاوتسو (داو دي جينغ)',
    school: 'الفلسفة الشرقية (الداوية)',
    schoolKey: 'eastern',
    concepts: ['اللا-فعل الفعال (وو وي)', 'مرونة الماء الخارقة', 'التناغم مع مجرى الكون'],
    quoteTemplates: [
      'الماء هو ألين الأشياء، ومع ذلك فهو يفتت أصلب الصخور دون صخب. كن كالماء في حكمتك.',
      'رحلة الألف ميل تبدأ بخطوة واحدة تتكئ على سكون اليقين الداخلي.',
    ],
    personaPrompt: 'أنت الحكيم لاوتسو. كلماتك موجزة، عميقة، ممتلئة بالسكينة والرموز الطبيعية، تدعو لترك الصراع العقيم والتدفق مع الحكمة الأزلية.',
    dilemma:
      'لاوتسو يصمت ويبتسم، ثم يسألك بلا كلمات تقريباً: ما الذي تقاومه الآن بقوة؟ الماء لا يحارب الصخر، بل يلتفّ حوله ببطء حتى يخترقه. هل مشكلتك تستحق صراعاً مباشراً، أم أن التدفق الهادئ حولها هو الطريق الأحكم؟',
  },
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

        <div className="relative p-8 md:p-12">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={14} style={{ color: 'var(--gold-pure)' }} />
            <span
              className="text-[11px] tracking-[0.25em] uppercase font-serif"
              style={{ color: 'var(--gold-muted)' }}
            >
              الحكيم اليومي — {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar initial circle */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-serif font-bold pulse-gold"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, rgba(212,175,55,0.25), rgba(212,175,55,0.06))',
                  border: '2px solid var(--gold-border)',
                  color: 'var(--gold-pure)',
                  textShadow: '0 0 24px rgba(212,175,55,0.6)',
                }}
              >
                {sageInitial}
              </div>
              {/* Audio visualizer bars */}
              <div className="flex items-end gap-[3px] h-8" aria-label="مؤشر الصوت">
                {[0.6, 1, 0.75, 1, 0.5].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={
                      isSpeaking
                        ? { scaleY: [h, 1.4, h * 0.4, 1.2, h] }
                        : { scaleY: 0.3 }
                    }
                    transition={
                      isSpeaking
                        ? {
                            duration: 0.7 + i * 0.12,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.07,
                          }
                        : { duration: 0.3 }
                    }
                    style={{
                      width: 4,
                      height: 28,
                      borderRadius: 3,
                      background: 'var(--gold-pure)',
                      opacity: isSpeaking ? 0.9 : 0.3,
                      transformOrigin: 'bottom',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Text block */}
            <div className="flex-1 min-w-0">
              <h2
                className="text-3xl md:text-4xl font-serif font-bold mb-1 gold-gradient-text"
              >
                {dailySage.author}
              </h2>
              <p
                className="text-xs tracking-widest uppercase mb-6 font-serif"
                style={{ color: 'var(--gold-muted)' }}
              >
                {dailySage.school}
              </p>

              <blockquote
                className="font-serif text-base md:text-lg leading-[2.1] mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                {DAILY_DILEMMA_TEXT}
              </blockquote>

              {/* TTS controls */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={stopSpeaking}
                  disabled={!isSpeaking}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif transition-all disabled:opacity-30"
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid var(--gold-border)',
                    color: 'var(--gold-pure)',
                  }}
                >
                  <VolumeX size={14} />
                  أوقف الصوت
                </button>
                <button
                  onClick={speakDilemma}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif transition-all"
                  style={{
                    background: isSpeaking ? 'rgba(212,175,55,0.05)' : 'rgba(212,175,55,0.15)',
                    border: '1px solid var(--gold-border)',
                    color: 'var(--gold-pure)',
                  }}
                >
                  <RotateCcw size={14} />
                  أعد القراءة
                </button>
                {isSpeaking && (
                  <span
                    className="flex items-center gap-1.5 text-[11px] font-serif self-center"
                    style={{ color: 'var(--gold-muted)' }}
                  >
                    <Volume2 size={12} className="animate-pulse" />
                    جارٍ القراءة...
                  </span>
                )}
              </div>
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
