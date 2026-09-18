import { create } from 'zustand';

interface VideoState {
  videoSrc: string | null;
  isFading: boolean;
  setVideoSrc: (src: string | null) => void;
  setFading: (fading: boolean) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  videoSrc: null,
  isFading: false,
  setVideoSrc: (src) => set({ videoSrc: src }),
  setFading: (fading) => set({ isFading: fading }),
}));

