import * as http from "http";
import { Server as ServerIO, Socket } from "socket.io";

const httpServer = http.createServer();

const io = new ServerIO(httpServer, {
  path: "/ws",
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

async function main() {
  io.on("connection", (socket: Socket) => {
    console.log(`user connected with id ${socket.id}`);
  });

  httpServer.listen(3000, () => {
    console.log("✅ Socket.IO server running on http://localhost:3000");
  });
}

main().catch((err) => {
  console.error("Fatal server error:", err);
  process.exit(1);
});
