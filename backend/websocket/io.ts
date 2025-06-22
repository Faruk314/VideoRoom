import { Server as ServerIO, Socket } from "socket.io";
import { env } from "../env";

function createSocketServer(httpServer: import("http").Server) {
  const io = new ServerIO(httpServer, {
    path: "/ws",
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`user connected with id ${socket.id}`);
  });
}

export { createSocketServer };
