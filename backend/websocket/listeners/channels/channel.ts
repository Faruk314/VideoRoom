import { Server, Socket } from "socket.io";
import { nanoid } from "nanoid";
import { joinChannel } from "redis/methods/channel";
import { createParticipant } from "redis/methods/participant";
import { ChannelIdSchema } from "validation/channel";
import { createPeer } from "mediasoup/methods/peer";

class ChannelListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("createChannel", this.onCreateChannel.bind(this));
    this.socket.on("joinChannel", this.onJoinChannel.bind(this));
  }

  async onCreateChannel(
    callback: (response: {
      error: boolean;
      message?: string;
      data?: { channelId: string };
    }) => void
  ) {
    const channelId = nanoid(8);

    const response = await joinChannel(channelId, this.socket.userId);

    if (response.error)
      return callback({ error: true, message: response.message });

    await createParticipant({
      userId: this.socket.userId,
      userName: this.socket.userName,
      channelId,
    });

    this.socket.join(channelId);

    callback({ error: false, message: response.message, data: { channelId } });
  }

  async onJoinChannel(
    unsafeData: { channelId: string },
    callback: (response: {
      error: boolean;
      message: string;
      data?: { channelId: string };
    }) => void
  ) {
    const { success, data: channelId } = ChannelIdSchema.safeParse(
      unsafeData.channelId
    );

    if (!success)
      return callback({ error: true, message: "Invalid channel ID" });

    const response = await createParticipant({
      userId: this.socket.userId,
      userName: this.socket.userName,
      channelId,
    });

    if (response.error)
      return callback({ error: true, message: "Error joining channel" });

    const data = await joinChannel(channelId, this.socket.userId);

    if (data.error) {
      return callback({ error: true, message: "Error joining channel" });
    }

    this.io
      .to(channelId)
      .emit("participantJoined", { participant: response.user });

    this.socket.join(channelId);

    callback({
      error: false,
      message: "Channel joined succesfully",
      data: { channelId },
    });
  }
}

export default ChannelListeners;
