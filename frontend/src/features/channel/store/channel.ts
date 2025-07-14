import { create } from "zustand";
import type { IParticipant } from "../types/channel";
import type { Consumer } from "mediasoup-client/types";

interface IDisplayedAvatar {
  participant: Omit<IParticipant, "consumers">;
  consumer?: Consumer | null;
  stream?: MediaStream | null;
  isDisplayStream?: boolean;
  muteCamera?: boolean;
  isFullScreen?: boolean;
}

interface ChannelState {
  isHovering: boolean;
  displayedAvatar: IDisplayedAvatar | null;
  setDisplayedAvatar: (avatar: IDisplayedAvatar | null) => void;
  setIsHovering: (state: boolean) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  isHovering: false,
  displayedAvatar: null,
  setDisplayedAvatar: (avatar) => set({ displayedAvatar: avatar }),
  setIsHovering: (state) => set({ isHovering: state }),
}));
