import type { IUser } from "../../user/types/user";

interface IChannelInfo {
  id: string;
}

interface IParticipant {
  user: IUser;
  micMuted: boolean;
  camMuted: boolean;
  isStreaming: boolean;
  deafened: boolean;
  connected: boolean;
  streams: {
    audio?: MediaStream;
    video?: MediaStream;
    screen?: MediaStream;
  };
}

export type { IChannelInfo, IParticipant };
