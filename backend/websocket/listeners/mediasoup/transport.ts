import { getOrCreateRouter } from "mediasoup/methods/router";
import { Server, Socket } from "socket.io";
import { types } from "mediasoup";
import { createWebRtcTransport } from "mediasoup/methods/transport";
import { getPeer } from "mediasoup/methods/peer";
import { ITransport } from "types/types";

class TransportListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("getRtpCapabilities", this.onGetRtpCapabilities.bind(this));

    this.socket.on("createTransport", this.onCreateTransport.bind(this));

    this.socket.on("connectTransport", this.onConnectTransport.bind(this));
  }

  async onGetRtpCapabilities(
    {
      channelId,
    }: {
      channelId: string;
    },
    callback: (response: {
      error: boolean;
      message: string;
      data?: { routerRtpCapabilities: types.RtpCapabilities };
    }) => void
  ) {
    try {
      const router = await getOrCreateRouter(channelId);

      callback({
        error: false,
        message: "Success geting routers rtp capabilities",
        data: { routerRtpCapabilities: router.rtpCapabilities },
      });
    } catch {
      callback({
        error: true,
        message: "Error geting routers rtp capabilities",
      });
    }
  }

  async onCreateTransport(
    callback: (response: {
      error: boolean;
      message: string;
      data?: { sendTransport: ITransport; recvTransport: ITransport };
    }) => void
  ) {
    const peer = getPeer(this.socket.userId);

    if (!peer) {
      return callback({ error: true, message: "Peer state not found" });
    }

    const { currentChannelId: channelId } = peer;

    const router = await getOrCreateRouter(channelId);

    if (!router) {
      return callback({ error: true, message: "Mediasoup router not found" });
    }

    const sendTransport = await createWebRtcTransport(router, peer, "send");

    if (!sendTransport) {
      return callback({
        error: true,
        message: "Failed to create send transport",
      });
    }

    const recvTransport = await createWebRtcTransport(router, peer, "recv");

    if (!recvTransport) {
      return callback({
        error: true,
        message: "Failed to create send transport",
      });
    }

    callback({
      error: false,
      message: "Transport created successfully",
      data: { sendTransport, recvTransport },
    });
  }

  onConnectTransport() {}
}

export default TransportListeners;
