import { Consumer } from "mediasoup/types";
import { Socket } from "socket.io";
import { IPeer } from "types/types";

function setupConsumerListeners(
  socket: Socket,
  peer: IPeer,
  consumer: Consumer
) {
  consumer.on("transportclose", () => {
    peer.consumers?.delete(consumer.id);
  });

  consumer.on("producerclose", () => {
    consumer.close();

    peer.consumers?.delete(consumer.id);

    socket.emit("consumerClosed", {
      consumerId: consumer.id,
      producerId: consumer.producerId,
    });
  });
}

export { setupConsumerListeners };
