import { create } from "zustand";

interface MusicSearchState {
  name: string;
  set: (name: string) => void;
  reset: () => void;
}

const initialState = {
  name: "",
};

export const useMusicSearchStore = create<MusicSearchState>((set) => ({
  ...initialState,
  set: (name: string) => set((state) => ({ ...state, name })),
  reset: () => set((state) => ({ ...state, ...initialState })),
}));
