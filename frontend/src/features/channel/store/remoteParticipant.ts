import { create } from "zustand";
import type { IParticipant } from "../types/channel";
import type { MediaKind } from "../../media/types/media";

interface ParticipantState {
  participants: Map<string, IParticipant>;

  setParticipants: (participants: IParticipant[]) => void;
  addParticipant: (participant: IParticipant) => void;
  getParticipant: (userId: string) => IParticipant | undefined;
  removeParticipant: (userId: string) => void;
  updateParticipant: (userId: string, fields: Partial<IParticipant>) => void;
  addStream: (
    userId: string,
    type: MediaKind,
    stream: MediaStream | undefined
  ) => void;
  removeStream: (userId: string, type: MediaKind) => void;
}

export const useParticipantStore = create<ParticipantState>((set, get) => ({
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

  getParticipant: (userId) => {
    return get().participants.get(userId);
  },

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

  addStream: (userId, type, stream) =>
    set((state) => {
      const updated = new Map(state.participants);
      const participant = updated.get(userId);
      if (participant) {
        updated.set(userId, {
          ...participant,
          streams: { ...participant.streams, [type]: stream },
        });
      }
      return { participants: updated };
    }),

  removeStream: (userId, type) =>
    set((state) => {
      const updated = new Map(state.participants);
      const participant = updated.get(userId);
      if (participant && participant.streams && participant.streams[type]) {
        const newStreams = { ...participant.streams };
        delete newStreams[type];
        updated.set(userId, { ...participant, streams: newStreams });
      }
      return { participants: updated };
    }),
}));
