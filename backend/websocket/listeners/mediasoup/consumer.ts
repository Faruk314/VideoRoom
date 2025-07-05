import { types } from "mediasoup";
import { setupConsumerListeners } from "mediasoup/methods/consumer";
import { getPeer } from "mediasoup/methods/peer";
import { producers } from "mediasoup/methods/producer";
import { getOrCreateRouter } from "mediasoup/methods/router";
import { Server, Socket } from "socket.io";

class ConsumerListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("createConsumer", this.onCreateConsumer.bind(this));
  }

  async onCreateConsumer(
    data: {
      recvTransportId: string;
      producerId: string;
      rtpCapabilities: types.RtpCapabilities;
    },
    callback: (response: {
      error: boolean;
      message: string;
      data?: {
        id: string;
        producerId: string;
        kind: types.MediaKind;
        rtpParameters: types.RtpParameters;
        appData: types.AppData;
      };
    }) => void
  ) {
    const { recvTransportId, producerId, rtpCapabilities } = data;

    const peer = getPeer(this.socket.userId);

    if (!peer) {
      return callback({ error: true, message: "Peer state not found" });
    }

    const router = await getOrCreateRouter(peer.currentChannelId);

    if (!router) {
      return callback({ error: true, message: "Mediasoup Router not found" });
    }

    const recvTransport = peer.recvTransport;

    if (!recvTransport || recvTransport.id !== recvTransportId) {
      return callback({
        error: true,
        message: `Client's receive transport ${recvTransportId} not found or transport id mismatch`,
      });
    }

    const producerToConsume = producers.get(producerId);

    if (!producerToConsume) {
      return callback({
        error: true,
        message: `Producer to consume with id ${producerId} not found`,
      });
    }

    if (
      !router.canConsume({ producerId: producerToConsume.id, rtpCapabilities })
    ) {
      return callback({
        error: true,
        message:
          "Router cannot consume this producer with provided RTP capabilities",
      });
    }

    try {
      const consumer = await recvTransport.consume({
        producerId: producerToConsume.id,
        rtpCapabilities,
        paused: producerToConsume.paused,
        appData: producerToConsume.appData,
      });

      peer.consumers?.set(consumer.id, consumer);

      setupConsumerListeners(this.socket, peer, consumer);

      callback({
        error: false,
        message: "Consumer created successfully",
        data: {
          id: consumer.id,
          producerId: producerToConsume.id,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
          appData: consumer.appData,
        },
      });
    } catch {
      callback({
        error: true,
        message: "Failed to create consumer",
      });
    }
  }
}

export default ConsumerListeners;
