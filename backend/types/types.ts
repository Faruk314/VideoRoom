import { types } from "mediasoup";
import { IceParameters, IceCandidate, DtlsParameters } from "mediasoup/types";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

declare module "socket.io" {
  interface Socket {
    userId: string;
    userName: string;
  }
}

interface IPeer {
  userId: string;
  socketId: string;
  currentChannelId: string;
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

interface ITransport {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
  iceServers: { urls: string }[];
}

export type { IPeer, IUser, ITransport };
