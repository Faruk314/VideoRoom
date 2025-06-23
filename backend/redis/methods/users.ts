import redis from "redis/client";
import { IUser } from "types/types";

const USERS_KEY = "users";

async function createUser(data: {
  userId: string;
  socketId: string;
  roomId: string;
}) {
  const { userId, socketId, roomId } = data;

  const user = {
    socketId,
    micMuted: false,
    camMuted: false,
    deafened: false,
    currentRoom: roomId,
    connected: false,
  };

  try {
    await redis.hset(USERS_KEY, userId, JSON.stringify(user));

    return { error: false, message: "User created successfully", user };
  } catch {
    return { error: true, message: "Failed to create user" };
  }
}

async function updateUser(userId: string, updates: Partial<IUser>) {
  try {
    const { user, error, message } = await getUser(userId);

    if (error || !user) {
      return { error, message };
    }

    Object.assign(user, updates);

    await redis.hset(USERS_KEY, userId, JSON.stringify(user));

    return { error: false, message: "User updated successfully", user };
  } catch {
    return { error: true, message: "Failed to update user" };
  }
}

async function getUser(userId: string) {
  try {
    const userJSON = await redis.hget(USERS_KEY, userId);

    if (!userJSON) {
      return { error: true, message: "User not found", user: null };
    }

    const user = JSON.parse(userJSON);

    return { error: false, user };
  } catch {
    return { error: true, message: "Failed to retrieve user", user: null };
  }
}

export { createUser, getUser, updateUser };
