import { Queue } from "bullmq";
import redis from "redis/client";

export const channelReconnectQueue = new Queue("channel-reconnect", {
  connection: redis,
});
