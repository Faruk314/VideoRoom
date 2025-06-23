import { defineConfig } from "drizzle-kit";
import { env } from "env";

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schema.ts",
  strict: true,
  verbose: true,
  dialect: "postgresql",
  dbCredentials: {
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
    user: env.DB_USER,
    database: env.DB_NAME,
    host: env.DB_HOST,
    ssl: false,
  },
});
