import { Producer } from "mediasoup/types";
import { Socket } from "socket.io";
import type { IPeer } from "types/types";

const producers = new Map<string, Producer>();

function setupProducerListeners(
  socket: Socket,
  peer: IPeer,
  producer: Producer
) {
  const channelId = peer.currentChannelId;

  producer.on("transportclose", () => {
    peer.producers?.delete(producer.id);
    producers.delete(producer.id);

    socket.to(channelId).emit("producerClosed", { producerId: producer.id });
  });

  producer.on("@close", () => {
    peer.producers?.delete(producer.id);
    producers.delete(producer.id);

    socket.to(channelId).emit("producerClosed", { producerId: producer.id });
  });
}

export { producers, setupProducerListeners };
