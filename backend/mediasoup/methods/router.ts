import { mediasoupState } from "./state";
import { mediaCodecs } from "mediasoup/config";

async function getOrCreateRouter(channelId: string) {
  if (!mediasoupState.worker) throw new Error("Worker not initialized");

  if (mediasoupState.routerMap.has(channelId)) {
    return mediasoupState.routerMap.get(channelId)!;
  }

  const router = await mediasoupState.worker.createRouter({ mediaCodecs });
  mediasoupState.routerMap.set(channelId, router);
  return router;
}

export { getOrCreateRouter };
