import { types } from "mediasoup";
import { getPeer } from "msoup/methods/peer";
import { producers, setupProducerListeners } from "msoup/methods/producer";
import { mediasoupState } from "msoup/methods/state";
import { updateParticipant } from "redis/methods/participant";
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
    this.socket.on("closeProducer", this.onCloseProducer.bind(this));
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

    const existingProducer = Array.from(peer.producers.values()).find(
      (p) => p.kind === kind && p.appData?.streamType === appData.streamType
    );

    if (existingProducer) {
      return callback({
        error: true,
        message: `Producer for kind '${kind}' and streamType '${appData.streamType}' already exists.`,
      });
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
        appData: { ...appData, userId: this.socket.userId },
      });

      peer.producers?.set(producer.id, producer);

      producers.set(producer.id, producer);

      setupProducerListeners(this.socket, peer, producer);

      if (appData.streamType === "screen")
        await updateParticipant(this.socket.userId, { isStreaming: true });

      if (appData.streamType === "video")
        await updateParticipant(this.socket.userId, { camMuted: false });

      if (appData.streamType === "audio") {
        await updateParticipant(this.socket.userId, { micMuted: false });

        const channel = mediasoupState.channelMap.get(peer.currentChannelId);

        await channel?.audioLevelObserver.addProducer({
          producerId: producer.id,
        });
      }

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

  async onCloseProducer(
    data: { producerId: string },
    callback: (response: {
      error: boolean;
      message: string;
      data?: { producerId: string };
    }) => void
  ) {
    const { producerId } = data;

    const peer = getPeer(this.socket.userId);

    if (!peer) {
      return callback({ error: true, message: "Peer not found" });
    }

    const producer = peer.producers?.get(producerId);

    if (!producer) {
      return callback({
        error: true,
        message: "Failed to close producer. Producer not found",
      });
    }

    try {
      if (producer.appData.streamType === "screen")
        await updateParticipant(peer.userId, { isStreaming: false });

      if (producer.appData.streamType === "video") {
        await updateParticipant(peer.userId, { camMuted: true });
      }

      if (producer.appData.streamType === "audio") {
        await updateParticipant(peer.userId, { micMuted: true });

        const channel = mediasoupState.channelMap.get(peer.currentChannelId);

        await channel?.audioLevelObserver.removeProducer({
          producerId: producer.id,
        });
      }

      producer.close();

      peer.producers?.delete(producerId);

      producers.delete(producerId);

      this.socket
        .to(peer.currentChannelId)
        .emit("producerClosed", { producerId, userId: peer.userId });

      callback({
        error: false,
        message: "Producer closed succesfully",
        data: { producerId },
      });
    } catch (error) {
      callback({ error: true, message: "Failed to close producer" });
    }
  }
}

export default ProducerListeners;
