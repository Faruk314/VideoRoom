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

interface IUser {
  socketId: string;
  name: string;
  micMuted: boolean;
  camMuted: boolean;
  deafened: boolean;
  currentRoom: string;
  connected: boolean;
}

export type { IPeer, IUser };
