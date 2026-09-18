'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Quote, 
  User, 
  Send, 
  X, 
  Bot, 
  Search, 
  BookOpen,
  Filter
} from 'lucide-react';

interface PhilosophicalEntity {
  id: number;
  author: string;
  school: string;
  schoolKey: 'stoic' | 'islamic' | 'existential' | 'eastern';
  quote: string;
  concept: string;
  personaPrompt: string;
}

const PHILOSOPHERS_POOL = [
  // Stoicism
  {
    author: 'ماركوس أوريليوس',
    school: 'الرواقية الإمبراطورية',
    schoolKey: 'stoic' as const,
    concepts: ['قدسية العقل المدبر', 'حتمية الزوال (موريتوري)', 'الانسجام مع الطبيعة الكلية', 'حصار الأحكام الذاتية'],
    quoteTemplates: [
      'تخلَّ عن حكمك على الأمور يتلاشى الألم؛ ارفض القول "لقد لُحِق بي الأذى"، وسينعدم الأذى نفسه.',
      'إن لم يكن الأمر صواباً فلا تفعله، وإن لم يكن حقاً فلا تقله. حصنك الباطني هو ملاذك الوحيد.',
      'العالم تحوّلٌ مستمر، وحياتنا ما تصنعه أفكارنا ومواقفنا تجاه نوائب الدهر.',
    ],
    personaPrompt: 'أنت الإمبراطور الفيلسوف ماركوس أوريليوس. تخاطب السائل بلهجة رواقية حازمة، مهيبة، تذكره بأن لا شيء خارج عقله يملك سلطاناً عليه.',
  },
  {
    author: 'سينيكا',
    school: 'الرواقية الرومانية',
    schoolKey: 'stoic' as const,
    concepts: ['قصر الحياة وتضييع الوقت', 'ترويض الغضب والشهوة', 'الاستعداد للمحن (بريميديتاتيو مالوروم)'],
    quoteTemplates: [
      'نحن نتألم في الخيال أضعاف ما نتألم في الواقع. معظم مخاوفك أشباح لا وجود لها في عالم الأعيان.',
      'ليس المهم كم تعيش، بل كيف عشت بنبل وشرف ورجاحة عقل.',
      'لا يوجد ريح مواتية لمن لا يعرف إلى أي ميناء يبحر بقاربه.',
    ],
    personaPrompt: 'أنت الفيلسوف سينيكا. تخاطب السائل بحكمة ناصحة بليغة، تحذره من هدر العمر والهلع من الغد.',
  },
  {
    author: 'إبيكتيتوس',
    school: 'الرواقية الأصيلة',
    schoolKey: 'stoic' as const,
    concepts: ['ثنائية التحكم المحضة', 'حرية الإرادة الباطنة', 'الرضا بالمقدور'],
    quoteTemplates: [
      'لا تجعل حريتك مشروطة بما يملكه غيرك؛ فمن يطلب ما بيد الناس يظل عبداً أبد الدهر.',
      'أنت لست جسداً، بل روحٌ حرة تحمل جثة إلى حين. اعتنِ بما هو لك ولا تنازع في ممتلكات الأقدار.',
    ],
    personaPrompt: 'أنت إبيكتيتوس المعلم الذي تحرر من الأغلال. كلامك قاطع، يضع السائل أمام مسؤوليته الكاملة دون مواربة.',
  },
  // Islamic Golden Age
  {
    author: 'أبو حامد الغزالي',
    school: 'الفلسفة والتصوف الإسلامي',
    schoolKey: 'islamic' as const,
    concepts: ['تهافت الفلاسفة والشك المنهجي', 'كيمياء السعادة', 'تهذيب الأخلاق وتصفية الباطن'],
    quoteTemplates: [
      'من لم يشك لم ينظر، ومن لم ينظر لم يبصر، ومن لم يبصر بقي في العمى والضلال.',
      'العلم بلا عمل جنون، والعمل بغير علم لا يكون. طهّر مرآة قلبك تتجلى لك أسرار الملكوت.',
      'لو سكت من لا يعلم لسقط الاختلاف، وإنما آفة العقول اتباع الهوى والظن.',
    ],
    personaPrompt: 'أنت الإمام حجة الإسلام أبو حامد الغزالي. تجمع بين دقة المنطق وعمق التزكية الصوفية، تدعو السائل لنبذ الغرور وتطهير النية.',
  },
  {
    author: 'ابن رشد (أفيروس)',
    school: 'المشائية العقلانية الإسلامية',
    schoolKey: 'islamic' as const,
    concepts: ['فصل المقال بين الحكمة والشريعة', 'قداسة النظر العقلي', 'تأويل المتشابهات'],
    quoteTemplates: [
      'الحق لا يضاد الحق، بل يوافقه ويشهد له. من عادى العقل فقد عادى جوهر الإنسانية.',
      'إن العدالة ليست في التساوي الشكلي، بل في وضع كل أمر في نصابه وفق مقتضى البرهان.',
    ],
    personaPrompt: 'أنت القاضي والفيلسوف ابن رشد. أسلوبك برهاني، استدلالي، دقيق، ينبذ الخرافة ويحتكم إلى نور الحجة العقلية.',
  },
  {
    author: 'ابن سينا (الشيخ الرئيس)',
    school: 'الحكمة الإشراقية والمشائية',
    schoolKey: 'islamic' as const,
    concepts: ['برهان الصديقين', 'النفس الناطقة وتجردها', 'واجب الوجود'],
    quoteTemplates: [
      'الوهم نصف الداء، والاطمئنان نصف الدواء، والصبر أول خطوات الشفاء.',
      'العقل البشري قوة مستعدة لإدراك الحقائق إذا ما تحرر من سلطان الحواس المشوشة.',
    ],
    personaPrompt: 'أنت الشيخ الرئيس ابن سينا. تجيب بدقة الحكيم والطبيب الفيلسوف الذي يشرح أعماق النفس الإنسانية وعللها.',
  },
  // Existentialism
  {
    author: 'فريدريك نيتشه',
    school: 'الوجودية الصارمة',
    schoolKey: 'existential' as const,
    concepts: ['إرادة القوة', 'الإنسان الأعلى (الأوبرمنش)', 'حب القدر (أمور فاتي)', 'أخلاق السادة والعبيد'],
    quoteTemplates: [
      'من يملك في الحياة "لماذا" يعيش لأجلها، يستطيع أن يحتمل في سبيلها أي "كيف".',
      'إن ما لا يقتلني يجعلني أقوى؛ كن عاصفة ولا تركن إلى وداعة القطعان الرخوة.',
      'عليك أن تحتمل احتراقك في لهيبك الخاص؛ كيف لك أن تتجدد دون أن تصبح رماداً أولاً؟',
    ],
    personaPrompt: 'أنت فريدريك نيتشه. نبرتك نارية، فلسفية، شعرية، تدعو السائل إلى نبذ الضعف وتحدي القيود واحتضان ألمه كوقود للسيادة.',
  },
  {
    author: 'ألبير كامو',
    school: 'الفلسفة العبثية والتمرد',
    schoolKey: 'existential' as const,
    concepts: ['أسطورة سيزيف', 'الإنسان المتمرد', 'انتصار الوعي على اللامعنى'],
    quoteTemplates: [
      'في عمق الشتاء، أدركتُ أخيراً أن في داخلي صيفاً لا يقهر ولا ينكسر.',
      'يجب أن نتخيل سيزيف سعيداً؛ فالصخرة صخرته، والتمرد هو أسمى أشكال الكرامة.',
    ],
    personaPrompt: 'أنت الفيلسوف الوجودي ألبير كامو. هادئ، متفهم لعبثية العالم، لكنك تدعو إلى التمرد الشجاع وصناعة المعنى بإرادة حرة.',
  },
  {
    author: 'سورين كيركغور',
    school: 'الوجودية الإيمانية',
    schoolKey: 'existential' as const,
    concepts: ['قفزة الإيمان', 'القلق والحرية', 'مراحل الوجود الثلاث'],
    quoteTemplates: [
      'القلق هو دوار الحرية حينما تدرك الروح إمكانياتها اللانهائية للاختيار.',
      'الحياة لا تُفهم إلا بالنظر إلى الوراء، لكنها لا تُعاش إلا بالتقدم إلى الأمام.',
    ],
    personaPrompt: 'أنت سورين كيركغور. عميق التأمل، تستفز في السائل حس القلق الوجودي ليدفعه نحو مسؤولية الاختيار الشخصي الصادق.',
  },
  // Eastern Philosophy
  {
    author: 'لاوتسو (داو دي جينغ)',
    school: 'الفلسفة الشرقية (الداوية)',
    schoolKey: 'eastern' as const,
    concepts: ['اللا-فعل الفعال (وو وي)', 'مرونة الماء الخارقة', 'التناغم مع مجرى الكون'],
    quoteTemplates: [
      'الماء هو ألين الأشياء، ومع ذلك فهو يفتت أصلب الصخور دون صخب. كن كالماء في حكمتك.',
      'رحلة الألف ميل تبدأ بخطوة واحدة تتكئ على سكون اليقين الداخلي.',
    ],
    personaPrompt: 'أنت الحكيم لاوتسو. كلماتك موجزة، عميقة، ممتلئة بالسكينة والرموز الطبيعية، تدعو لترك الصراع العقيم والتدفق مع الحكمة الأزلية.',
  },
];

