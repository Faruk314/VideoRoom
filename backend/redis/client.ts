import Redis from "ioredis";
import { env } from "env";

const redis = new Redis({
  port: env.REDIS_PORT || 6379,
  host: env.REDIS_HOST,
  password: env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export default redis;
