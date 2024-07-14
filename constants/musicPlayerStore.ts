import { create } from "zustand";

interface MusicPlayerState {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  image: string;
  isPlayed: boolean;
  bgColor: string[];
  set: (data: Partial<MusicPlayerState>) => void;
  reset: () => void;
}

const initialState = {
  id: "",
  title: "",
  artist: "",
  duration: 0,
  url: "",
  image: "",
  isPlayed: false,
  bgColor: [],
};

export const useMusicPlayerStore = create<MusicPlayerState>((set) => ({
  ...initialState,
  set: (data: Partial<MusicPlayerState>) =>
    set((state) => ({
      ...state,
      ...data,
    })),
  reset: () => set((state) => ({ ...state, ...initialState })),
}));
