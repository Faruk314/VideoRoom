import { create } from "zustand";
import type { IParticipant } from "../types/channel";

interface ChannelState {
  participants: Map<string, IParticipant>;

  setParticipants: (participants: IParticipant[]) => void;
  addParticipant: (participant: IParticipant) => void;
  removeParticipant: (userId: string) => void;
  updateParticipant: (userId: string, fields: Partial<IParticipant>) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  participants: new Map(),

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
