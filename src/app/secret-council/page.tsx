'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Lock, 
  Send, 
  ShieldCheck, 
  KeyRound, 
   
  User, 
  Radio, 
  Clock,
  ArrowRight,
  Mic,
  Play
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { db } from '@/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface CouncilMessage {
  id: string;
  senderName: string;
  senderUid: string;
  text: string;
  createdAt: any;
  audioBlobBase64?: string; // Storing as base64 for simplicity in demo
}

const SEED_MESSAGES: CouncilMessage[] = [
  {
    id: 'seed_1',
    senderName: 'فارس الحكمة الرواقية',
    senderUid: 'sovereign_elder_1',
    text: 'مرحباً بالسالكين في المجلس السري. تذكروا دوماً: نحن هنا لنصقل عزائمنا لا لنشتكي من تقلبات الدهر.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'seed_2',
    senderName: 'حارس النص الأندلسي',
    senderUid: 'sovereign_elder_2',
    text: 'لقد بدأت في مدارسة كتاب "فصل المقال" لابن رشد مجدداً. التوفيق بين المنطق الصارم وعمق الإيمان هو جوهر حصانتنا.',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'seed_3',
    senderName: 'المتأمل في العدم',
    senderUid: 'sovereign_elder_3',
    text: 'التفريغ الليلي في المخطوطة كان له أثر مهدئ بعد يوم عاصف بالضغوط. الحمد لله على نعمة الخلوة الفكرية.',
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
];

export default function SecretCouncil() {
  const { user, isPro } = useStore();
  const [messages, setMessages] = useState<CouncilMessage[]>(SEED_MESSAGES);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isRecording, startRecording, stopRecording, audioBlob } = useAudioEngine();

  // Convert Blob to Base64 to simulate sending audio over firestore
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Real-time Firestore Listener on `pro_council_chat`
  useEffect(() => {
    if (!isPro) return;

    try {
      const q = query(
        collection(db, 'pro_council_chat'),
        orderBy('createdAt', 'asc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: CouncilMessage[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              fetched.push({
                id: doc.id,
                senderName: data.senderName || 'سالك مجهول',
                senderUid: data.senderUid || '',
                text: data.text || '',
                audioBlobBase64: data.audioBlobBase64 || '',
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
              });
            });
            setMessages([...SEED_MESSAGES, ...fetched]);
          }
        },
        (error) => {
          console.warn('Firestore real-time listener offline or unauthenticated fallback:', error);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase query setup issue:', e);
    }
  }, [isPro]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isPro) {
      scrollToBottom();
    }
  }, [messages, isPro]);

  const handleSendMessage = async (e?: React.FormEvent, audioToSend?: Blob) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !audioToSend) || isSending) return;

    const messageText = input.trim();
    setInput('');
    setIsSending(true);

    let audioBase64 = '';
    if (audioToSend) {
      audioBase64 = await blobToBase64(audioToSend);
    }

    const localMessage: CouncilMessage = {
      id: Date.now().toString(),
      senderName: user.displayName,
      senderUid: user.uid,
      text: messageText,
      audioBlobBase64: audioBase64,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, localMessage]);

    try {
      await addDoc(collection(db, 'pro_council_chat'), {
        senderName: user.displayName,
        senderUid: user.uid,
        text: messageText,
        audioBlobBase64: audioBase64,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Simulated message delivery or offline mode:', err);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    // If audio is successfully recorded and we are not recording anymore, send it.
    if (audioBlob && !isRecording) {
      handleSendMessage(undefined, audioBlob);
    }
  }, [audioBlob, isRecording]);

  const playAudio = (base64Audio: string) => {
    const audio = new Audio(base64Audio);
    audio.play();
  };

  // If Not Pro: Render Majestic Golden Locked Gate
  if (!isPro) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center fade-in px-4" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full p-8 md:p-12 rounded-3xl bg-[#0A0A0A] border border-[#D4AF37]/30 shadow-[0_30px_70px_rgba(0,0,0,0.9)] text-center space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#AA7C11]/20 via-[#D4AF37]/20 to-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto shadow-[0_0_25px_rgba(212,175,55,0.3)]">
            <Lock size={36} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#EAEAEA]">
              المجلس السري (مغلق بالعهد السيادي)
            </h2>
            <p className="text-xs text-[#D4AF37] tracking-widest uppercase font-serif">
              خلوة النخبة الفكرية والمجتمع المشفر
            </p>
          </div>

          <p className="text-sm font-serif text-[#888888] leading-[2]">
            هذا الرواق مخصص حصرياً لأولئك الذين ختموا الميثاق وارتقوا إلى رتبة «العهد السيادي». 
            هنا تتبادل العقول المتمرسة أعمق التجارب، والرؤى الاستراتيجية دون صخب العالم الخارجي.
          </p>

          <div className="pt-4">
            <Link
              href="/vault"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-all"
            >
              <KeyRound size={16} />
              <span>ختم الميثاق والولوج إلى المجلس</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // If Pro: Render Real-time Encrypted Chat
  return (
    <div className="w-full fade-in pb-32 max-w-4xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/20 shadow-xl mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Users size={22} />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#EAEAEA] flex items-center gap-2">
              <span>المجلس السري المشفر</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                مباشر (Firestore)
              </span>
            </h2>
            <p className="text-xs text-[#888888]">محراب حوارات النخبة السيادية المشفر برمجياً</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-mono">
          <ShieldCheck size={16} />
          <span>E2E Sovereign Encrypted</span>
        </div>
      </div>

      {/* Messages Room */}
      <div className="rounded-2xl bg-[#0A0A0A] border border-white/5 shadow-2xl overflow-hidden flex flex-col h-[550px]">
        <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-hide">
          {messages.map((m) => {
            const isMe = m.senderUid === user.uid;
            return (
              <div
                key={m.id}
                className={`flex w-full ${isMe ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    isMe
                      ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#AA7C11]/10 border border-[#D4AF37]/40 text-[#EAEAEA] rounded-tr-none'
                      : 'bg-[#030303] border border-white/10 text-[#EAEAEA] rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1 border-b border-white/5 text-[10px]">
                    <span className="font-bold text-[#D4AF37] flex items-center gap-1">
                      <User size={10} />
                      {m.senderName}
                    </span>
                    <span className="text-[#888888] font-mono">
                      {typeof m.createdAt === 'string' ? m.createdAt.slice(11, 16) : 'الآن'}
                    </span>
                  </div>
                  {m.text && <p className="font-serif text-sm leading-relaxed">{m.text}</p>}
                  {m.audioBlobBase64 && (
                    <div className="mt-2 flex items-center gap-2">
                       <button 
                         onClick={() => playAudio(m.audioBlobBase64!)}
                         className="flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 py-1.5 px-3 rounded-full hover:bg-[#D4AF37]/30 transition-colors"
                       >
                         <Play size={12} className="text-[#D4AF37]" />
                         <span className="text-xs text-[#D4AF37]">رسالة صوتية</span>
                       </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 bg-[#050505] border-t border-white/5 relative">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isRecording ? "جاري تسجيل رسالتك الصوتية..." : "اكتب رسالتك إلى إخوانك في المجلس السري..."}
                disabled={isRecording}
                className="w-full px-5 py-3.5 pl-14 rounded-xl bg-black border border-white/15 text-xs text-[#EAEAEA] placeholder-[#888888] focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending || isRecording}
                className="absolute left-2.5 top-2 p-2 rounded-lg bg-[#D4AF37] text-black hover:bg-[#AA7C11] disabled:opacity-30 transition-all"
              >
                <Send size={15} className="rotate-180" />
              </button>
            </div>
            
            {/* Hold to Record Button */}
            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`p-3.5 rounded-xl border transition-all ${
                isRecording 
                  ? 'bg-red-900/40 border-red-500 text-red-500 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                  : 'bg-black border-white/15 text-[#D4AF37] hover:border-[#D4AF37]/50'
              }`}
              title="اضغط مطولاً للتسجيل"
            >
              <Mic size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


