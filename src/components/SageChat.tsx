'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, HeartPulse } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  role: 'user' | 'sage';
  content: string;
}

export default function SageChat() {
  const persona = useStore((state) => state.sagePersona);
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'sage',
      content: `I am ${persona}. Speak your mind, and let us untangle the threads together.`,
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    triggerHaptic();

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const lowerInput = userMsg.content.toLowerCase();
    
    // Semantic Routing: Distress detection
    if (lowerInput.includes('suicide') || lowerInput.includes('hopeless') || lowerInput.includes('end it all')) {
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'sage',
          content: "I sense a deep darkness in your words. The storm is blinding, but you do not have to weather it alone. The Stoic Emergency Protocol is engaged. Please, breathe. Let us ground ourselves in the present moment.",
        }]);
        setIsTyping(false);
        // Haptic alert
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([100, 50, 100, 50, 200]);
        }
      }, 1500);
      return;
    }

    // Dynamic delay 2000ms - 4500ms based on complexity (mocked by string length)
    const complexityDelay = Math.min(Math.max(2000, userMsg.content.length * 50), 4500);

    setTimeout(() => {
      const sageReply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'sage',
        content: `You say "${userMsg.content}". Yet, is it the truth, or merely a reflection of your current turbulence? Reflect upon this.`,
      };
      setMessages((prev) => [...prev, sageReply]);
      setIsTyping(false);
    }, complexityDelay);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-[#0A0A0A]/90 backdrop-blur-3xl rounded-xl overflow-hidden shadow-2xl relative" style={{ boxShadow: 'inset 0 0 0 1px rgba(212, 175, 55, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
      {/* Subtle top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#D4AF37]/10 bg-[#030303]/50 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-[#0A0A0A] flex items-center justify-center border border-[#D4AF37]/20 text-[#D4AF37] relative">
            <Bot size={24} />
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-[#D4AF37] z-[-1] shadow-[0_0_15px_rgba(212,175,55,0.5)]"
              />
            )}
          </div>
          <div>
            <h2 className="text-xl font-serif text-[#EAEAEA] tracking-wide">{persona}</h2>
            <p className="text-[10px] text-[#D4AF37]/70 uppercase tracking-[0.2em] font-light">The Cognitive Mentor</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={cn(
                "flex w-full",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] flex items-start space-x-4",
                msg.role === 'user' && "flex-row-reverse space-x-reverse"
              )}>
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 border",
                  msg.role === 'user' ? "bg-white/5 border-white/10 text-white" : "bg-[#0A0A0A] text-[#D4AF37] border-[#D4AF37]/20"
                )}>
                  {msg.role === 'user' ? <User size={14} /> : (msg.content.includes("Emergency Protocol") ? <HeartPulse size={14} className="text-red-500" /> : <Bot size={14} />)}
                </div>
                <div className={cn(
                  "p-5 text-[15px] leading-[1.8] font-serif",
                  msg.role === 'user' 
                    ? "text-[#EAEAEA] border-b border-[#D4AF37]/20 text-right" 
                    : "bg-[#030303]/60 text-[#EAEAEA] rounded-xl border border-white/5 shadow-inner",
                  msg.content.includes("Emergency Protocol") && "border-red-500/30 bg-red-950/20 text-red-100"
                )}>
                  {msg.content}
                  {msg.content.includes("Emergency Protocol") && (
                    <button 
                      onClick={() => router.push('/journal')}
                      className="mt-4 block w-full py-2 px-4 bg-red-900/40 hover:bg-red-900/60 text-white rounded-lg transition-colors border border-red-500/30 uppercase tracking-widest text-xs font-sans text-center"
                    >
                      Enter Catharsis Chamber
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-start space-x-4"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0A0A0A] flex items-center justify-center mt-1 border border-[#D4AF37]/20 text-[#D4AF37]">
                <Bot size={14} />
              </div>
              <div className="p-4 rounded-xl bg-[#030303]/60 text-[#888888] border border-white/5 flex flex-col space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/70">The Sage is contemplating...</p>
                <div className="flex space-x-2 items-center h-2">
                  <motion.div className="w-1.5 h-1.5 bg-[#D4AF37]/50 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0 }} />
                  <motion.div className="w-1.5 h-1.5 bg-[#D4AF37]/50 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.3 }} />
                  <motion.div className="w-1.5 h-1.5 bg-[#D4AF37]/50 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.6 }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-[#030303]/80 border-t border-white/5 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder={isTyping ? "Patience..." : "Speak your truth..."}
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-full py-4 pl-6 pr-14 text-white placeholder-[#888888] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-all font-serif text-lg shadow-inner"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="absolute right-3 p-3 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
