import type { types } from "mediasoup-client";
import type { IUser } from "../../user/types/user";
import { Consumer, Producer } from "mediasoup-client/types";

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
  producers: {
    producerId: string;
    userId: string;
    kind: types.MediaKind;
    appData: types.AppData;
  }[];
  consumers: {
    audio?: Consumer;
    video?: Consumer;
    screen?: Consumer;
  };
}

export type { ILocalParticipant, IParticipant };
