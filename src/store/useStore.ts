import { create } from 'zustand';

interface AppState {
  currentMood: string | null;
  setMood: (mood: string) => void;
  sagePersona: string;
  setSagePersona: (persona: string) => void;
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  currentMood: null,
  setMood: (mood) => set({ currentMood: mood }),
  sagePersona: 'Marcus Aurelius', // Default mentor
  setSagePersona: (persona) => set({ sagePersona: persona }),
  isPro: false,
  setIsPro: (isPro) => set({ isPro }),
}));

