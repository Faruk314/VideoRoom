import type { types } from "mediasoup-client";
import { useParticipantStore } from "../../channel/store/remoteParticipant";
import { useMediasoupStore } from "../store/mediasoup";
import type { MediaKind } from "../types/media";

export default function useConsumer() {
  const {
    updateParticipantConsumers,
    removeParticipantConsumer,
    updateParticipant,
  } = useParticipantStore();

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

      updateParticipantConsumers(consumerData.userId, consumerType, consumer);

      consumer.on("transportclose", () => {
        removeParticipantConsumer(consumerData.userId, consumerType);
      });

      consumer.on("@close", () => {
        removeParticipantConsumer(consumerData.userId, consumerType);
      });

      consumer.on("trackended", () => {
        removeParticipantConsumer(consumerData.userId, consumerType);
      });

      consumer.on("@resume", () => consumer.resume());

      consumer.on("@pause", () => consumer.pause());
    } catch (error) {
      console.error(error);
      throw new Error("Failed to setup consumer");
    }
  }

  return { setupConsumer };
}
