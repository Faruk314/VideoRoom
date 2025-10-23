import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getChannelMessages as getChannelMessagesDb } from "db/channelMessages";

const getChannelMessages = asyncHandler(async (req: Request, res: Response) => {
  const { channelId } = req.params;
  const { page } = req.query;

  const currentPage = parseInt(page as string) || 0;

  try {
    const data = await getChannelMessagesDb(channelId, currentPage);

    res.status(200);
    res.json(data);
  } catch {
    throw new Error("Could not fetch channel messages");
  }
});

export { getChannelMessages };
