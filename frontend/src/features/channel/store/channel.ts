import { create } from "zustand";
import type { Consumer } from "mediasoup-client/types";

interface IDisplayedAvatar {
  participantId: string;
  consumer?: Consumer | null;
  stream?: MediaStream | null;
  isDisplayStream?: boolean;
  muteCamera?: boolean;
  isFullScreen?: boolean;
}

interface ChannelState {
  isHovering: boolean;
  participantsHidden: boolean;
  displayedAvatar: IDisplayedAvatar | null;
  setDisplayedAvatar: (avatar: IDisplayedAvatar | null) => void;
  setIsHovering: (state: boolean) => void;
  setParticipantsVisibility: (state: boolean) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  isHovering: false,
  participantsHidden: false,
  displayedAvatar: null,
  setDisplayedAvatar: (avatar) => set({ displayedAvatar: avatar }),
  setIsHovering: (state) => set({ isHovering: state }),
  setParticipantsVisibility: (state) => set({ participantsHidden: state }),
}));
