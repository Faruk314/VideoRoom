import type { types } from "mediasoup-client";
import { useCallback } from "react";
import useConsumer from "../../../hooks/useConsumer";
import useConsumerEmitters from "../../emitters/mediasoup/consumer";
import { useMediasoupStore } from "../../../store/mediasoup";
import { useParticipantStore } from "../../../../channel/store/remoteParticipant";
import { useConsumerStore } from "../../../store/consumers";

export default function useProducerHandlers() {
  const { emitCreateConsumer } = useConsumerEmitters();
  const { setupConsumer } = useConsumer();
  const { getParticipant, updateParticipant, removeStream } =
    useParticipantStore();
  const { consumers, removeConsumer } = useConsumerStore();

  const onNewProducer = useCallback(
    async (producerData: {
      producerId: string;
      kind: types.MediaKind;
      appData: types.AppData;
      userId: string;
    }) => {
      try {
        const { recvTransport, device } = useMediasoupStore.getState();

        if (!recvTransport || !device)
          throw new Error(
            "Client recv transport or device not ready to consume"
          );

        const { data } = await emitCreateConsumer({
          recvTransportId: recvTransport.id,
          producerId: producerData.producerId,
          rtpCapabilities: device.rtpCapabilities,
        });

        await setupConsumer({ ...data, userId: producerData.userId });
      } catch (error) {
        console.error(error);
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    [emitCreateConsumer, setupConsumer]
  );

  const onProducerClosed = useCallback(
    (producerData: { producerId: string; userId: string }) => {
      const { producerId, userId } = producerData;

      const participant = getParticipant(userId);

      if (!participant) return console.error("Participant not found");

      const userConsumers = consumers.get(userId);

      if (!userConsumers) return console.error("User consumers not found");

      (["audio", "video", "screen"] as const).forEach((type) => {
        const consumer = userConsumers[type];

        if (consumer?.producerId === producerId) {
          consumer.close?.();
          consumer.track?.stop?.();

          removeConsumer(userId, type);
          removeStream(userId, type);

          if (type === "audio") {
            updateParticipant(userId, { micMuted: true });
          } else if (type === "screen") {
            updateParticipant(userId, { isStreaming: false });
          } else if (type === "video") {
            updateParticipant(userId, { camMuted: true });
          }
        }
      });
    },
    [getParticipant, removeConsumer]
  );

  return { onNewProducer, onProducerClosed };
}
