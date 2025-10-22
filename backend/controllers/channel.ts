import { insertChannel as insertChannelDb } from "db/channel";
import { db } from "drizzle/db";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { joinChannel } from "redis/methods/channel";
import { getParticipants } from "redis/methods/participant";

const createChannel = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) throw new Error("Error creating channel");

  try {
    const { newChannel, response } = await db.transaction(async (trx) => {
      const newChannel = await insertChannelDb({ ownerId: userId }, trx);
      const response = await joinChannel(newChannel.id, userId);

      if (response.error) throw new Error(response.message);

      return { newChannel, response };
    });

    res.status(200).json({
      message: response.message,
      data: { channelId: newChannel.id },
    });
  } catch {
    throw new Error("Error creating channel");
  }
});

const getChannel = asyncHandler(async (req: Request, res: Response) => {
  const { channelId } = req.params;

  try {
    const participants = await getParticipants(channelId);

    res.status(200);
    res.json({ participants });
  } catch {
    throw new Error("Could not fetch channel");
  }
});

export { createChannel, getChannel };
