import redis from "redis/client";

const CHANNEL_PARTICIPANTS_KEY = "channel:participants";

async function joinChannel(channelId: string, userId: string) {
  try {
    await redis.sadd(`${CHANNEL_PARTICIPANTS_KEY}:${channelId}`, userId);

    return { error: false, message: "Channel joined succesfully" };
  } catch {
    return { error: true, message: "Server error while joining channel" };
  }
}

async function leaveChannel(channelId: string, userId: string) {
  try {
    await redis.srem(`${CHANNEL_PARTICIPANTS_KEY}:${channelId}`, userId);

    return { error: false, message: "Left channel successfully" };
  } catch {
    return { error: true, message: "Server error while leaving channel" };
  }
}

export { joinChannel, leaveChannel };
