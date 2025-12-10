import { create } from "zustand";

interface ChannelVoiceState {
  speakingMap: Record<string, boolean>;

  setSpeaking: (id: string, speaking: boolean) => void;
}

export const useChannelVoiceStore = create<ChannelVoiceState>((set) => ({
  speakingMap: {},

  setSpeaking: (id, speaking) =>
    set((state) => ({
      speakingMap: { ...state.speakingMap, [id]: speaking },
    })),
}));
