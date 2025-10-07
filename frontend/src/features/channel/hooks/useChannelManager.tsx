import { useLocalParticipantStore } from "../store/localParticipant";
import useProducerEmitters from "../../media/websocket/emitters/mediasoup/producer";
import type { MediaKind } from "../../media/types/media";

export default function useChannelManager() {
  const { emitCloseProducer } = useProducerEmitters();
  const { removeProducer, removeStream, updateLocalParticipant } =
    useLocalParticipantStore();

  async function stopStream(kind: MediaKind) {
    try {
      const { localParticipant } = useLocalParticipantStore.getState();
      const producer = localParticipant?.producers[kind];
      const stream = localParticipant?.streams[kind];

      if (!producer) return;

      await emitCloseProducer({ producerId: producer.id });

      producer.close();
      stream?.getTracks().forEach((track) => track.stop());

      removeProducer(kind);
      removeStream(kind);

      if (kind === "video") {
        updateLocalParticipant({ camMuted: true });
      } else if (kind === "screen") {
        updateLocalParticipant({ isStreaming: false });
      } else if (kind === "audio") {
        updateLocalParticipant({ micMuted: true });
      }
    } catch (error) {
      console.error(`Failed to stop ${kind} stream`);
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  return {
    stopStream,
  };
}
