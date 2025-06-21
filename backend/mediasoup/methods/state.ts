import { types } from "mediasoup";

export type MediasoupState = {
  worker: types.Worker | null;
  routerMap: Map<string, types.Router>;
};

export const mediasoupState: MediasoupState = {
  worker: null,
  routerMap: new Map(),
};
