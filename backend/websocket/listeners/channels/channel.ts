import { Server, Socket } from "socket.io";
import { nanoid } from "nanoid";
import { joinChannel } from "redis/methods/channel";
import { createParticipant } from "redis/methods/participant";

class ChannelListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("createChannel", this.onCreateChannel.bind(this));
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

    callback({ error: false, message: response.message, data: { channelId } });
  }
}

export default ChannelListeners;
