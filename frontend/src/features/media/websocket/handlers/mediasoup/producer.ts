import type { types } from "mediasoup-client";
import { useCallback } from "react";
import useConsumer from "../../../hooks/useConsumer";
import useConsumerEmitters from "../../emitters/mediasoup/consumer";
import { useMediasoupStore } from "../../../store/mediasoup";
import { useParticipantStore } from "../../../../channel/store/remoteParticipant";

export default function useProducerHandlers() {
  const { emitCreateConsumer } = useConsumerEmitters();
  const { setupConsumer } = useConsumer();
  const { getParticipant, removeParticipantConsumer } = useParticipantStore();

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
    []
  );

  const onProducerClosed = useCallback(
    (producerData: { producerId: string; userId: string }) => {
      const { producerId, userId } = producerData;

      const participant = getParticipant(userId);

      if (!participant) return console.error("Participant not found");

      const consumers = participant.consumers;

      (["audio", "video", "screen"] as const).forEach((type) => {
        const consumer = consumers[type];

        if (consumer?.producerId === producerId) {
          consumer.close?.();
          consumer.track?.stop?.();

          removeParticipantConsumer(userId, type);
        }
      });
    },
    []
  );

  return { onNewProducer, onProducerClosed };
}
