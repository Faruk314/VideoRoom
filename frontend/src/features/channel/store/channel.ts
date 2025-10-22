import { create } from "zustand";
import type { IChannelInfo } from "../types/channel";

interface IDisplayedAvatar {
  participantId: string;
  isDisplayStream?: boolean;
  isFullScreen?: boolean;
}

interface ChannelState {
  currentChannel: IChannelInfo | null;
  isHovering: boolean;
  participantsHidden: boolean;
  displayedAvatar: IDisplayedAvatar | null;
  speakingMap: Record<string, boolean>;
  setChannel: (channel: IChannelInfo) => void;
  clearChannel: () => void;
  setDisplayedAvatar: (avatar: IDisplayedAvatar | null) => void;
  setIsHovering: (state: boolean) => void;
  setParticipantsVisibility: (state: boolean) => void;
  setSpeaking: (id: string, speaking: boolean) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  currentChannel: null,
  isHovering: false,
  participantsHidden: false,
  displayedAvatar: null,
  speakingMap: {},
  setChannel: (channel) => set({ currentChannel: channel }),
  clearChannel: () => set({ currentChannel: null }),
  setDisplayedAvatar: (avatar) => set({ displayedAvatar: avatar }),
  setIsHovering: (state) => set({ isHovering: state }),
  setParticipantsVisibility: (state) => set({ participantsHidden: state }),
  setSpeaking: (id, speaking) =>
    set((state) => ({
      speakingMap: { ...state.speakingMap, [id]: speaking },
    })),
}));
