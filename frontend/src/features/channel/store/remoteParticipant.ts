import { create } from "zustand";
import type { IParticipant } from "../types/channel";
import type { MediaKind } from "../../media/types/media";
import type { Consumer } from "mediasoup-client/types";

interface ParticipantState {
  participants: Map<string, IParticipant>;

  setParticipants: (participants: IParticipant[]) => void;
  addParticipant: (participant: IParticipant) => void;
  removeParticipant: (userId: string) => void;
  updateParticipant: (userId: string, fields: Partial<IParticipant>) => void;

  updateParticipantConsumers: (
    userId: string,
    consumerType: MediaKind,
    consumer: Consumer
  ) => void;

  removeParticipantConsumer: (userId: string, consumerType: MediaKind) => void;
}

export const useParticipantStore = create<ParticipantState>((set) => ({
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

  updateParticipantConsumers: (userId, consumerType, consumer) =>
    set((state) => {
      const updated = new Map(state.participants);
      const participant = updated.get(userId);

      if (!participant) {
        return { participants: updated };
      }

      const newConsumers = {
        ...participant.consumers,
        [consumerType]: consumer,
      };

      updated.set(userId, {
        ...participant,
        consumers: newConsumers,
      });

      return { participants: updated };
    }),

  removeParticipantConsumer: (userId, consumerType) =>
    set((state) => {
      const updated = new Map(state.participants);
      const participant = updated.get(userId);

      if (!participant) {
        return { participants: updated };
      }

      const newConsumers = { ...participant.consumers };
      delete newConsumers[consumerType];

      updated.set(userId, {
        ...participant,
        consumers: newConsumers,
      });

      return { participants: updated };
    }),
}));
