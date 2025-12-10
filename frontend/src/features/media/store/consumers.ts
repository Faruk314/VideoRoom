import { create } from "zustand";
import type { Consumer } from "mediasoup-client/types";
import type { MediaKind } from "../types/media";

export interface UserConsumers {
  audio?: Consumer;
  video?: Consumer;
  screen?: Consumer;
}

interface ConsumerState {
  consumers: Map<string, UserConsumers>;
  addConsumer: (userId: string, kind: MediaKind, consumer: Consumer) => void;
  removeConsumer: (userId: string, kind: MediaKind) => void;
  getConsumer: (userId: string, kind: MediaKind) => Consumer | undefined;
  clearUser: (userId: string) => void;
}

export const useConsumerStore = create<ConsumerState>((set, get) => ({
  consumers: new Map(),

  addConsumer: (userId, kind, consumer) => {
    const map = get().consumers;
    const entry = map.get(userId) || {};
    entry[kind] = consumer;
    map.set(userId, entry);
    set({ consumers: map });
  },

  removeConsumer: (userId, kind) => {
    const map = get().consumers;
    const entry = map.get(userId);
    if (!entry) return;
    delete entry[kind];
    map.set(userId, entry);
    set({ consumers: map });
  },

  getConsumer: (userId, kind) => {
    return get().consumers.get(userId)?.[kind];
  },

  clearUser: (userId) => {
    const map = get().consumers;
    map.delete(userId);
    set({ consumers: map });
  },
}));
