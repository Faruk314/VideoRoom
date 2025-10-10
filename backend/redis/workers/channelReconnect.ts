import { Worker } from "bullmq";
import redis from "redis/client";
import { leaveChannel } from "redis/methods/channel";
import { deleteParticipant } from "redis/methods/participant";
import { getIO } from "websocket/io";

export const channelReconnectWorker = new Worker(
  "channel-reconnect",
  async (job) => {
    const { channelId, disconnectedUserId } = job.data;
    const io = getIO();

    const response = await leaveChannel(channelId, disconnectedUserId);

    if (response.error) {
      return console.error("Reconnect worker fail", response.message);
    }

    const data = await deleteParticipant(disconnectedUserId);

    if (data.error) {
      return console.error("Reconnect worker fail", data.message);
    }

    io.to(channelId).emit("participantLeft", {
      userId: disconnectedUserId,
    });
  },
  {
    connection: redis,
  }
);

channelReconnectWorker.on("completed", (job) => {
  console.log("channel reconnect completed");
});

channelReconnectWorker.on("failed", (job) => {
  console.log("channel reconnect failed");
});
