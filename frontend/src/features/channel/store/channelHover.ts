import { create } from "zustand";

interface HoverState {
  isHovering: boolean;
  setIsHovering: (state: boolean) => void;
}

export const useChannelHoverStore = create<HoverState>((set) => ({
  isHovering: false,
  setIsHovering: (state) => set({ isHovering: state }),
}));
