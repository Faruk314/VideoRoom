import { Server, Socket } from "socket.io";
import { nanoid } from "nanoid";
import {
  channelExists,
  joinChannel,
  leaveChannel,
} from "redis/methods/channel";
import {
  createParticipant,
  deleteParticipant,
} from "redis/methods/participant";
import { ChannelIdSchema } from "validation/channel";
import { cleanupPeerResources } from "msoup/methods/peer";

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
    this.socket.on("leaveChannel", this.onLeaveChannel.bind(this));
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

    const exists = await channelExists(channelId);

    if (!exists)
      return callback({ error: true, message: "Channel does not exist" });

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

    this.socket
      .to(channelId)
      .emit("participantJoined", { participant: response.user });

    this.socket.join(channelId);

    callback({
      error: false,
      message: "Channel joined succesfully",
      data: { channelId },
    });
  }

  async onLeaveChannel(
    unsafeData: { channelId: string },
    callback: (response: { error: boolean; message: string }) => void
  ) {
    const { success, data: channelId } = ChannelIdSchema.safeParse(
      unsafeData.channelId
    );

    if (!success)
      return callback({ error: true, message: "Invalid channel ID" });

    this.socket.leave(channelId);

    cleanupPeerResources(this.socket.userId);

    const response = await leaveChannel(channelId, this.socket.userId);

    if (response.error) {
      return callback({
        error: true,
        message: "Failed to remove participant from channel",
      });
    }

    const res = await deleteParticipant(this.socket.userId);

    if (res.error) {
      return callback({ error: true, message: "Failed to delete participant" });
    }

    this.io.to(channelId).emit("participantLeft", {
      userId: this.socket.userId,
    });

    callback({ error: false, message: "Channel left" });
  }
}

export default ChannelListeners;
