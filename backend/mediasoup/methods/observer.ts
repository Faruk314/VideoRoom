import { Router } from "mediasoup/types";
import { Server } from "socket.io";
import { mediasoupState } from "./state";

async function setupAudioLevelObserver(
  router: Router,
  io: Server,
  channelId: string
) {
  const audioLevelObserver = await router.createAudioLevelObserver({
    maxEntries: 1,
    threshold: -50,
    interval: 300,
  });

  audioLevelObserver.on("volumes", (volumes) => {
    const channel = mediasoupState.channelMap.get(channelId);
    if (!channel) return;

    if (volumes.length === 0) return;

    const { producer, volume } = volumes[0];
    const userId = producer.appData.userId;
    if (!userId) return;

    io.to(channelId).emit("participantSpeaking", {
      userId,
      volume,
    });

    channel.lastActiveSpeaker = userId as string;
  });

  audioLevelObserver.on("silence", () => {
    const channel = mediasoupState.channelMap.get(channelId);
    if (!channel || !channel.lastActiveSpeaker) return;

    io.to(channelId).emit("participantSilence", {
      userId: channel.lastActiveSpeaker,
    });
  });

  return audioLevelObserver;
}

export { setupAudioLevelObserver };
