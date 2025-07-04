import { create } from "zustand";
import { Device, types } from "mediasoup-client";

type MediasoupState = {
  device: Device | null;
  sendTransport: types.Transport | null;
  recvTransport: types.Transport | null;

  setDevice: (device: Device | null) => void;

  setSendTransport: (transport: types.Transport | null) => void;
  setRecvTransport: (transport: types.Transport | null) => void;

  resetMediasoupState: () => void;
};

export const useMediasoupStore = create<MediasoupState>((set) => ({
  device: null,
  sendTransport: null,
  recvTransport: null,

  setDevice: (device) => set({ device }),
  setSendTransport: (sendTransport) => set({ sendTransport }),
  setRecvTransport: (recvTransport) => set({ recvTransport }),

  resetMediasoupState: () =>
    set({
      device: null,
      sendTransport: null,
      recvTransport: null,
    }),
}));
