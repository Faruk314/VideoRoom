import type { IUser } from "../../user/types/user";
import { Consumer, Producer } from "mediasoup-client/types";

interface IChannelInfo {
  id: string;
}

interface ILocalParticipant {
  user: IUser;
  micMuted: boolean;
  camMuted: boolean;
  isStreaming: boolean;
  deafened: boolean;
  connected: boolean;
  producers: {
    audio?: Producer;
    video?: Producer;
    screen?: Producer;
  };
  streams: {
    audio?: MediaStream;
    video?: MediaStream;
    screen?: MediaStream;
  };
}

interface IParticipant {
  user: IUser;
  micMuted: boolean;
  camMuted: boolean;
  isStreaming: boolean;
  deafened: boolean;
  connected: boolean;
  consumers: {
    audio?: Consumer;
    video?: Consumer;
    screen?: Consumer;
  };
}

export type { IChannelInfo, ILocalParticipant, IParticipant };
