'use client';

import React, { useState } from 'react';
import { useAudioEngine } from '@/hooks/useAudioEngine';

export default function AudioDemo() {
  const { 
    isRecording, 
    isSpeaking, 
    audioBlob, 
    error, 
    startRecording, 
    stopRecording, 
    speak, 
    stopSpeaking 
  } = useAudioEngine();

  const [persona, setPersona] = useState("Avicenna");
  const sampleText = "Welcome to the Mind in Box sanctuary. I am listening to your thoughts with profound attention and unconditional regard.";

  const handlePlayAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div className="p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-playfair mb-4 text-center">Audio Engine Core</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Text-to-Speech Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-tajawal text-gray-300">The Sage Speaks</h3>
          
          <select 
            value={persona} 
            onChange={(e) => setPersona(e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white"
          >
            <option value="Avicenna">Avicenna (Calm, Deep)</option>
            <option value="Dostoevsky">Dostoevsky (Intense, Rapid)</option>
            <option value="Hypatia">Hypatia (Clear, Measured)</option>
            <option value="Default">Default Voice</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => isSpeaking ? stopSpeaking() : speak(sampleText, persona)}
              className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
                isSpeaking 
                  ? 'bg-amber-600/80 hover:bg-amber-600' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {isSpeaking ? 'Pause the Sage' : 'Listen to the Sage'}
            </button>
          </div>
        </div>

        {/* Speech-to-Text Section */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <h3 className="text-lg font-tajawal text-gray-300">Your Voice</h3>
          
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`w-full py-3 px-4 rounded-full font-medium transition-all ${
              isRecording 
                ? 'bg-red-600 scale-95 shadow-[0_0_15px_rgba(220,38,38,0.6)]' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {isRecording ? 'Listening...' : 'Hold to Record your thought'}
          </button>

          {audioBlob && !isRecording && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-green-400">Audio captured successfully</span>
              <button 
                onClick={handlePlayAudio}
                className="text-xs bg-white/10 hover:bg-white/20 py-1 px-2 rounded"
              >
                Playback
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

