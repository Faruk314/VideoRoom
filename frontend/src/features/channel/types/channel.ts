import type { IUser } from "../../user/types/user";
import { Consumer } from "mediasoup-client/types";

interface IParticipant {
  user: IUser;
  micMuted: false;
  camMuted: false;
  isStreaming: false;
  deafened: false;
  connected: false;
  consumers: Consumer[];
}

export type { IParticipant };
