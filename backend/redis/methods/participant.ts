import redis from "redis/client";
import { IUser } from "types/types";

const CHANNEL_PARTICIPANT_KEY = "channel:participant";

async function createParticipant(data: {
  userId: string;
  userName: string;
  channelId: string;
}) {
  const { userId, userName, channelId } = data;

  const participant = {
    user: {
      userId,
      userName,
    },
    micMuted: true,
    camMuted: true,
    deafened: false,
    isStreaming: false,
    currentChannel: channelId,
    connected: true,
  };

  try {
    await redis.hset(
      CHANNEL_PARTICIPANT_KEY,
      userId,
      JSON.stringify(participant)
    );

    return {
      error: false,
      message: "Participant created successfully",
      participant,
    };
  } catch {
    return { error: true, message: "Failed to create participant" };
  }
}

async function updateParticipant(userId: string, updates: Partial<IUser>) {
  try {
    const { participant, error, message } = await getParticipant(userId);

    if (error || !participant) {
      return { error, message };
    }

    Object.assign(participant, updates);

    await redis.hset(
      CHANNEL_PARTICIPANT_KEY,
      userId,
      JSON.stringify(participant)
    );

    return {
      error: false,
      message: "Participant updated successfully",
      participant,
    };
  } catch {
    return { error: true, message: "Failed to update participant" };
  }
}

async function deleteParticipant(participantId: string) {
  try {
    const exists = await redis.hexists(CHANNEL_PARTICIPANT_KEY, participantId);

    if (!exists) {
      return { error: true, message: "Participant not found" };
    }

    await redis.hdel(CHANNEL_PARTICIPANT_KEY, participantId);

    return { error: false, message: "Participant deleted successfully" };
  } catch {
    return { error: true, message: "Failed to delete participant" };
  }
}

async function getParticipant(participantId: string) {
  try {
    const userJSON = await redis.hget(CHANNEL_PARTICIPANT_KEY, participantId);

    if (!userJSON) {
      return {
        error: true,
        message: "Participant not found",
        participant: null,
      };
    }

    const participant = JSON.parse(userJSON);

    return { error: false, participant };
  } catch {
    return {
      error: true,
      message: "Failed to retrieve participant",
      participant: null,
    };
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

        return data.participant;
      })
    );

    return participants;
  } catch {
    throw new Error("Failed to fetch participants");
  }
}

export {
  createParticipant,
  updateParticipant,
  deleteParticipant,
  getParticipant,
  getParticipants,
};
