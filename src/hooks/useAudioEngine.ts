'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export type PersonaParams = {
  name: string;
  pitch: number;
  rate: number;
  genderPref: 'male' | 'female' | 'any';
};

interface AudioEngineState {
  isRecording: boolean;
  isSpeaking: boolean;
  audioBlob: Blob | null;
  error: string | null;
  transcription: string | null;
}

export const useAudioEngine = () => {
  const [state, setState] = useState<AudioEngineState>({
    isRecording: false,
    isSpeaking: false,
    audioBlob: null,
    error: null,
    transcription: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const setError = (error: string) => {
    setState(prev => ({ ...prev, error }));
  };

  // --- Speech-to-Text (Microphone -> Whisper API) ---
  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null, audioBlob: null, transcription: null }));
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setState(prev => ({ ...prev, isRecording: false, audioBlob }));
        stream.getTracks().forEach(track => track.stop());

        // Process STT immediately
        try {
          const formData = new FormData();
          formData.append('file', new File([audioBlob], 'audio.webm', { type: 'audio/webm' }));
          
          const res = await fetch('/api/audio/stt', {
            method: 'POST',
            body: formData,
          });
          
          if (res.ok) {
            const data = await res.json();
            setState(prev => ({ ...prev, transcription: data.text }));
          } else {
            setError('Transcription failed.');
          }
        } catch (err) {
          setError('Failed to reach STT service.');
        }
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

  // --- Text-to-Speech (OpenAI TTS API) ---
  const speak = useCallback(async (text: string, personaName: string = "Default") => {
    try {
      // Cancel any ongoing speech
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = '';
      }

      setState(prev => ({ ...prev, isSpeaking: true, error: null }));

      const response = await fetch('/api/audio/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voiceId: personaName }),
      });

      if (!response.ok) {
        throw new Error('TTS Failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      currentAudioRef.current = audio;

      audio.onended = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setError('Error playing audio.');
        setState(prev => ({ ...prev, isSpeaking: false }));
      };

      await audio.play();
    } catch (err) {
      console.error('TTS execution error:', err);
      setError('Could not generate or play audio.');
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
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

