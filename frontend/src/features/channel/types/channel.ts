import type { IUser } from "../../user/types/user";
import { Consumer, Producer } from "mediasoup-client/types";

interface ILocalParticipant {
  user: IUser;
  micMuted: false;
  camMuted: false;
  isStreaming: false;
  deafened: false;
  connected: false;
  producers: Producer[];
  streams: MediaStream[];
}

interface IParticipant {
  user: IUser;
  micMuted: false;
  camMuted: false;
  isStreaming: false;
  deafened: false;
  connected: false;
  consumers: Consumer[];
}

export type { ILocalParticipant, IParticipant };