export default function UtopianCity() {
  const [selectedEntity, setSelectedEntity] = useState<PhilosophicalEntity | null>(null);
  const [filterSchool, setFilterSchool] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dedicated Persona Chat states
  const [personaChatInput, setPersonaChatInput] = useState('');
  const [isPersonaThinking, setIsPersonaThinking] = useState(false);
  const [personaConversation, setPersonaConversation] = useState<Array<{ role: 'user' | 'sage'; text: string }>>([]);

  // Generate deterministic 100 quotes seeded by today's calendar date string
  const dailyQuotes = useMemo(() => {
    const todayStr = typeof window !== 'undefined' ? new Date().toDateString() : 'MindInBoxDailySeed';
    let seedVal = 0;
    for (let i = 0; i < todayStr.length; i++) {
      seedVal = (seedVal << 5) - seedVal + todayStr.charCodeAt(i);
      seedVal |= 0;
    }

    const pseudoRandom = (offset: number) => {
      const x = Math.sin(seedVal + offset) * 10000;
      return x - Math.floor(x);
    };

    const generated: PhilosophicalEntity[] = [];
    for (let i = 0; i < 100; i++) {
      const pIndex = Math.floor(pseudoRandom(i * 3) * PHILOSOPHERS_POOL.length);
      const philosopher = PHILOSOPHERS_POOL[pIndex];
      const qIndex = Math.floor(pseudoRandom(i * 7) * philosopher.quoteTemplates.length);
      const cIndex = Math.floor(pseudoRandom(i * 11) * philosopher.concepts.length);

      generated.push({
        id: i + 1,
        author: philosopher.author,
        school: philosopher.school,
        schoolKey: philosopher.schoolKey,
        quote: philosopher.quoteTemplates[qIndex],
        concept: philosopher.concepts[cIndex],
        personaPrompt: philosopher.personaPrompt,
      });
    }

    return generated;
  }, []);

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

  return (
    <div className="w-full fade-in pb-32" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-4 pt-4 mb-12">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] mb-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          <Sparkles size={24} />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-[#EAEAEA] tracking-wide">
          صَفّ المَدِينَة الفَاضِلَة
        </h1>
        <p className="text-xs md:text-sm text-[#D4AF37]/80 tracking-widest uppercase font-serif max-w-xl mx-auto">
          ١٠٠ شذرة فلسفية ومعضلة وجودية متجددة يومياً بحساب حركة الفلك والتقويم
        </p>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 max-w-5xl mx-auto p-4 rounded-2xl bg-[#0A0A0A] border border-white/5">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن فيلسوف، مدرسة، أو اقتباس..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-black border border-white/10 text-xs text-[#EAEAEA] placeholder-[#888888] focus:outline-none focus:border-[#D4AF37]"
          />
          <Search size={16} className="absolute right-3 top-3 text-[#888888]" />
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterSchool === tab.id
                  ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                  : 'bg-white/5 text-[#888888] hover:text-[#EAEAEA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 100 Cards Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-6xl mx-auto">
        {filteredQuotes.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleOpenPersonaChat(item)}
            className="break-inside-avoid p-6 rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/15 hover:border-[#D4AF37]/50 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer group hover:scale-[1.01] relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Concept tag & index */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-serif">
                {item.concept}
              </span>
              <span className="text-[10px] text-[#888888] font-mono">#{item.id}</span>
            </div>

            {/* Quote */}
            <p className="text-[#EAEAEA] font-serif text-sm md:text-[15px] leading-[2] mb-6 whitespace-pre-line group-hover:text-white transition-colors">
              «{item.quote}»
            </p>

            {/* Philosopher footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:border-[#D4AF37]/40 transition-colors">
                  <User size={13} />
                </div>
                <span className="text-xs font-serif font-bold text-[#EAEAEA] group-hover:text-[#D4AF37] transition-colors">
                  {item.author}
                </span>
              </div>
              <span className="text-[10px] text-[#888888]">{item.school}</span>
            </div>

            <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-[#D4AF37] tracking-widest uppercase flex items-center justify-center gap-1">
                <Bot size={11} />
                <span>انقر لمحاورة الفيلسوف بشخصيته</span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dedicated Persona Dialogue Modal */}
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
              className="w-full max-w-2xl bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col h-[650px] relative"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/5 bg-[#050505] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-[#EAEAEA] font-bold">
                      محاورة شخصية: {selectedEntity.author}
                    </h3>
                    <p className="text-[10px] text-[#D4AF37]/80">{selectedEntity.school} — {selectedEntity.concept}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntity(null)}
                  className="p-1.5 rounded-lg text-[#888888] hover:text-white transition-colors"
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
                        c.role === 'user'
                          ? 'bg-white/10 text-white rounded-tr-none'
                          : 'bg-[#030303] text-[#EAEAEA] border border-[#D4AF37]/25 shadow-md rounded-tl-none'
                      }`}
                    >
                      {c.text}
                    </div>
                  </div>
                ))}

                {isPersonaThinking && (
                  <div className="flex justify-end">
                    <div className="p-3 rounded-xl bg-black border border-[#D4AF37]/30 text-xs text-[#D4AF37] flex items-center gap-2 animate-pulse">
                      <Bot size={14} />
                      <span>{selectedEntity.author} يستحضر الحجة الفلسفية...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat input */}
              <div className="p-4 bg-[#030303] border-t border-white/5">
                <form onSubmit={handleSendToPersona} className="relative flex items-center">
                  <input
                    type="text"
                    value={personaChatInput}
                    onChange={(e) => setPersonaChatInput(e.target.value)}
                    placeholder={`وجّه تساؤلك الفلسفي إلى ${selectedEntity.author}...`}
                    disabled={isPersonaThinking}
                    className="w-full px-4 py-3 pl-12 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs text-[#EAEAEA] placeholder-[#888888] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    disabled={!personaChatInput.trim() || isPersonaThinking}
                    className="absolute left-2 p-2 rounded-lg bg-[#D4AF37] text-black hover:bg-[#AA7C11] disabled:opacity-30 transition-colors"
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
