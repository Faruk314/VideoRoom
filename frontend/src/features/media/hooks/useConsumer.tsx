import type { types } from "mediasoup-client";
import { useParticipantStore } from "../../channel/store/participant";
import { useMediasoupStore } from "../store/mediasoup";

export default function useConsumer() {
  const { updateParticipantConsumers, removeParticipantConsumer } =
    useParticipantStore();

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

      updateParticipantConsumers(consumerData.userId, consumer);

      consumer.on("transportclose", () => {
        removeParticipantConsumer(consumerData.userId, consumer.id);
      });

      consumer.on("@close", () => {
        removeParticipantConsumer(consumerData.userId, consumer.id);
      });

      consumer.on("trackended", () => {
        removeParticipantConsumer(consumerData.userId, consumer.id);
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
