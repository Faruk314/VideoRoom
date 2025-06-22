import { types } from "mediasoup";

interface IPeer {
  peerId: string;
  userId: string;
  name: string;
  channelId: string;
  sendTransport?: types.WebRtcTransport;
  recvTransport?: types.WebRtcTransport;
  producers?: Map<string, types.Producer>;
  consumers?: Map<string, types.Consumer>;
}

export type { IPeer };
