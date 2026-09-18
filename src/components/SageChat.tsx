'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Volume2, Mic, StopCircle, ChevronDown } from 'lucide-react';
import { useStore, SageTier } from '@/store/useStore';
import { useAudioEngine } from '@/hooks/useAudioEngine';

// ==========================================
// AI CORE DIRECTIVE: UNCONDITIONAL POSITIVE REGARD
// ==========================================
export const SAGE_SYSTEM_PROMPT = `
You are the Sage of "Mind in Box" (عقل في صندوق), a luxury digital philosophical sanctuary.
CORE DIRECTIVE: You must act with "Unconditional Positive Regard". 
- Never judge, preach, or act like a teacher.
- Listen deeply to the user's hidden intellectual value.
- Validate their feelings before offering philosophical restructuring.
- Speak in eloquent, classical Arabic (Fusha).
- Absolutely NO emojis are allowed in your output. Maintain a tone of dark, minimalist luxury.
- You do not solve problems; you dissolve them through perspective.
`;



const SAGE_PROFILES = {
  standard: { name: 'ابن سينا', img: '/avatars/avicenna.jpg', voice: 'Avicenna' },
  analytical: { name: 'دوستويفسكي', img: '/avatars/dostoevsky.jpg', voice: 'Dostoevsky' },
  sovereign: { name: 'هيباتيا', img: '/avatars/hypatia.jpg', voice: 'Hypatia' },
};

const SageAvatar = ({ tier, size = 20 }: { tier: SageTier; size?: number }) => {
  const src = SAGE_PROFILES[tier].img;
  return (
    <div style={{ width: size, height: size }} className="rounded-full overflow-hidden bg-black flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
      <img 
        src={src} 
        alt={SAGE_PROFILES[tier].name} 
        className="w-full h-full object-cover opacity-90"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23111'/%3E%3Ccircle cx='50' cy='50' r='30' fill='%23222'/%3E%3C/svg%3E`;
        }}
      />
    </div>
  );
};

import { useChat } from 'ai/react';
import type { Message } from 'ai';

