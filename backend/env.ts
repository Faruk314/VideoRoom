import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export const env = createEnv({
  server: {
    FRONTEND_URL: z.string().min(1),
    BACKEND_PORT: z.string().min(1).transform(Number),

    DB_PASSWORD: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_NAME: z.string().min(1),
    DB_HOST: z.string().min(1),
    DB_PORT: z.string().transform(Number),

    REDIS_HOST: z.string().min(1),
    REDIS_PORT: z.string().min(1).transform(Number),
    REDIS_PASSWORD: z.string().min(1),

    MEDIASOUP_ANNOUNCED_IP: z.string().min(1),
    MEDIASOUP_LISTEN_IP: z.string().min(1),
    MEDIASOUP_PORT: z.string().transform(Number),
    MEDIASOUP_PORT_MIN: z.string().transform(Number),
    MEDIASOUP_PORT_MAX: z.string().transform(Number),
    MEDIASOUP_INITIAL_BITRATE: z.string().transform(Number),
    MEDIASOUP_MAX_SCTP_MESSAGE_SIZE: z.string().transform(Number),
  },
  runtimeEnv: process.env,
});
