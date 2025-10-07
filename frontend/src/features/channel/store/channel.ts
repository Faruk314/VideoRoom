import { create } from "zustand";

interface IDisplayedAvatar {
  participantId: string;
  isDisplayStream?: boolean;
  isFullScreen?: boolean;
}

interface ChannelState {
  isHovering: boolean;
  participantsHidden: boolean;
  displayedAvatar: IDisplayedAvatar | null;
  speakingMap: Record<string, boolean>;
  setDisplayedAvatar: (avatar: IDisplayedAvatar | null) => void;
  setIsHovering: (state: boolean) => void;
  setParticipantsVisibility: (state: boolean) => void;
  setSpeaking: (id: string, speaking: boolean) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  isHovering: false,
  participantsHidden: false,
  displayedAvatar: null,
  speakingMap: {},
  setDisplayedAvatar: (avatar) => set({ displayedAvatar: avatar }),
  setIsHovering: (state) => set({ isHovering: state }),
  setParticipantsVisibility: (state) => set({ participantsHidden: state }),
  setSpeaking: (id, speaking) =>
    set((state) => ({
      speakingMap: { ...state.speakingMap, [id]: speaking },
    })),
}));
