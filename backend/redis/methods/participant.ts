import redis from "redis/client";
import { IUser } from "types/types";

const CHANNEL_PARTICIPANT_KEY = "channel:participant";

async function createParticipant(data: {
  userId: string;
  userName: string;
  channelId: string;
}) {
  const { userId, userName, channelId } = data;

  const user = {
    user: {
      userId,
      userName,
    },
    micMuted: false,
    camMuted: false,
    deafened: false,
    isStreaming: false,
    currentChannel: channelId,
    connected: false,
  };

  try {
    await redis.hset(CHANNEL_PARTICIPANT_KEY, userId, JSON.stringify(user));

    return { error: false, message: "User created successfully", user };
  } catch {
    return { error: true, message: "Failed to create user" };
  }
}

async function updateParticipant(userId: string, updates: Partial<IUser>) {
  try {
    const { user, error, message } = await getParticipant(userId);

    if (error || !user) {
      return { error, message };
    }

    Object.assign(user, updates);

    await redis.hset(CHANNEL_PARTICIPANT_KEY, userId, JSON.stringify(user));

    return { error: false, message: "User updated successfully", user };
  } catch {
    return { error: true, message: "Failed to update user" };
  }
}

async function deleteParticipant(userId: string) {
  try {
    const exists = await redis.hexists(CHANNEL_PARTICIPANT_KEY, userId);

    if (!exists) {
      return { error: true, message: "User not found" };
    }

    await redis.hdel(CHANNEL_PARTICIPANT_KEY, userId);

    return { error: false, message: "User deleted successfully" };
  } catch {
    return { error: true, message: "Failed to delete user" };
  }
}

async function getParticipant(userId: string) {
  try {
    const userJSON = await redis.hget(CHANNEL_PARTICIPANT_KEY, userId);

    if (!userJSON) {
      return { error: true, message: "User not found", user: null };
    }

    const user = JSON.parse(userJSON);

    return { error: false, user };
  } catch {
    return { error: true, message: "Failed to retrieve user", user: null };
  }
}

async function getParticipants(channelId: string) {
  try {
    const participantIds = await redis.smembers(
      `channel:participants:${channelId}`
    );

    const participants = await Promise.all(
      participantIds.map(async (userId) => {
        const data = await getParticipant(userId);

        return data.user;
      })
    );

    return participants;
  } catch {
    throw new Error("Coult not fetch participants");
  }
}

export {
  createParticipant,
  updateParticipant,
  deleteParticipant,
  getParticipant,
  getParticipants,
};
