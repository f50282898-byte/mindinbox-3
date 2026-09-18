'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Radio } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface FrequencyPreset {
  id: string;
  name: string;
  sub: string;
  carrier: number;
  beat: number;
  description: string;
}

const PRESETS: FrequencyPreset[] = [
  {
    id: '432hz',
    name: 'ذبذبة التناغم الكوني (432Hz)',
    sub: 'سكينة الروح وترميم الشتات',
    carrier: 432,
    beat: 4.0, // Theta wave 4Hz
    description: 'تردد الصفاء الذهني وتسكين ضجيج الأفكار المتسارعة.',
  },
  {
    id: 'schumann',
    name: 'رنين شومان الأرضي (7.83Hz)',
    sub: 'التجذر والارتباط بالطبيعة',
    carrier: 208,
    beat: 7.83, // Schumann resonance
    description: 'نبض كوكب الأرض لضبط الإيقاع البيولوجي والنفسي.',
  },
  {
    id: 'focus',
    name: 'موجة التركيز العميق (14Hz)',
    sub: 'اليقظة الصارمة والسيادة الذهنية',
    carrier: 320,
    beat: 14.0, // Beta wave
    description: 'استحضار الحضور الفكري الكامل لكتابة الأثر وحل المعضلات.',
  },
];

export default function BinauralEngine() {
  const { activeBinaural, setActiveBinaural } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('432hz');
  const [volume, setVolume] = useState(0.3);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const leftOscRef = useRef<OscillatorNode | null>(null);
  const rightOscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const stopAudio = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.2);
        setTimeout(() => {
          leftOscRef.current?.stop();
          rightOscRef.current?.stop();
          leftOscRef.current?.disconnect();
          rightOscRef.current?.disconnect();
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
        }, 250);
      } catch (e) {
        console.warn('Audio cleanup issue:', e);
      }
    }
    setIsPlaying(false);
    setActiveBinaural(null);
  };

  const startAudio = (preset: FrequencyPreset) => {
    stopAudio();

    setTimeout(() => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.8);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Left Channel
        const merger = ctx.createChannelMerger(2);
        const leftOsc = ctx.createOscillator();
        leftOsc.type = 'sine';
        leftOsc.frequency.setValueAtTime(preset.carrier, ctx.currentTime);
        leftOsc.connect(merger, 0, 0);

        // Right Channel
        const rightOsc = ctx.createOscillator();
        rightOsc.type = 'sine';
        rightOsc.frequency.setValueAtTime(preset.carrier + preset.beat, ctx.currentTime);
        rightOsc.connect(merger, 0, 1);

        merger.connect(masterGain);

        leftOsc.start();
        rightOsc.start();

        leftOscRef.current = leftOsc;
        rightOscRef.current = rightOsc;

        setIsPlaying(true);
        setActiveBinaural(preset.name);
      } catch (err) {
        console.error('Failed to initialize Web Audio Binaural Beats:', err);
      }
    }, 150);
  };

  const togglePlay = (preset: FrequencyPreset) => {
    if (isPlaying && selectedId === preset.id) {
      stopAudio();
    } else {
      setSelectedId(preset.id);
      startAudio(preset);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current && isPlaying) {
      gainNodeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.1);
    }
  }, [volume, isPlaying]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/20 shadow-[0_15px_35px_rgba(0,0,0,0.6)] relative overflow-hidden" dir="rtl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isPlaying ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-pulse' : 'bg-white/5 border-white/10 text-[#888888]'}`}>
            <Radio size={18} />
          </div>
          <div>
            <h3 className="font-serif text-lg text-[#EAEAEA] font-semibold flex items-center gap-2">
              هندسة المزاج (الترددات الثنائية)
            </h3>
            <p className="text-[11px] text-[#888888]">موجات صوتية متزامنة لضبط وتوجيه كيمياء الوعي (يُفضل استخدام سماعات الرأس)</p>
          </div>
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
          {volume === 0 ? <VolumeX size={14} className="text-[#888888]" /> : <Volume2 size={14} className="text-[#D4AF37]" />}
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 accent-[#D4AF37] h-1 bg-white/10 rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRESETS.map((preset) => {
          const isThisActive = isPlaying && selectedId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => togglePlay(preset)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 relative group flex flex-col justify-between ${
                isThisActive
                  ? 'bg-gradient-to-b from-[#D4AF37]/15 to-[#0A0A0A] border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                  : 'bg-white/[0.02] border-white/5 hover:border-[#D4AF37]/30 hover:bg-white/[0.04]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#EAEAEA] group-hover:text-[#D4AF37] transition-colors">
                    {preset.name}
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isThisActive ? 'bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-white/5 text-[#888888] group-hover:text-white'
                  }`}>
                    {isThisActive ? <Pause size={12} /> : <Play size={12} className="mr-0.5" />}
                  </div>
                </div>
                <p className="text-[11px] text-[#D4AF37]/80 font-serif mb-2">{preset.sub}</p>
                <p className="text-[10px] text-[#888888] leading-relaxed">{preset.description}</p>
              </div>

              {isThisActive && (
                <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#D4AF37]/20 text-[10px] text-[#D4AF37]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                  <span>التردد يعمل بسلاسة في الخلفية...</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

