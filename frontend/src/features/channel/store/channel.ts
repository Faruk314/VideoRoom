import { create } from "zustand";
import type { IChannelInfo } from "../types/channel";

interface IDisplayedAvatar {
  participantId: string;
  isDisplayStream?: boolean;
}

interface ChannelState {
  currentChannel: IChannelInfo | null;
  participantsHidden: boolean;
  displayedAvatar: IDisplayedAvatar | null;
  setChannel: (channel: IChannelInfo) => void;
  clearChannel: () => void;
  setDisplayedAvatar: (avatar: IDisplayedAvatar | null) => void;
  setParticipantsVisibility: (state: boolean) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  currentChannel: null,
  participantsHidden: false,
  displayedAvatar: null,
  setChannel: (channel) => set({ currentChannel: channel }),
  clearChannel: () => set({ currentChannel: null }),
  setDisplayedAvatar: (avatar) => set({ displayedAvatar: avatar }),
  setParticipantsVisibility: (state) => set({ participantsHidden: state }),
}));
