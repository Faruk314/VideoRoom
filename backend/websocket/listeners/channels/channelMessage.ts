import { insertChannelMessage } from "db/channelMessages";
import { isParticipant } from "redis/methods/participant";
import { Server, Socket } from "socket.io";
import { IChannelMessage } from "types/types";
import { channelMessageSchema } from "validation/channelMessage";

class ChannelMessageListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("sendChannelMessage", this.onSendChannelMessage.bind(this));
  }

  async onSendChannelMessage(
    unsafeData: { channelId: string; content: string },
    callback: (response: {
      error: boolean;
      message?: string;
      data?: IChannelMessage;
    }) => void
  ) {
    const { data, success } = channelMessageSchema.safeParse(unsafeData);

    if (!success) {
      return callback({ error: true, message: "Error sending message" });
    }

    const userId = this.socket.userId;
    const userName = this.socket.userName;

    const { channelId } = data;

    const allowed = await isParticipant(channelId, userId);

    if (!allowed) {
      return callback({
        error: true,
        message: "You are not a member of this channel",
      });
    }

    try {
      const messageData = await insertChannelMessage({
        ...data,
        senderId: userId,
      });

      const newMessage = { ...messageData, sender: { userId, userName } };

      this.socket
        .to(channelId)
        .emit("newChannelMessage", { message: newMessage, channelId });

      callback({ error: false, data: newMessage });
    } catch {
      return callback({ error: true, message: "Error sending message" });
    }
  }
}

export default ChannelMessageListeners;
