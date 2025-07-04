import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "env";
import * as schema from "./schema";

export const db = drizzle({
  schema,
  connection: {
    password: env.DB_PASSWORD,
    user: env.DB_USER,
    database: env.DB_NAME,
    host: env.DB_HOST,
    port: env.DB_PORT,
  },
});
