import { types } from "mediasoup";
import { getPeer } from "mediasoup/methods/peer";
import { setupProducerListeners } from "mediasoup/methods/producer";
import { Server, Socket } from "socket.io";

class ProducerListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("createProducer", this.onCreateProducer.bind(this));
  }

  async onCreateProducer(
    data: {
      transportId: string;
      kind: types.MediaKind;
      rtpParameters: types.RtpParameters;
      appData: types.AppData;
    },
    callback: (response: {
      error: boolean;
      message: string;
      data?: { producerId: string };
    }) => void
  ) {
    const { transportId, kind, rtpParameters, appData } = data;

    const peer = getPeer(this.socket.userId);

    if (!peer) {
      return callback({ error: true, message: "Peer state not found" });
    }

    const sendTransport = peer.sendTransport;

    if (!sendTransport || sendTransport.id !== transportId) {
      return callback({
        error: true,
        message: "Send Transport not found or ID mismatch",
      });
    }

    try {
      const producer = await sendTransport.produce({
        kind,
        rtpParameters,
        appData,
      });

      peer.producers?.set(producer.id, producer);

      setupProducerListeners(this.socket, peer, producer);

      this.socket.to(peer.currentChannelId).emit("newProducer", {
        producerId: producer.id,
        userId: this.socket.userId,
        kind: producer.kind,
        appData: producer.appData,
      });

      callback({
        error: false,
        message: "Producer created successfully",
        data: { producerId: producer.id },
      });
    } catch {
      callback({ error: true, message: "Failed to create backend producer" });
    }
  }
}

export default ProducerListeners;
