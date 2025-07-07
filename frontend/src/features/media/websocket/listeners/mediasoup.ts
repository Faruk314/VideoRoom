import { useSocket } from "../../../../hooks/useSocket";
import { useSocketEvent } from "../../../../hooks/useSocketEvent";
import useProducerHandlers from "../handlers/mediasoup/producer";

export default function useMediasoupEvents() {
  const { socket } = useSocket();
  const { onNewProducer, onProducerClosed } = useProducerHandlers();

  useSocketEvent(socket, "newProducer", onNewProducer);

  useSocketEvent(socket, "producerClosed", onProducerClosed);
}
