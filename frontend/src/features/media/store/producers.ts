import { create } from "zustand";
import type { Producer } from "mediasoup-client/types";
import type { MediaKind } from "../types/media";

type ProducerState = {
  producers: {
    audio: Producer | null;
    video: Producer | null;
    screen: Producer | null;
  };

  setProducer: (type: MediaKind, producer: Producer | null) => void;
  removeProducer: (type: MediaKind) => void;
};

export const useProducerStore = create<ProducerState>((set) => ({
  producers: {
    audio: null,
    video: null,
    screen: null,
  },

  setProducer: (type, producer) =>
    set((state) => ({
      producers: { ...state.producers, [type]: producer },
    })),

  removeProducer: (type) =>
    set((state) => ({
      producers: { ...state.producers, [type]: null },
    })),
}));
