import { IChannel } from "types/types";
import { setupAudioLevelObserver } from "./observer";
import { mediasoupState } from "./state";
import { mediaCodecs } from "msoup/config";
import { Server } from "socket.io";

async function getOrCreateRouter(channelId: string, io?: Server) {
  if (!mediasoupState.worker) throw new Error("Worker not initialized");

  if (mediasoupState.channelMap.has(channelId)) {
    const channel = mediasoupState.channelMap.get(channelId)!;

    return channel.router;
  }

  const router = await mediasoupState.worker.createRouter({ mediaCodecs });

  const audioLevelObserver = await setupAudioLevelObserver(
    router,
    io!,
    channelId
  );

  const newChannel: IChannel = {
    router,
    audioLevelObserver,
    lastActiveSpeaker: null,
  };

  mediasoupState.channelMap.set(channelId, newChannel);

  return router;
}

export { getOrCreateRouter };
