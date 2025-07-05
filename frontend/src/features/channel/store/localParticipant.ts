import { create } from "zustand";
import type { ILocalParticipant } from "../types/channel";
import type { Producer } from "mediasoup-client/types";
import type { MediaKind } from "../../media/types/media";

interface LocalParticipantState {
  localParticipant: ILocalParticipant | null;

  setLocalParticipant: (participant: ILocalParticipant) => void;
  updateLocalParticipant: (fields: Partial<ILocalParticipant>) => void;
  removeLocalParticipant: () => void;

  addProducer: (kind: MediaKind, producer: Producer) => void;
  removeProducer: (kind: MediaKind) => void;

  addStream: (kind: MediaKind, stream: MediaStream) => void;
  removeStream: (kind: MediaKind) => void;
}

export const useLocalParticipantStore = create<LocalParticipantState>(
  (set) => ({
    localParticipant: null,

    setLocalParticipant: (participant) =>
      set(() => ({
        localParticipant: participant,
      })),

    updateLocalParticipant: (fields) =>
      set((state) => {
        if (!state.localParticipant) {
          return state;
        }
        return {
          localParticipant: {
            ...state.localParticipant,
            ...fields,
          },
        };
      }),

    removeLocalParticipant: () =>
      set(() => ({
        localParticipant: null,
      })),

    addProducer: (kind, producer) =>
      set((state) => {
        if (!state.localParticipant) {
          return state;
        }
        return {
          localParticipant: {
            ...state.localParticipant,
            producers: {
              ...state.localParticipant.producers,
              [kind]: producer,
            },
          },
        };
      }),

    removeProducer: (kind) =>
      set((state) => {
        if (!state.localParticipant) {
          return state;
        }
        const newProducers = { ...state.localParticipant.producers };
        delete newProducers[kind];
        return {
          localParticipant: {
            ...state.localParticipant,
            producers: newProducers,
          },
        };
      }),

    addStream: (kind, stream) =>
      set((state) => {
        if (!state.localParticipant) {
          return state;
        }
        return {
          localParticipant: {
            ...state.localParticipant,
            streams: {
              ...state.localParticipant.streams,
              [kind]: stream,
            },
          },
        };
      }),

    removeStream: (kind) =>
      set((state) => {
        if (!state.localParticipant) {
          return state;
        }
        const newStreams = { ...state.localParticipant.streams };
        delete newStreams[kind];
        return {
          localParticipant: {
            ...state.localParticipant,
            streams: newStreams,
          },
        };
      }),
  })
);