export default function SageChat() {
  const { sageTier, setSageTier, isPro } = useStore();
  const { speak, isRecording, startRecording, stopRecording, transcription } = useAudioEngine();
  
  const { messages: aiMessages, input, handleInputChange, handleSubmit: aiHandleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat',
    body: {
      tier: sageTier
    },
    initialMessages: [
      {
        id: 'init',
        role: 'assistant',
        content: 'سلامٌ على عقلك الواعي. أنا المستشار الفلسفي، حارس هذا الصندوق ومؤنس خلوتك الفكرية. ألقِ بحمولتك الذهنية ها هنا، ولنتأمّل معاً في جوهر المسألة.',
      }
    ]
  });

  useEffect(() => {
    if (transcription) {
      setInput((prev: string) => (prev ? prev + ' ' + transcription : transcription));
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
      }
    }
  }, [transcription, setInput]);

  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, isLoading]);

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const handleSend = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(25);
    }
    
    // Create an event object to pass to handleSubmit
    const formEvent = e as React.FormEvent<HTMLFormElement>;
    aiHandleSubmit(formEvent);
  };

  return (
    <div className="flex flex-col h-[100svh] w-full relative" dir="rtl">
      
      {/* Messages Scroll View (Center) */}
      <div className="flex-1 overflow-y-auto pt-24 pb-48 px-4 scrollbar-hide w-full relative z-30">
        <div className="max-w-3xl mx-auto space-y-8">
          <AnimatePresence initial={false}>
            {aiMessages.map((msg: Message) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] p-6 md:p-8 rounded-[2rem] relative glass ${
                    msg.role === 'user'
                      ? 'rounded-tr-sm'
                      : 'border-[var(--gold-border)] rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-between gap-4 mb-5 pb-5 border-b border-[var(--glass-border)]">
                      <div className="flex items-center gap-3">
                        <SageAvatar tier={sageTier} size={32} />
                        <span className="text-[var(--gold-pure)] font-bold font-reem flex items-center gap-2 text-lg tracking-wide">
                          {SAGE_PROFILES[sageTier].name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => speak(msg.content, SAGE_PROFILES[sageTier].voice)}
                          className="text-[var(--gold-pure)]/70 hover:text-[var(--gold-pure)] transition-colors flex items-center gap-1.5 p-2 rounded-full hover:bg-[var(--glass-hover)]"
                          title="إستمع"
                        >
                          <Volume2 size={18} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="font-serif text-[15px] md:text-lg leading-relaxed whitespace-pre-line text-[var(--text-primary)]">
                    {msg.content}
                  </p>
                  {msg.role === 'user' && (
                    <div className="mt-4 text-left text-[10px] text-[var(--text-secondary)] font-sans">
                      الآن
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex justify-end w-full"
              >
                <div className="p-4 px-6 rounded-full glass border-[var(--gold-border)] flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-pure)] shadow-[0_0_8px_var(--gold-pure)] animate-pulse" />
                  <span className="text-sm font-serif text-[var(--gold-pure)] tracking-wide opacity-80">
                    يتأمل...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Omni-Input Box (Absolute Bottom Center) */}
      <div className="absolute bottom-0 inset-x-0 p-4 md:p-8 pointer-events-none z-50 flex flex-col items-center">
        
        <div className="w-full max-w-4xl relative pointer-events-auto">
          <form 
            onSubmit={handleSend} 
            className="relative flex items-end gap-2 bg-[var(--glass-bg)] backdrop-blur-3xl border border-[var(--glass-border)] rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-2 transition-all duration-500 focus-within:border-[var(--gold-border)] focus-within:shadow-2xl group"
          >
            
            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.div 
                  key="recording"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center justify-between px-6 w-full h-[60px]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--gold-pure)] animate-pulse shadow-[0_0_15px_var(--gold-pure)] shrink-0" />
                    <span className="text-sm font-serif text-[var(--gold-pure)] whitespace-nowrap glow-gold-text">جارٍ الاستماع...</span>
                  </div>
                  
                  {/* Fake Audio Waveform */}
                  <div className="flex-1 flex items-center gap-1.5 justify-center overflow-hidden opacity-60 px-6">
                     {[...Array(20)].map((_, i) => (
                       <motion.div
                         key={i}
                         animate={{ height: ['20%', '90%', '20%'] }}
                         transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }}
                         className="w-1 bg-[var(--gold-pure)] rounded-full"
                         style={{ height: '4px' }}
                       />
                     ))}
                  </div>

                  <button
                    type="button"
                    onClick={stopRecording}
                    className="w-12 h-12 shrink-0 rounded-full bg-[var(--glass-hover)] text-[var(--gold-pure)] flex items-center justify-center hover:bg-black/20 transition-all border border-transparent hover:border-[var(--gold-border)]"
                  >
                    <StopCircle size={24} strokeWidth={1.5} />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end w-full"
                >
                  {/* A. INLINE AI MODEL SELECTOR (Far Right RTL) */}
                  <div className="relative shrink-0 pb-1.5 pr-2">
                    <button
                      type="button"
                      onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
                      className="flex items-center gap-2 p-2 rounded-full hover:bg-[var(--glass-hover)] transition-all border border-transparent hover:border-[var(--glass-border)]"
                    >
                      <SageAvatar tier={sageTier} size={28} />
                      <ChevronDown size={14} className="text-[var(--text-secondary)]" />
                    </button>

                    <AnimatePresence>
                      {isModelSelectorOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsModelSelectorOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-[120%] right-0 w-48 glass rounded-2xl p-2 z-50 flex flex-col gap-1 shadow-2xl origin-bottom-right"
                          >
                            {(['standard', 'analytical', 'sovereign'] as SageTier[]).map((tier) => (
                              <button
                                key={tier}
                                type="button"
                                onClick={() => {
                                  setSageTier(tier);
                                  setIsModelSelectorOpen(false);
                                }}
                                className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                                  sageTier === tier 
                                    ? 'bg-[var(--gold-glow)] border-[var(--gold-border)] text-[var(--gold-pure)]' 
                                    : 'hover:bg-[var(--glass-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                              >
                                <SageAvatar tier={tier} size={24} />
                                <span className="font-reem text-sm">{SAGE_PROFILES[tier].name}</span>
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* B. THE TEXT AREA (Center) */}
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={handleInputResize}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                    disabled={isLoading}
                    placeholder={isLoading ? 'تريّث.. الحكيم يستحضر الجواب..' : 'ما الذي يثقل كاهل عقلك اليوم؟'}
                    className="flex-1 bg-transparent px-4 py-4 text-base text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none font-serif w-full resize-none scrollbar-hide mb-1"
                    style={{ minHeight: '56px', maxHeight: '150px' }}
                  />
                  
                  {/* C. THE STEALTH MIC & SEND (Far Left RTL) */}
                  <div className="flex items-center gap-2 pl-2 pb-1.5">
                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 opacity-40 text-[var(--text-primary)] hover:opacity-100 hover:bg-[var(--glass-hover)] shrink-0"
                      title="تحدث"
                    >
                      <Mic size={22} strokeWidth={1.5} />
                    </button>

                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--glass-hover)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--gold-pure)] hover:text-black hover:scale-105 disabled:opacity-20 disabled:hover:bg-[var(--glass-hover)] disabled:hover:text-[var(--text-primary)] disabled:hover:scale-100 transition-all border border-transparent hover:border-[var(--gold-pure)] shrink-0"
                      title="إرسال"
                    >
                      <Send size={18} className="rotate-180" strokeWidth={1.5} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>

    </div>
  );
}
