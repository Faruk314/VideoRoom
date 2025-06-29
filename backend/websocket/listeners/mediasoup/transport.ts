import { getOrCreateRouter } from "mediasoup/methods/router";
import { Server, Socket } from "socket.io";
import { types } from "mediasoup";

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

  onCreateTransport() {}

  onConnectTransport() {}
}

export default TransportListeners;
