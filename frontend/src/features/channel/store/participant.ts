import { create } from "zustand";
import type { ILocalParticipant, IParticipant } from "../types/channel";

interface ParticipantState {
  localParticipant: ILocalParticipant | null;
  participants: Map<string, IParticipant>;

  setLocalParticipant: (participant: ILocalParticipant) => void;
  updateLocalParticipant: (fields: Partial<ILocalParticipant>) => void;
  removeLocalParticipant: () => void;

  setParticipants: (participants: IParticipant[]) => void;
  addParticipant: (participant: IParticipant) => void;
  removeParticipant: (userId: string) => void;
  updateParticipant: (userId: string, fields: Partial<IParticipant>) => void;
}

export const useParticipantStore = create<ParticipantState>((set) => ({
  localParticipant: null,
  participants: new Map(),

  setLocalParticipant: (participant) =>
    set(() => ({
      localParticipant: participant,
    })),

  updateLocalParticipant: (fields) =>
    set((state) => {
      if (!state.localParticipant) return {};
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

  setParticipants: (participants) =>
    set(() => {
      const participantMap = new Map<string, IParticipant>();
      participants.forEach((p) => {
        participantMap.set(p.user.userId, p);
      });
      return { participants: participantMap };
    }),

  addParticipant: (participant) =>
    set((state) => {
      const updated = new Map(state.participants);
      updated.set(participant.user.userId, participant);
      return { participants: updated };
    }),

  removeParticipant: (userId) =>
    set((state) => {
      const updated = new Map(state.participants);
      updated.delete(userId);
      return { participants: updated };
    }),

  updateParticipant: (userId, fields) =>
    set((state) => {
      const updated = new Map(state.participants);
      const participant = updated.get(userId);
      if (participant) {
        updated.set(userId, { ...participant, ...fields });
      }
      return { participants: updated };
    }),
}));
