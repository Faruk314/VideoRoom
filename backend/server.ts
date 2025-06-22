import * as http from "http";
import { initMediasoupWorker } from "mediasoup/methods/worker";
import { Server as ServerIO, Socket } from "socket.io";
import redis from "redis/client";
import { env } from "env";

const httpServer = http.createServer();

const io = new ServerIO(httpServer, {
  path: "/ws",
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
});

async function main() {
  await initMediasoupWorker();

  io.on("connection", (socket: Socket) => {
    console.log(`user connected with id ${socket.id}`);
  });

  httpServer.listen(3000, () => {
    console.log(`✅ Socket.IO server running on ${process.env.FRONTEND_URL}`);
  });
}

main().catch((err) => {
  console.error("Fatal server error:", err);
  process.exit(1);
});
