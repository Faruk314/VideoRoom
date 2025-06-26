import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getParticipants } from "redis/methods/participant";

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

export { getChannel };
