import { z } from "zod";

export const channelMessageSchema = z.object({
  channelId: z.string().min(1),
  content: z.string().min(1),
});
