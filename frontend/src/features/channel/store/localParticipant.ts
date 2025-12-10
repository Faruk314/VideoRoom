import { create } from "zustand";
import type { IParticipant } from "../types/channel";
import type { MediaKind } from "../../media/types/media";

interface LocalParticipantState {
  localParticipant: IParticipant | null;
  setLocalParticipant: (participant: IParticipant) => void;
  updateLocalParticipant: (fields: Partial<IParticipant>) => void;
  removeLocalParticipant: () => void;
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
