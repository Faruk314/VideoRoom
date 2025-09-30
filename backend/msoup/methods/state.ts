import { types } from "mediasoup";
import { IChannel } from "types/types";

export type MediasoupState = {
  worker: types.Worker | null;
  channelMap: Map<string, IChannel>;
};

export const mediasoupState: MediasoupState = {
  worker: null,
  channelMap: new Map(),
};
