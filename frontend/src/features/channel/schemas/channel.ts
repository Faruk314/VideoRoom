import { z } from "zod";

const ChannelIdSchema = z
  .string()
  .length(8, "Channel ID must be exactly 8 characters long")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Channel ID can only contain letters, numbers, hyphens, and underscores"
  );

export { ChannelIdSchema };
