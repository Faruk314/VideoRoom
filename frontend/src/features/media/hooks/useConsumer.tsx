import type { types } from "mediasoup-client";
import { useParticipantStore } from "../../channel/store/remoteParticipant";
import { useMediasoupStore } from "../store/mediasoup";
import type { MediaKind } from "../types/media";
import { useConsumerStore } from "../store/consumers";
import { createStreamFromTracks } from "../../channel/utils/channel";

export default function useConsumer() {
  const { updateParticipant, addStream, removeStream } = useParticipantStore();
  const { addConsumer, removeConsumer } = useConsumerStore();

  async function setupConsumer(consumerData: {
    id: string;
    producerId: string;
    userId: string;
    kind: types.MediaKind;
    rtpParameters: types.RtpParameters;
    appData: types.AppData;
  }) {
    const { recvTransport } = useMediasoupStore.getState();

    if (!recvTransport)
      throw new Error("Missing recv transport in consumer setup");

    try {
      const consumer = await recvTransport.consume({
        id: consumerData.id,
        producerId: consumerData.producerId,
        kind: consumerData.kind,
        rtpParameters: consumerData.rtpParameters,
        appData: consumerData.appData,
      });

      const consumerType = consumerData.appData.streamType as MediaKind;

      if (consumerType === "video")
        updateParticipant(consumerData.userId, { camMuted: false });

      if (consumerType === "screen")
        updateParticipant(consumerData.userId, { isStreaming: true });

      if (consumerType === "audio")
        updateParticipant(consumerData.userId, { micMuted: false });

      addConsumer(consumerData.userId, consumerType, consumer);

      const stream = createStreamFromTracks(consumer.track);

      addStream(consumerData.userId, consumerType, stream);

      const callback = () => {
        removeConsumer(consumerData.userId, consumerType);
        removeStream(consumerData.userId, consumerType);
      };

      consumer.on("transportclose", callback);

      consumer.on("@close", callback);

      consumer.on("trackended", callback);

      consumer.on("@resume", () => consumer.resume());

      consumer.on("@pause", () => consumer.pause());
    } catch (error) {
      console.error(error);
      throw new Error("Failed to setup consumer");
    }
  }

  return { setupConsumer };
}
