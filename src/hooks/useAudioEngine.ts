'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export type PersonaParams = {
  name: string;
  pitch: number;
  rate: number;
  genderPref: 'male' | 'female' | 'any';
};

const PERSONA_CONFIGS: Record<string, PersonaParams> = {
  "Avicenna": { name: "Avicenna", pitch: 0.8, rate: 0.9, genderPref: 'male' },
  "Dostoevsky": { name: "Dostoevsky", pitch: 1.1, rate: 1.0, genderPref: 'male' },
  "Hypatia": { name: "Hypatia", pitch: 1.0, rate: 0.95, genderPref: 'female' },
  "Default": { name: "Default", pitch: 1.0, rate: 1.0, genderPref: 'any' }
};

interface AudioEngineState {
  isRecording: boolean;
  isSpeaking: boolean;
  audioBlob: Blob | null;
  error: string | null;
}

export const useAudioEngine = () => {
  const [state, setState] = useState<AudioEngineState>({
    isRecording: false,
    isSpeaking: false,
    audioBlob: null,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      // Trigger voice loading
      synthRef.current.getVoices();
    }
  }, []);

  const setError = (error: string) => {
    setState(prev => ({ ...prev, error }));
  };

  // --- Speech-to-Text (Microphone) ---
  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null, audioBlob: null }));
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setState(prev => ({ ...prev, isRecording: false, audioBlob }));
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setState(prev => ({ ...prev, isRecording: true }));
    } catch (err: any) {
      console.error('Microphone access denied or error:', err);
      let errorMessage = 'Failed to access microphone.';
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Microphone permission denied. Please allow access in your browser settings.';
      }
      setError(errorMessage);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // --- Text-to-Speech (Dynamic Voices) ---
  const speak = useCallback((text: string, personaName: string = "Default") => {
    if (!synthRef.current) {
      setError('Text-to-speech is not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const config = PERSONA_CONFIGS[personaName] || PERSONA_CONFIGS["Default"];
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.pitch = config.pitch;
    utterance.rate = config.rate;

    // Try to select an appropriate voice
    const voices = synthRef.current.getVoices();
    if (voices.length > 0) {
      // Find voices matching the gender preference if possible
      // (Note: The Web Speech API doesn't officially expose gender, 
      // but we can try to guess based on name/URI or just pick a good default)
      let selectedVoice = voices.find(v => v.lang.startsWith('en')); // default to English
      
      // Basic heuristic for demo purposes
      if (config.genderPref === 'male') {
        selectedVoice = voices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('david')) || selectedVoice;
      } else if (config.genderPref === 'female') {
        selectedVoice = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl') || v.name.toLowerCase().includes('zira')) || selectedVoice;
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => setState(prev => ({ ...prev, isSpeaking: true }));
    utterance.onend = () => setState(prev => ({ ...prev, isSpeaking: false }));
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setState(prev => ({ ...prev, isSpeaking: false }));
    };

    synthRef.current.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    speak,
    stopSpeaking
  };
};

