import { env } from "env";
import * as http from "http";
import authRoutes from "./routes/auth";
import { initMediasoupWorker } from "mediasoup/methods/worker";
import { createSocketServer } from "websocket/io";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "middlewares/error";

async function main() {
  await initMediasoupWorker();

  const app = express();

  const server = http.createServer(app);

  createSocketServer(server);

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  server.listen(env.BACKEND_PORT, () => {
    console.log(`✅ Server running on port ${env.BACKEND_PORT}`);
  });

  app.use("/api/auth", authRoutes);

  app.use(errorHandler);
}

main().catch((err) => {
  console.error("Fatal server error:", err);
  process.exit(1);
});
