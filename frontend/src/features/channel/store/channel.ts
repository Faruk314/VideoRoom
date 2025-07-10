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
  displayedAvatar: IDisplayedAvatar | null;
  setDisplayedAvatar: (avatar: IDisplayedAvatar | null) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  displayedAvatar: null,
  setDisplayedAvatar: (avatar) => set({ displayedAvatar: avatar }),
}));
