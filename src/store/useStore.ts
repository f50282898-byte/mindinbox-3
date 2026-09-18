import { create } from 'zustand';

export type SageTier = 'standard' | 'analytical' | 'sovereign';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  isPro: boolean;
}

interface AppState {
  user: UserProfile;
  setDisplayName: (name: string) => void;
  setPhone: (phone: string) => void;
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
  sageTier: SageTier;
  setSageTier: (tier: SageTier) => void;
  currentMood: string | null;
  setMood: (mood: string) => void;
  activeBinaural: string | null;
  setActiveBinaural: (track: string | null) => void;
  disciplineLog: Record<string, boolean>;
  toggleDiscipline: (key: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: {
    uid: 'sovereign_user_01',
    displayName: 'السالك المستنير',
    email: 'salik@mindinbox.io',
    phone: '',
    isPro: false,
  },
  setDisplayName: (name: string) =>
    set((state) => ({ user: { ...state.user, displayName: name } })),
  setPhone: (phone: string) =>
    set((state) => ({ user: { ...state.user, phone } })),
  isPro: false,
  setIsPro: (isPro: boolean) =>
    set((state) => ({ isPro, user: { ...state.user, isPro } })),
  sageTier: 'standard',
  setSageTier: (tier: SageTier) => set({ sageTier: tier }),
  currentMood: 'هادئ متأمّل',
  setMood: (mood: string) => set({ currentMood: mood }),
  activeBinaural: null,
  setActiveBinaural: (track: string | null) => set({ activeBinaural: track }),
  disciplineLog: {
    'يقظة الفجر': true,
    'تأمل الصمت': true,
    'جرد المساء': false,
    'قراءة أثر': true,
    'صيام الفكر': false,
  },
  toggleDiscipline: (key: string) =>
    set((state) => ({
      disciplineLog: {
        ...state.disciplineLog,
        [key]: !state.disciplineLog[key],
      },
    })),
}));
