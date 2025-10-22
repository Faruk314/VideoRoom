import { Server, Socket } from "socket.io";
import {
  channelExists as channelExistsRedis,
  joinChannel,
  leaveChannel,
} from "redis/methods/channel";
import {
  createParticipant,
  deleteParticipant,
  getParticipant,
  updateParticipant,
} from "redis/methods/participant";
import { ChannelIdSchema } from "validation/channel";
import { cleanupPeerResources } from "msoup/methods/peer";
import { channelReconnectQueue } from "redis/queues/channelReconnect";
import { deleteChannel as deleteChannelDb } from "db/channel";

class ChannelListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("joinChannel", this.onJoinChannel.bind(this));
    this.socket.on("leaveChannel", this.onLeaveChannel.bind(this));
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

    const exists = await channelExistsRedis(channelId);

    if (!exists)
      return callback({ error: true, message: "Channel does not exist" });

    const participant = (await getParticipant(this.socket.userId)).participant;

    if (participant && participant.currentChannel === channelId) {
      const reconnectTimer = await channelReconnectQueue.getJob(
        `reconnectTimer-${participant.user.userId + channelId}`
      );

      if (reconnectTimer) await reconnectTimer.remove();

      await updateParticipant(participant.user.userId, { connected: true });

      this.socket.join(channelId);

      this.socket.to(channelId).emit("participantReconnected", {
        userId: participant.user.userId,
      });

      return callback({
        error: false,
        message: "Reconnected succesfully",
        data: { channelId },
      });
    }

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
      .emit("participantJoined", { participant: response.participant });

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

    if (response.error) console.error(response.message);

    const res = await deleteParticipant(this.socket.userId);

    if (res.error) console.error(res.message);

    const exist = await channelExistsRedis(channelId);

    if (!exist) {
      await deleteChannelDb(channelId);
    } else {
      this.io.to(channelId).emit("participantLeft", {
        userId: this.socket.userId,
      });
    }

    callback({ error: false, message: "Channel left" });
  }
}

export default ChannelListeners;
